import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import AssignmentCard from '../components/AssignmentCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { getAssignmentsByClassroomCode } from '../services/apiService';

export default function StudentClassroomScreen({ navigation, route }) {
  const { classroom } = route.params;
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch assignments from API
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentsByClassroomCode(classroom.code);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // Transform API data to match component expectations
        const transformedAssignments = response.data.map(assignment => ({
          id: assignment.id?.toString() || 'unknown',
          title: assignment.title || 'Untitled Assignment',
          description: assignment.description || 'No description available',
          dueDate: assignment.deadline || new Date().toISOString(),
          maxPoints: 100, // Default since API doesn't provide this
          classroomId: assignment.classroom_id?.toString() || classroom.id,
          questions: assignment.questions || null,
          studentStatus: 'Not submitted', // Default status - you might want to check submission status
          createdAt: assignment.created_at,
          updatedAt: assignment.updated_at,
          classroom: assignment.classroom
        }));
        setAssignments(transformedAssignments);
      } else {
        console.log('No assignments found or invalid response format');
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
  }, [classroom.code]);

  const handleAssignmentPress = (assignment) => {
    // Navigate to SubmitAssignment screen with assignment and classroom data
    navigation.navigate('SubmitAssignment', { 
      assignment: assignment, 
      classroom: classroom 
    });
  };

  const renderAssignment = ({ item }) => (
    <AssignmentCard 
      assignment={item} 
      onPress={() => handleAssignmentPress(item)}
      userRole="student"
      onDelete={null}
      onViewSubmissions={null}
      studentStatus={item.studentStatus}
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
      
      <Text style={styles.sectionTitle}>Your Assignments</Text>
      
      {assignments.length > 0 ? (
        <FlatList
          data={assignments}
          renderItem={renderAssignment}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4a90e2']}
              tintColor="#4a90e2"
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noAssignmentsText}>No assignments available</Text>
          <Text style={styles.emptySubtext}>
            Your lecturer hasn't posted any assignments yet. Pull down to refresh.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: '#333',
  },
  code: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 5,
    color: '#666',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#888',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  noAssignmentsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
});