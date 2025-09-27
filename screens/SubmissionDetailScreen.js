import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import Spinner from '../components/Spinner';
import { getSubmissionById, evaluateSubmissionWithAI } from '../services/apiService';

export default function SubmissionDetailScreen({ navigation, route }) {
  const { submission: initialSubmission, assignment } = route.params;
  const [submission, setSubmission] = useState(initialSubmission);
  const [loading, setLoading] = useState(false);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showInlinePreview, setShowInlinePreview] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [inlinePdfError, setInlinePdfError] = useState(false);

  // Fetch detailed submission data if needed
  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true);
      const response = await getSubmissionById(submission.id);
      
      if (response.success && response.data) {
        // Update submission with more detailed data from API
        const detailedSubmission = {
          ...submission,
          grade: response.data.grade,
          feedback: response.data.feedback,
          solution: response.data.submission_file,
          submissionTitle: response.data.submission_title,
          submissionDescription: response.data.submission_description,
          // Add any other fields that might be available from the detailed API
        };
        setSubmission(detailedSubmission);
      }
    } catch (error) {
      console.error('Error fetching submission details:', error);
      // Don't show error to user as we already have basic submission data
    } finally {
      setLoading(false);
    }
  };

  // Helper function to construct full PDF URL
  const getFullFileUrl = (relativePath) => {
    if (!relativePath) return null;
    const API_BASE_URL = 'https://tapuze.xrinteractive.site';
    // Remove leading slash if present to avoid double slashes
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return `${API_BASE_URL}/${cleanPath}`;
  };

  // Load detailed submission data on component mount if needed
  useEffect(() => {
    // Only fetch if we don't have all the details we need
    if (!submission.solution && submission.id) {
      fetchSubmissionDetails();
    }
  }, []);
  
  // Dummy evaluation data based on submission status
  const getDummyEvaluation = () => {
    // Only return evaluation data for submissions that are actually graded
    if (submission.status === 'graded' && submission.grade !== null) {
      return {
        id: `EVAL_${submission.id}`,
        submissionId: submission.id,
        overallScore: submission.grade,
        evaluatedAt: '2024-03-16T10:30:00Z',
        feedback: submission.feedback || 'Excellent work! Good understanding of the concepts and clean implementation.',
        parts: [
          {
            part: 'Implementation Quality',
            score: Math.floor(submission.grade * 0.4),
            maxScore: 40,
            feedback: 'Well-structured code with good naming conventions. Clean and readable implementation.'
          },
          {
            part: 'Algorithm Efficiency',
            score: Math.floor(submission.grade * 0.3),
            maxScore: 30,
            feedback: 'Good time complexity analysis. Some optimizations could improve performance.'
          },
          {
            part: 'Documentation & Comments',
            score: Math.floor(submission.grade * 0.2),
            maxScore: 20,
            feedback: 'Adequate documentation. Could benefit from more detailed explanations.'
          },
          {
            part: 'Test Cases',
            score: Math.floor(submission.grade * 0.1),
            maxScore: 10,
            feedback: 'Basic test cases provided. More edge cases would strengthen the solution.'
          }
        ],
        tips: [
          'Consider edge cases in your implementation',
          'Add more comprehensive test cases',
          'Include time and space complexity analysis',
          'Improve code documentation with detailed comments'
        ]
      };
    }
    // Return null for submissions that haven't been graded yet
    return null;
  };

  const evaluation = getDummyEvaluation();

  const handleEvaluate = async () => {
    if (!submission.solution) {
      Alert.alert('Error', 'No submission file found to evaluate.');
      return;
    }

    setLoading(true);
    try {
      // Construct the full PDF URL
      const pdfUrl = getFullFileUrl(submission.solution);
      
      // Call AI evaluation API
      const evaluationResult = await evaluateSubmissionWithAI(pdfUrl);
      
      // Navigate to EvaluationScreen with the AI evaluation result
      navigation.navigate('EvaluationScreen', { 
        submission, 
        assignment,
        aiEvaluation: evaluationResult
      });
    } catch (error) {
      console.error('Evaluation failed:', error);
      Alert.alert(
        'Evaluation Failed',
        error.message || 'Failed to evaluate the submission. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file) => {
    Alert.alert(
      "Download",
      `Download functionality removed for demo. This would normally download ${file.name}.`,
      [
        {
          text: "OK",
          style: "default"
        }
      ]
    );
  };

  const handlePreviewPdf = () => {
    if (submission.solution) {
      setShowPdfPreview(true);
      setPdfError(false);
    } else {
      Alert.alert('Error', 'No file available for preview');
    }
  };

  const closePdfPreview = () => {
    setShowPdfPreview(false);
    setPdfError(false);
  };

  const toggleInlinePreview = () => {
    if (!submission.solution) {
      Alert.alert('Error', 'No file available for preview');
      return;
    }
    setShowInlinePreview(!showInlinePreview);
    setInlinePdfError(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileItem = ({ item, index }) => (
    <View style={styles.fileItem}>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName}>{item.name}</Text>
        <Text style={styles.fileDetails}>
          {item.type.toUpperCase()} • {formatFileSize(item.size)}
        </Text>
      </View>
      <View style={styles.fileActions}>
        {item.type === 'application/pdf' && (
          <>
            <TouchableOpacity
              style={styles.quickPreviewButton}
              onPress={toggleInlinePreview}
            >
              <Text style={styles.quickPreviewButtonText}>
                {showInlinePreview ? 'Hide' : 'Quick'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={handlePreviewPdf}
            >
              <Text style={styles.previewButtonText}>Full</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => handleDownload(item)}
        >
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Spinner />
        <Text style={styles.loadingText}>Loading submission details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Submission Details</Text>

        <View style={styles.assignmentInfo}>
          <Text style={styles.sectionTitle}>Assignment</Text>
          <Text style={styles.assignmentName}>{assignment.title}</Text>
          <Text style={styles.dueDate}>Due: {new Date(assignment.deadline || assignment.dueDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.studentInfo}>
          <Text style={styles.sectionTitle}>Student Information</Text>
          <Text style={styles.infoText}>Name: {submission.studentName}</Text>
          <Text style={styles.infoText}>ID: {submission.studentId}</Text>
        </View>

        <View style={styles.submissionInfo}>
          <Text style={styles.sectionTitle}>Submission Details</Text>
          <Text style={styles.infoText}>Files: {submission.files.length}</Text>
          <Text style={styles.infoText}>Submitted: {new Date(submission.submittedAt).toLocaleString()}</Text>
          <Text style={styles.infoText}>Status: {submission.status}</Text>
        </View>

        {/* AI Evaluation Results Section */}
        {evaluation ? (
          <View style={styles.evaluationSection}>
            <Text style={styles.sectionTitle}>Evaluation Results</Text>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>Score: {evaluation.overallScore}%</Text>
              <Text style={styles.evaluationDate}>
                Evaluated on: {new Date(evaluation.evaluatedAt).toLocaleDateString()}
              </Text>
            </View>

            <Text style={styles.feedbackTitle}>Feedback:</Text>
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackText}>{evaluation.feedback}</Text>
            </View>

            <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
            {evaluation.parts.map((part, index) => (
              <View key={index} style={styles.partEvaluation}>
                <View style={styles.partHeader}>
                  <Text style={styles.partName}>{part.part}</Text>
                  <Text style={styles.partScore}>{part.score}/{part.maxScore}</Text>
                </View>
                <Text style={styles.partFeedback}>{part.feedback}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Improvement Tips</Text>
            <View style={styles.tipsContainer}>
              {evaluation.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.notEvaluatedContainer}>
            <Text style={styles.notEvaluatedText}>This submission hasn't been evaluated yet.</Text>
            <Text style={styles.notEvaluatedSubtext}>
              You can manually evaluate this submission or get AI assistance.
            </Text>
          </View>
        )}

        <View style={styles.filesSection}>
          <Text style={styles.sectionTitle}>Submitted Files</Text>
          <FlatList
            data={submission.files}
            renderItem={renderFileItem}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.previewSection}>
          <View style={styles.previewHeader}>
            <Text style={styles.sectionTitle}>File Preview</Text>
            {submission.files.length > 0 && submission.files[0].type === 'application/pdf' && (
              <TouchableOpacity
                style={styles.togglePreviewButton}
                onPress={toggleInlinePreview}
              >
                <Text style={styles.togglePreviewText}>
                  {showInlinePreview ? '🔼 Hide Preview' : '🔽 Show Preview'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          
          {showInlinePreview && submission.solution ? (
            <View style={styles.inlinePreviewContainer}>
              {!inlinePdfError ? (
                <WebView
                  source={{ 
                    uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(getFullFileUrl(submission.solution))}` 
                  }}
                  style={styles.inlineWebView}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={styles.inlineLoadingContainer}>
                      <Spinner />
                      <Text style={styles.loadingText}>Loading preview...</Text>
                    </View>
                  )}
                  onError={(syntheticEvent) => {
                    console.warn('Inline WebView error: ', syntheticEvent.nativeEvent);
                    setInlinePdfError(true);
                  }}
                  onHttpError={(syntheticEvent) => {
                    console.warn('Inline WebView HTTP error: ', syntheticEvent.nativeEvent);
                    setInlinePdfError(true);
                  }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  scalesPageToFit={true}
                  bounces={false}
                  scrollEnabled={true}
                />
              ) : (
                <View style={styles.inlineErrorContainer}>
                  <Text style={styles.inlineErrorText}>❌ Preview unavailable</Text>
                  <Text style={styles.inlineErrorSubText}>Try the full preview mode</Text>
                  <TouchableOpacity 
                    style={styles.inlineRetryButton} 
                    onPress={() => setInlinePdfError(false)}
                  >
                    <Text style={styles.inlineRetryButtonText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.previewActions}>
                <TouchableOpacity
                  style={styles.fullPreviewButton}
                  onPress={handlePreviewPdf}
                >
                  <Text style={styles.fullPreviewButtonText}>🔍 View Full Screen</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.previewPlaceholder}>
              {submission.files.length > 0 && submission.files[0].type === 'application/pdf' ? (
                <>
                  <Text style={styles.previewText}>📄 PDF Ready for Preview</Text>
                  <Text style={styles.previewHint}>Use buttons above to preview without downloading</Text>
                  <Text style={styles.fileName}>{submission.files[0].name}</Text>
                </>
              ) : (
                <>
                  <Text style={styles.previewText}>No preview available</Text>
                  <Text style={styles.previewHint}>Only PDF files support preview</Text>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* evaluate the submission by ai  */}
      <TouchableOpacity 
        style={[styles.evaluateButton, loading && styles.evaluateButtonDisabled]} 
        onPress={handleEvaluate}
        disabled={loading}
      >
        <Text style={styles.evaluateButtonText}>
          {loading ? 'Evaluating...' : 'Evaluate'}
        </Text>
      </TouchableOpacity>

      {/* PDF Preview Modal */}
      {showPdfPreview && submission.solution && (
        <View style={styles.pdfModal}>
          <View style={styles.pdfHeader}>
            <Text style={styles.pdfTitle}>PDF Preview</Text>
            <TouchableOpacity style={styles.closeButton} onPress={closePdfPreview}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {!pdfError ? (
            <WebView
              source={{ uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(getFullFileUrl(submission.solution))}` }}
              style={styles.pdfViewer}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <Spinner />
                  <Text style={styles.loadingText}>Loading PDF...</Text>
                </View>
              )}
              onError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView error: ', nativeEvent);
                setPdfError(true);
              }}
              onHttpError={(syntheticEvent) => {
                const { nativeEvent } = syntheticEvent;
                console.warn('WebView HTTP error: ', nativeEvent);
                setPdfError(true);
              }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              mediaPlaybackRequiresUserAction={false}
              scalesPageToFit={true}
              bounces={false}
              scrollEnabled={true}
            />
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>❌ Unable to load PDF</Text>
              <Text style={styles.errorSubText}>The file might be corrupted or not accessible.</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => setPdfError(false)}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2c3e50',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#2c3e50',
  },
  assignmentInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  assignmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
  },
  dueDate: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  studentInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  submissionInfo: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 6,
    fontWeight: '500',
  },
  evaluationSection: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#28a745',
  },
  evaluationDate: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2c3e50',
  },
  feedbackBox: {
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
    marginBottom: 16,
  },
  feedbackText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  partEvaluation: {
    marginBottom: 12,
    padding: 14,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
  },
  partScore: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#28a745',
  },
  partFeedback: {
    fontSize: 13,
    color: '#6c757d',
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#f57c00',
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#856404',
    lineHeight: 22,
  },
  notEvaluatedContainer: {
    backgroundColor: '#fff3cd',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffeaa7',
    alignItems: 'center',
  },
  notEvaluatedText: {
    fontSize: 16,
    color: '#856404',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 10,
  },
  notEvaluatedSubtext: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  filesSection: {
    marginBottom: 16,
  },
  fileItem: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  fileDetails: {
    fontSize: 12,
    color: '#6c757d',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 6,
  },
  quickPreviewButton: {
    backgroundColor: '#17a2b8',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  quickPreviewButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  previewButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  previewSection: {
    marginBottom: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  togglePreviewButton: {
    backgroundColor: '#6c757d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  togglePreviewText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  previewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
  },
  previewThumbnail: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  previewPlaceholder: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewText: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  previewHint: {
    fontSize: 12,
    color: '#adb5bd',
    textAlign: 'center',
    marginBottom: 8,
  },
  inlinePreviewContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    overflow: 'hidden',
    marginBottom: 12,
  },
  inlineWebView: {
    height: 400,
    backgroundColor: '#f8f9fa',
  },
  inlineLoadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  inlineErrorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  inlineErrorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  inlineErrorSubText: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 12,
  },
  inlineRetryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  inlineRetryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  previewActions: {
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'center',
  },
  fullPreviewButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullPreviewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  evaluateButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    margin: 16,
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  evaluateButtonDisabled: {
    backgroundColor: '#9ca3af',
    opacity: 0.7,
    shadowColor: '#9ca3af',
  },
  evaluateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // PDF Preview Modal Styles
  pdfModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  pdfHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  pdfTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 8,
    backgroundColor: '#dc3545',
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pdfViewer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  errorSubText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});