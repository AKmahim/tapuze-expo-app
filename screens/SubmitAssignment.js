import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';

export default function SubmitAssignment({ navigation, route }) {
  const { assignment, classroom } = route.params;
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Mock user data for visual purposes
  const user = {
    name: "John Doe",
    userId: "STUD001"
  };

  // Mock existing submission for visual demonstration
  const existingSubmission = null; // Set to null or mock data as needed

  const pickDocuments = async () => {
    // Mock file selection for visual demonstration
    Alert.alert(
      'File Selection',
      'File picker functionality removed for demo. This would normally open a document picker.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mock Select',
          onPress: () => {
            // Mock file data for visual demonstration
            setFiles([{
              type: 'document',
              name: 'Assignment_Solution.pdf',
              size: 2048000, // 2MB
              uri: 'mock://file/path',
              mimeType: 'application/pdf'
            }]);
            Alert.alert('Success', 'Mock file "Assignment_Solution.pdf" selected for demonstration!');
          },
        },
      ]
    );
  };

  const handleQuestionPaperDownload = async () => {
    if (!assignment.questionPaper) {
      Alert.alert('No Question Paper', 'This assignment does not have a question paper attached.');
      return;
    }

    Alert.alert(
      'Download Question Paper',
      `Download functionality removed for demo. This would normally download "${assignment.questionPaperName || 'Question Paper'}".`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mock Download',
          onPress: () => {
            setIsDownloading(true);
            setTimeout(() => {
              setIsDownloading(false);
              Alert.alert('Download Complete', 'Mock download completed for demonstration!');
            }, 2000);
          },
        },
      ]
    );
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      Alert.alert('Error', 'Please select a file to submit');
      return;
    }

    const action = existingSubmission ? 'resubmit' : 'submit';
    const actionText = existingSubmission ? 'Resubmit' : 'Submit';
    
    Alert.alert(
      `${actionText} Assignment`,
      `Submission functionality removed for demo. This would normally ${action.toLowerCase()} "${assignment.title}".${existingSubmission ? ' This would replace your previous submission.' : ''}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: `Mock ${actionText}`,
          style: existingSubmission ? 'destructive' : 'default',
          onPress: () => {
            setIsSubmitting(true);
            setTimeout(() => {
              setIsSubmitting(false);
              const successMessage = existingSubmission 
                ? `Mock resubmission of "${assignment.title}" completed!`
                : `Mock submission of "${assignment.title}" completed!`;
              Alert.alert('Demo Success', successMessage);
              navigation.goBack();
            }, 2000);
          },
        },
      ]
    );
  };

  const clearSelection = () => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove the selected file?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => setFiles([]),
        },
      ]
    );
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = new Date(assignment.dueDate) < new Date();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Submit Assignment</Text>
      <Text style={styles.assignmentTitle}>{assignment.title}</Text>
      <Text style={styles.classroomName}>For: {classroom.name}</Text>
      <Text style={styles.studentInfo}>Student: {user.name} ({user.userId})</Text>
      
      {/* Assignment Description */}
      {assignment.description && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>📝 Description</Text>
          <Text style={styles.descriptionText}>{assignment.description}</Text>
        </View>
      )}

      {/* Due Date Information */}
      <View style={[styles.dueDateContainer, isOverdue && styles.overdueContainer]}>
        <Text style={styles.dueDateLabel}>Due Date:</Text>
        <Text style={[styles.dueDateText, isOverdue && styles.overdue]}>
          {new Date(assignment.dueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          {isOverdue && ' (Overdue)'}
        </Text>
      </View>

      {/* Previous Submission Info */}
      {existingSubmission && (
        <View style={styles.existingSubmissionContainer}>
          <Text style={styles.existingSubmissionTitle}>📋 Previous Submission</Text>
          <Text style={styles.existingSubmissionText}>
            Submitted: {formatDate(existingSubmission.submittedAt)}
          </Text>
          <Text style={styles.existingSubmissionText}>
            File: {existingSubmission.files[0]?.name || 'Unknown file'}
          </Text>
          <Text style={styles.resubmissionNote}>
            You can resubmit to replace your previous submission.
          </Text>
        </View>
      )}

      {/* Question Paper Section */}
      {assignment.questionPaper && (
        <View style={styles.questionPaperContainer}>
          <Text style={styles.sectionTitle}>📄 Question Paper</Text>
          <View style={styles.questionPaperInfo}>
            <View style={styles.questionPaperDetails}>
              <Text style={styles.questionPaperName}>
                {assignment.questionPaperName || 'Question Paper'}
              </Text>
              <Text style={styles.questionPaperSubtext}>
                Tap to download the assignment question paper
              </Text>
            </View>
            <TouchableOpacity 
              style={[
                styles.downloadButton,
                isDownloading && styles.downloadingButton
              ]}
              onPress={handleQuestionPaperDownload}
              disabled={isDownloading}
            >
              <Text style={styles.downloadButtonText}>
                {isDownloading ? '⏳ Downloading...' : '📥 Download'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* File Upload Section */}
      <View style={styles.uploadSection}>
        <Text style={styles.sectionTitle}>📤 Your Submission</Text>
        
        <TouchableOpacity 
          style={styles.uploadButton} 
          onPress={pickDocuments}
          disabled={isSubmitting}
        >
          <Text style={styles.uploadButtonText}>
            {files.length > 0 ? '🔄 Change Document' : '📎 Select Document'}
          </Text>
        </TouchableOpacity>

        {files.length > 0 ? (
          <View style={styles.fileContainer}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={2}>{files[0].name}</Text>
              <Text style={styles.fileDetails}>
                {files[0].mimeType?.split('/')[1]?.toUpperCase() || 'Document'} • {formatFileSize(files[0].size)}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.removeButton} 
              onPress={clearSelection}
              disabled={isSubmitting}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noFileContainer}>
            <Text style={styles.noFileText}>📂 No file selected</Text>
            <Text style={styles.noFileSubtext}>Select a document to submit your assignment</Text>
          </View>
        )}

        <Text style={styles.supportedFormats}>
          📋 Supported formats: PDF, DOC, DOCX, Images (Max: 10MB)
        </Text>
      </View>
      
      {/* Submit Button */}
      <TouchableOpacity 
        style={[
          styles.submitButton, 
          files.length === 0 && styles.disabledButton,
          isSubmitting && styles.loadingButton
        ]}
        onPress={handleSubmit}
        disabled={files.length === 0 || isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting 
            ? '⏳ Submitting...' 
            : files.length > 0 
              ? existingSubmission 
                ? '🔄 Resubmit Assignment' 
                : '✅ Submit Assignment'
              : '📎 Select a file to submit'
          }
        </Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
    color: '#2c3e50',
    paddingHorizontal: 20,
  },
  assignmentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
    color: '#34495e',
    paddingHorizontal: 20,
  },
  classroomName: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  studentInfo: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#95a5a6',
    fontStyle: 'italic',
  },
  descriptionContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#9b59b6',
  },
  descriptionText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
  },
  dueDateContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  overdueContainer: {
    borderLeftColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  dueDateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  dueDateText: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '500',
  },
  overdue: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  existingSubmissionContainer: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  existingSubmissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  existingSubmissionText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  resubmissionNote: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic',
    marginTop: 8,
  },
  questionPaperContainer: {
    backgroundColor: '#e8f5e8',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  questionPaperInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionPaperDetails: {
    flex: 1,
    marginRight: 10,
  },
  questionPaperName: {
    fontSize: 16,
    color: '#27ae60',
    fontWeight: '500',
    marginBottom: 4,
  },
  questionPaperSubtext: {
    fontSize: 12,
    color: '#27ae60',
    opacity: 0.8,
  },
  downloadButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  downloadingButton: {
    backgroundColor: '#f39c12',
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e0e6ed',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#2c3e50',
  },
  fileDetails: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  removeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noFileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#e0e6ed',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noFileText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 5,
    fontWeight: '500',
  },
  noFileSubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  supportedFormats: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: 12,
    fontStyle: 'italic',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  loadingButton: {
    backgroundColor: '#f39c12',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});