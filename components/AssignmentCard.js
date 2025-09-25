import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function AssignmentCard({ assignment, onPress, userRole, onDelete, onViewSubmissions, studentStatus }) {
  const { user, submissions } = useAuth();

  const handleDelete = () => {
    Alert.alert(
      "Delete Assignment",
      `Are you sure you want to delete "${assignment.title}"?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => onDelete(assignment.id),
          style: "destructive"
        }
      ]
    );
  };

  const handleViewSubmissions = () => {
    onViewSubmissions(assignment);
  };

  // Get student's submission for this assignment to check for AI feedback
  const studentSubmission = submissions.find(sub => 
    sub.assignmentId === assignment.id && sub.studentId === user.userId
  );
  
  const hasAIFeedback = studentSubmission?.evaluation?.feedback;

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Text style={styles.title}>{assignment.title}</Text>
        
        {assignment.description && (
          <Text style={styles.description}>{assignment.description}</Text>
        )}
        
        <Text style={styles.dueDate}>Due: {assignment.dueDate}</Text>
        
        {/* Student Status Indicator */}
        {studentStatus && (
          <Text style={[
            styles.studentStatus,
            studentStatus.includes('Evaluated') ? styles.statusEvaluated : 
            studentStatus.includes('Submitted') ? styles.statusPending : 
            styles.statusNotSubmitted
          ]}>
            {studentStatus}
          </Text>
        )}
        
        {/* AI Feedback Preview */}
        {hasAIFeedback && (
          <View style={styles.feedbackPreview}>
            <Text style={styles.feedbackTitle}>AI Feedback:</Text>
            <Text style={styles.feedbackText} numberOfLines={2}>
              {studentSubmission.evaluation.feedback}
            </Text>
            <Text style={styles.viewFullFeedback}>Tap to view full feedback →</Text>
          </View>
        )}
        
        {userRole === 'lecturer' && (
          <View style={styles.submissionInfo}>
            <Text style={styles.submissionText}>
              {assignment.submissions} / {assignment.totalStudents} submissions
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }
                ]} 
              />
            </View>
          </View>
        )}
      </TouchableOpacity>
      
      {userRole === 'lecturer' && (
        <View style={styles.buttonContainer}>
          {onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          )}
          {onViewSubmissions && (
            <TouchableOpacity style={styles.submissionsButton} onPress={handleViewSubmissions}>
              <Text style={styles.submissionsText}>View Submissions</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  studentStatus: {
    fontSize: 12,
    padding: 6,
    borderRadius: 4,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 10,
    borderWidth: 1,
  },
  statusEvaluated: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    borderColor: '#c8e6c9',
  },
  statusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderColor: '#ffeaa7',
  },
  statusNotSubmitted: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderColor: '#f5c6cb',
  },
  feedbackPreview: {
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
    marginBottom: 10,
  },
  feedbackTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c5282',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 13,
    color: '#4a5568',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  viewFullFeedback: {
    fontSize: 12,
    color: '#4a90e2',
    textAlign: 'right',
    marginTop: 5,
    fontWeight: '500',
  },
  submissionInfo: {
    marginTop: 5,
  },
  submissionText: {
    fontSize: 14,
    color: '#4a90e2',
    marginBottom: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
    gap: 5,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    padding: 5,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  submissionsButton: {
    backgroundColor: '#28a745',
    padding: 5,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  submissionsText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});