import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import Spinner from '../components/Spinner';
import { getSubmissionsByAssignmentId } from '../services/apiService';

export default function SubmissionsScreen({ navigation, route }) {
  const { assignment } = route.params;
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await getSubmissionsByAssignmentId(assignment.id);
      
      if (response.success && response.data) {
        // Transform API data to match component expectations
        const transformedSubmissions = response.data.map(submission => {
          // Determine status based on grade and deadline
          let status = 'submitted';
          if (submission.grade !== null) {
            status = 'graded';
          }
          // Check if submitted after deadline (you might need to add this logic based on your needs)
          const submittedDate = new Date(submission.submitted_at);
          const deadlineDate = new Date(assignment.dueDate);
          if (submittedDate > deadlineDate && submission.grade !== null) {
            status = 'late';
          }

          return {
            id: submission.id.toString(),
            studentName: submission.student?.name || 'Unknown Student',
            studentId: submission.student?.id?.toString() || 'N/A',
            assignmentId: submission.assignment_id.toString(),
            fileName: submission.solution ? submission.solution.split('/').pop() : 'No file',
            fileSize: 2048000, // Default size since API doesn't provide this
            submittedAt: submission.submitted_at,
            status: status,
            grade: submission.grade,
            feedback: submission.feedback,
            solution: submission.solution,
            files: submission.solution ? [
              {
                name: submission.solution.split('/').pop(),
                size: 2048000,
                type: 'application/pdf',
                uri: submission.solution
              }
            ] : []
          };
        });
        setSubmissions(transformedSubmissions);
      } else {
        setSubmissions([]);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load submissions. Please try again.'
      );
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh submissions
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSubmissions();
    setRefreshing(false);
  };

  // Load submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Spinner />
        <Text style={styles.loadingText}>Loading submissions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Submissions for {assignment.title}</Text>
      <Text style={styles.subtitle}>
        {submissions.length} of {assignment.totalStudents || 25} students submitted
      </Text>

      {submissions.length > 0 ? (
        <FlatList
          data={submissions}
          renderItem={renderSubmission}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007bff']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noSubmissionsText}>
            No submissions yet for this assignment.
          </Text>
          <Text style={styles.emptySubtext}>
            Students haven't submitted their work yet. Check back later!
          </Text>
        </View>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noSubmissionsText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#8c9196',
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
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