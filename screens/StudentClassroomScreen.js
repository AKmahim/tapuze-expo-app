import React from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import AssignmentCard from '../components/AssignmentCard';

export default function StudentClassroomScreen({ navigation, route }) {
  const { classroom } = route.params;
  
  // Dummy user data for display
  const user = {
    name: 'Demo Student',
    role: 'student',
    userId: 'S12345'
  };

  // Dummy assignments data for visual purposes
  const dummyAssignments = [
    {
      id: '1',
      title: 'Programming Fundamentals Quiz',
      description: 'Test your understanding of basic programming concepts including variables, loops, and functions.',
      dueDate: '2025-09-30T23:59:59.000Z',
      maxPoints: 100,
      classroomId: classroom.id,
      studentStatus: 'Evaluated: 85%'
    },
    {
      id: '2',
      title: 'Data Structures Implementation',
      description: 'Implement basic data structures: Stack, Queue, and Linked List in your preferred programming language.',
      dueDate: '2025-10-15T23:59:59.000Z',
      maxPoints: 150,
      classroomId: classroom.id,
      studentStatus: 'Submitted - Pending evaluation'
    },
    {
      id: '3',
      title: 'Algorithm Analysis Project',
      description: 'Analyze the time and space complexity of sorting algorithms and write a comprehensive report.',
      dueDate: '2025-10-30T23:59:59.000Z',
      maxPoints: 200,
      classroomId: classroom.id,
      studentStatus: 'Not submitted'
    }
  ];

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classroom.name}</Text>
      <Text style={styles.code}>Code: {classroom.code}</Text>
      {classroom.description && (
        <Text style={styles.description}>{classroom.description}</Text>
      )}
      
      <Text style={styles.sectionTitle}>Your Assignments</Text>
      
      <FlatList
        data={dummyAssignments}
        renderItem={renderAssignment}
        keyExtractor={item => item.id}
      />
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
  noAssignmentsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
});