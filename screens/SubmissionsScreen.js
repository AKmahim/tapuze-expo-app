import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

export default function SubmissionsScreen({ navigation, route }) {
  const { assignment } = route.params;

  // Dummy student submissions for visual demonstration
  const dummySubmissions = [
    {
      id: 'SUB001',
      studentName: 'Alice Johnson',
      studentId: 'S12345',
      assignmentId: assignment.id,
      fileName: 'DataStructures_Solution.pdf',
      fileSize: 2048000, // 2MB
      submittedAt: '2024-03-14T15:30:00Z',
      status: 'graded',
      grade: 85,
      feedback: 'Excellent implementation of linked lists. Good code structure and documentation.',
      files: [
        {
          name: 'DataStructures_Solution.pdf',
          size: 2048000,
          type: 'application/pdf',
          uri: 'mock://submission1.pdf'
        }
      ]
    },
    {
      id: 'SUB002',
      studentName: 'Bob Chen',
      studentId: 'S12346',
      assignmentId: assignment.id,
      fileName: 'Assignment_BobChen.docx',
      fileSize: 1536000, // 1.5MB
      submittedAt: '2024-03-13T22:45:00Z',
      status: 'submitted',
      grade: null,
      feedback: null,
      files: [
        {
          name: 'Assignment_BobChen.docx',
          size: 1536000,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uri: 'mock://submission2.docx'
        }
      ]
    },
    {
      id: 'SUB003',
      studentName: 'Carol Davis',
      studentId: 'S12347',
      assignmentId: assignment.id,
      fileName: 'DataStructures_Carol.pdf',
      fileSize: 3072000, // 3MB
      submittedAt: '2024-03-15T09:15:00Z',
      status: 'late',
      grade: 72,
      feedback: 'Good effort but submitted after deadline. Some implementation issues with stack operations.',
      files: [
        {
          name: 'DataStructures_Carol.pdf',
          size: 3072000,
          type: 'application/pdf',
          uri: 'mock://submission3.pdf'
        }
      ]
    },
    {
      id: 'SUB004',
      studentName: 'David Wilson',
      studentId: 'S12348',
      assignmentId: assignment.id,
      fileName: 'Assignment1_David.pdf',
      fileSize: 1792000, // 1.75MB
      submittedAt: '2024-03-14T18:20:00Z',
      status: 'graded',
      grade: 92,
      feedback: 'Outstanding work! Excellent understanding of data structures and clean implementation.',
      files: [
        {
          name: 'Assignment1_David.pdf',
          size: 1792000,
          type: 'application/pdf',
          uri: 'mock://submission4.pdf'
        }
      ]
    },
    {
      id: 'SUB005',
      studentName: 'Emma Thompson',
      studentId: 'S12349',
      assignmentId: assignment.id,
      fileName: 'DS_Assignment_Emma.pdf',
      fileSize: 2304000, // 2.25MB
      submittedAt: '2024-03-14T12:10:00Z',
      status: 'submitted',
      grade: null,
      feedback: null,
      files: [
        {
          name: 'DS_Assignment_Emma.pdf',
          size: 2304000,
          type: 'application/pdf',
          uri: 'mock://submission5.pdf'
        }
      ]
    },
    {
      id: 'SUB006',
      studentName: 'Frank Rodriguez',
      studentId: 'S12350',
      assignmentId: assignment.id,
      fileName: 'Assignment_Frank.docx',
      fileSize: 1280000, // 1.25MB
      submittedAt: '2024-03-14T20:30:00Z',
      status: 'graded',
      grade: 78,
      feedback: 'Good understanding of concepts. Could improve code efficiency and add more comments.',
      files: [
        {
          name: 'Assignment_Frank.docx',
          size: 1280000,
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          uri: 'mock://submission6.docx'
        }
      ]
    }
  ];

  const renderSubmission = ({ item }) => (
    <TouchableOpacity 
      style={styles.submissionCard}
      onPress={() => navigation.navigate('SubmissionDetail', { 
        submission: item,
        assignment: assignment
      })}
    >
      <View style={styles.submissionInfo}>
        <Text style={styles.studentName}>{item.studentName}</Text>
        <Text style={styles.studentId}>ID: {item.studentId}</Text>
        <Text style={styles.fileName}>{item.fileName}</Text>
        <Text style={styles.fileDetails}>
          {Math.round(item.fileSize / 1024)} KB • {new Date(item.submittedAt).toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={[styles.status, styles[item.status]]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submissions for {assignment.title}</Text>
      <Text style={styles.subtitle}>
        {dummySubmissions.length} of {assignment.totalStudents || 25} students submitted
      </Text>

      {dummySubmissions.length > 0 ? (
        <FlatList
          data={dummySubmissions}
          renderItem={renderSubmission}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noSubmissionsText}>No submissions yet for this assignment.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2c3e50',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6c757d',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  noSubmissionsText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6c757d',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  submissionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#2c3e50',
  },
  studentId: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 6,
    fontWeight: '500',
  },
  fileName: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 4,
    fontWeight: '500',
  },
  fileDetails: {
    fontSize: 12,
    color: '#6c757d',
  },
  statusContainer: {
    marginLeft: 12,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    minWidth: 80,
  },
  submitted: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  graded: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
  },
  late: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
  },
});