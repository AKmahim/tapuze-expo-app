import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AssignmentCard from '../components/AssignmentCard';

export default function LecturerClassroomScreen({ navigation, route }) {
  const { classroom } = route.params;
  
  // Dummy assignments for visual demonstration
  const dummyAssignments = [
    {
      id: 'ASG001',
      title: 'Data Structures Implementation',
      description: 'Implement basic data structures including linked lists, stacks, and queues',
      dueDate: '2024-03-15T23:59:59Z',
      totalMarks: 100,
      classroomId: classroom.id,
      classroomName: classroom.name,
      submissions: 12,
      totalStudents: 25,
      status: 'active',
      questionPaper: 'mock://assignment1.pdf',
      questionPaperName: 'Assignment1_DataStructures.pdf'
    },
    {
      id: 'ASG002',
      title: 'Algorithm Analysis Project',
      description: 'Analyze time and space complexity of various sorting algorithms',
      dueDate: '2024-03-22T23:59:59Z',
      totalMarks: 150,
      classroomId: classroom.id,
      classroomName: classroom.name,
      submissions: 8,
      totalStudents: 25,
      status: 'active',
      questionPaper: 'mock://assignment2.pdf',
      questionPaperName: 'Assignment2_Algorithms.pdf'
    },
    {
      id: 'ASG003',
      title: 'Database Design Assignment',
      description: 'Design and implement a relational database for a library management system',
      dueDate: '2024-03-29T23:59:59Z',
      totalMarks: 120,
      classroomId: classroom.id,
      classroomName: classroom.name,
      submissions: 5,
      totalStudents: 25,
      status: 'active',
      questionPaper: 'mock://assignment3.pdf',
      questionPaperName: 'Assignment3_Database.pdf'
    }
  ];

  const handleNewAssignment = () => {
    navigation.navigate('CreateAssignment', { classroom });
  };

  const handleDeleteAssignment = (assignmentId) => {
    // Mock delete - show alert for demo
    alert(`Delete functionality removed for demo. This would normally delete assignment ${assignmentId}.`);
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
      onDelete={handleDeleteAssignment}
    />
  );

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

      <Text style={styles.sectionTitle}>Assignments</Text>
      
      {dummyAssignments.length > 0 ? (
        <FlatList
          data={dummyAssignments}
          renderItem={renderAssignment}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      ) : (
        <Text style={styles.noAssignmentsText}>
          No assignments yet. Create your first assignment!
        </Text>
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
  noAssignmentsText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#6c757d',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});