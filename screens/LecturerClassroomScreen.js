import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import AssignmentCard from '../components/AssignmentCard';
import Spinner from '../components/Spinner';
import { getAssignmentsByClassroomId, deleteAssignment } from '../services/apiService';

export default function LecturerClassroomScreen({ navigation, route }) {
  const { classroom } = route.params;
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentsByClassroomId(classroom.id);
      
      if (response.success && response.data) {
        // Transform API data to match component expectations
        const transformedAssignments = response.data.map(assignment => ({
          id: assignment.id.toString(),
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.deadline,
          totalMarks: 100, // Default value since API doesn't provide this
          classroomId: assignment.classroom_id.toString(),
          classroomName: assignment.classroom?.class_name || classroom.name,
          submissions: 0, // This would come from a separate API call if needed
          totalStudents: 25, // This would come from a separate API call if needed
          status: 'active',
          questionPaper: assignment.questions,
          questionPaperName: assignment.questions ? assignment.questions.split('/').pop() : null
        }));
        setAssignments(transformedAssignments);
      } else {
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load assignments. Please try again.'
      );
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh assignments
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAssignments();
    setRefreshing(false);
  };

  // Load assignments on component mount
  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleNewAssignment = () => {
    navigation.navigate('CreateAssignment', { 
      classroom,
      onAssignmentCreated: fetchAssignments // Pass callback to refresh list
    });
  };

  const handleDeleteAssignment = (assignmentId) => {
    Alert.alert(
      'Delete Assignment',
      'Are you sure you want to delete this assignment? This action cannot be undone.',
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAssignment(assignmentId);
              Alert.alert('Success', 'Assignment deleted successfully');
              fetchAssignments(); // Refresh the list
            } catch (error) {
              console.error('Delete assignment error:', error);
              Alert.alert(
                'Error', 
                error.message || 'Failed to delete assignment. Please try again.'
              );
            }
          }
        }
      ]
    );
  };

  const handleViewSubmissions = (assignment) => {
    // Navigate to submissions screen with assignment data
    navigation.navigate('Submissions', { assignment });
  };

  const renderAssignment = ({ item }) => (
    <AssignmentCard 
      assignment={item} 
      onPress={() => handleViewSubmissions(item)}
      userRole="lecturer"
      onDelete={() => handleDeleteAssignment(item.id)}
    />
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Spinner />
        <Text style={styles.loadingText}>Loading assignments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classroom.name}</Text>
      <Text style={styles.code}>Code: {classroom.code}</Text>
      {classroom.description && (
        <Text style={styles.description}>{classroom.description}</Text>
      )}
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleNewAssignment}
      >
        <Text style={styles.createButtonText}>Create New Assignment</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Assignments ({assignments.length})</Text>
      
      {assignments.length > 0 ? (
        <FlatList
          data={assignments}
          renderItem={renderAssignment}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007bff']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noAssignmentsText}>
            No assignments yet. Create your first assignment!
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, styles.secondaryButton]}
            onPress={handleNewAssignment}
          >
            <Text style={styles.createButtonText}>Create Your First Assignment</Text>
          </TouchableOpacity>
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
  code: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 6,
    color: '#6c757d',
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6c757d',
    fontStyle: 'italic',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  createButton: {
    backgroundColor: '#007bff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#007bff',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2c3e50',
    paddingLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noAssignmentsText: {
    textAlign: 'center',
    color: '#6c757d',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
  },
});