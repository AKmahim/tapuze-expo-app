import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClassroomCard from '../components/ClassroomCard';

export default function LecturerDashboard({ navigation }) {
  // Mock user data for visual purposes
  const user = {
    name: "Dr. Sarah Wilson",
    userId: "LECT001",
    role: "lecturer"
  };

  // Dummy classrooms for visual demonstration
  const dummyClassrooms = [
    {
      id: 'CLS001',
      name: 'Advanced Mathematics',
      description: 'Calculus and Linear Algebra for Computer Science students',
      code: 'MATH301',
      studentCount: 45,
      createdAt: '2024-01-15',
      lecturer: 'Dr. Sarah Wilson'
    },
    {
      id: 'CLS002',
      name: 'Data Structures & Algorithms',
      description: 'Fundamental concepts of data structures and algorithm design',
      code: 'CS201',
      studentCount: 38,
      createdAt: '2024-01-20',
      lecturer: 'Dr. Sarah Wilson'
    },
    {
      id: 'CLS003',
      name: 'Database Systems',
      description: 'Relational databases, SQL, and database design principles',
      code: 'CS301',
      studentCount: 32,
      createdAt: '2024-02-01',
      lecturer: 'Dr. Sarah Wilson'
    }
  ];

  // Dummy assignments for classroom context
  const dummyAssignments = [
    { id: 'ASG001', classroomId: 'CLS001', title: 'Matrix Operations Assignment' },
    { id: 'ASG002', classroomId: 'CLS001', title: 'Calculus Problem Set' },
    { id: 'ASG003', classroomId: 'CLS002', title: 'Binary Tree Implementation' },
    { id: 'ASG004', classroomId: 'CLS002', title: 'Sorting Algorithms Analysis' },
    { id: 'ASG005', classroomId: 'CLS003', title: 'SQL Query Assignment' }
  ];

  const handleLogout = () => {
    // Navigate directly to AuthScreen
    navigation.navigate('AuthScreen');
  };

  const handleCreateClassroom = () => {
    navigation.navigate('CreateClassroom');
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleDeleteClassroom = (classroomId) => {
    Alert.alert(
      'Delete Classroom', 
      'Delete functionality removed for demo. This would normally delete the classroom.',
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Mock Delete",
          onPress: () => Alert.alert('Demo', 'Mock deletion completed for demonstration!')
        }
      ]
    );
  };

  const renderClassroom = ({ item }) => (
    <ClassroomCard 
      classroom={item} 
      onPress={() => navigation.navigate('LecturerClassroom', { 
        classroom: item,
        assignments: dummyAssignments.filter(a => a.classroomId === item.id)
      })}
      showStudentCount
      onDelete={handleDeleteClassroom}
    />
  );

  // Set header options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          <TouchableOpacity 
            onPress={navigateToProfile} 
            style={styles.profileButton}
            accessibilityLabel="Go to profile"
          >
            <Ionicons name="person-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lecturer Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateClassroom}
      >
        <Text style={styles.createButtonText}>Create New Classroom</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Classrooms</Text>
      
      {dummyClassrooms.length > 0 ? (
        <FlatList
          data={dummyClassrooms}
          renderItem={renderClassroom}
          keyExtractor={item => item.id}
        />
      ) : (
        <Text style={styles.noClassesText}>You haven't created any classrooms yet. Create your first classroom to get started!</Text>
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  welcome: {
    textAlign: 'center',
    marginBottom: 15,
    color: '#666',
    fontSize: 16,
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
  noClassesText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  profileButton: {
    padding: 5,
  },
  logoutButton: {
    padding: 8,
    backgroundColor: '#ff4757',
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});