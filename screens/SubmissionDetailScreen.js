import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import Spinner from '../components/Spinner';
import { getSubmissionById } from '../services/apiService';

export default function SubmissionDetailScreen({ navigation, route }) {
  const { submission: initialSubmission, assignment } = route.params;
  const [submission, setSubmission] = useState(initialSubmission);
  const [loading, setLoading] = useState(false);

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
          solution: response.data.solution,
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

  const handleEvaluate = () => {
    navigation.navigate('EvaluationScreen', { submission, assignment });
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
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownload(item)}
      >
        <Text style={styles.downloadButtonText}>Download</Text>
      </TouchableOpacity>
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
          <Text style={styles.dueDate}>Due: {new Date(assignment.dueDate).toLocaleDateString()}</Text>
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
          <Text style={styles.sectionTitle}>File Previews</Text>
          <View style={styles.previewPlaceholder}>
            <Text style={styles.previewText}>File previews will be displayed here</Text>
            <Text style={styles.previewHint}>Multiple file viewer integration coming soon</Text>
          </View>
        </View>
      </ScrollView>

      {/* Always show evaluate button for demo purposes */}
      <TouchableOpacity style={styles.evaluateButton} onPress={handleEvaluate}>
        <Text style={styles.evaluateButtonText}>Evaluate</Text>
      </TouchableOpacity>
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
  downloadButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  previewSection: {
    marginBottom: 16,
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
  evaluateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});