import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AssignmentCard from '../components/AssignmentCard';
import { useAuth } from '../contexts/AuthContext';

export default function ClassroomScreen({ navigation, route }) {
  const { classroom } = route.params;
  const { user, assignments, submissions, addAssignment, deleteAssignment, getSubmissionsForAssignment } = useAuth();
  
  // Get assignments for this classroom
  const classroomAssignments = assignments.filter(a => a.classroomId === classroom.id);

  // For students: get their submission status for each assignment
  const assignmentsWithStudentStatus = classroomAssignments.map(assignment => {
    if (user.role === 'student') {
      // Find student's submission for this assignment
      const studentSubmission = submissions.find(sub => 
        sub.assignmentId === assignment.id && sub.studentId === user.userId
      );
      
      return {
        ...assignment,
        studentStatus: studentSubmission 
          ? studentSubmission.evaluation 
            ? `Evaluated: ${studentSubmission.evaluation.overallScore}%`
            : 'Submitted - Pending evaluation'
          : 'Not submitted'
      };
    }
    return assignment;
  });

  const handleNewAssignment = (newAssignment) => {
    const assignmentWithClassroom = {
      ...newAssignment,
      classroomId: classroom.id,
      classroomName: classroom.name,
      totalStudents: 25 // Default value
    };
    
    // Add to global assignments
    addAssignment(assignmentWithClassroom);
  };

  const handleDeleteAssignment = (assignmentId) => {
    deleteAssignment(assignmentId);
  };

  const handleViewSubmissions = (assignment) => {
    // Get current submission count for this assignment
    const submissionCount = getSubmissionsForAssignment(assignment.id).length;
    const assignmentWithSubmissions = {
      ...assignment,
      submissions: submissionCount
    };
    
    navigation.navigate('Submissions', { assignment: assignmentWithSubmissions });
  };

  const renderAssignment = ({ item }) => (
    <AssignmentCard 
      assignment={item} 
      onPress={() => {
        if (user.role === 'student') {
          navigation.navigate('SubmitAssignment', { assignment: item, classroom });
        }
      }}
      userRole={user.role}
      onDelete={user.role === 'lecturer' ? handleDeleteAssignment : null}
      onViewSubmissions={user.role === 'lecturer' ? handleViewSubmissions : null}
      // Pass student status for student view
      studentStatus={user.role === 'student' ? item.studentStatus : null}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{classroom.name}</Text>
      <Text style={styles.code}>Code: {classroom.code}</Text>
      {classroom.description && (
        <Text style={styles.description}>{classroom.description}</Text>
      )}
      
      {user.role === 'lecturer' && (
        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateAssignment', { 
            classroom,
            addNewAssignment: handleNewAssignment
          })}
        >
          <Text style={styles.createButtonText}>Create New Assignment</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>
        {user.role === 'lecturer' ? 'Assignments' : 'Your Assignments'}
      </Text>
      
      {assignmentsWithStudentStatus.length > 0 ? (
        <FlatList
          data={assignmentsWithStudentStatus}
          renderItem={renderAssignment}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noAssignmentsText}>
          {user.role === 'lecturer' 
            ? 'No assignments yet. Create your first assignment!' 
            : 'No assignments available yet.'}
        </Text>
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
  createButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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