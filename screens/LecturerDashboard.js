import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ClassroomCard from '../components/ClassroomCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { getAllClassrooms, logoutUser, deleteClassroom } from '../services/apiService';

export default function LecturerDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Dummy assignments for classroom context (can be replaced with API call later)
  const dummyAssignments = [
    { id: 'ASG001', classroomId: 'CLS001', title: 'Matrix Operations Assignment' },
    { id: 'ASG002', classroomId: 'CLS001', title: 'Calculus Problem Set' },
    { id: 'ASG003', classroomId: 'CLS002', title: 'Binary Tree Implementation' },
    { id: 'ASG004', classroomId: 'CLS002', title: 'Sorting Algorithms Analysis' },
    { id: 'ASG005', classroomId: 'CLS003', title: 'SQL Query Assignment' }
  ];

  // Fetch classrooms from API
  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await getAllClassrooms();
      
      if (response.success && response.data) {
        // Transform API data to match component expectations
        const transformedClassrooms = response.data.map(classroom => ({
          id: classroom.id.toString(),
          name: classroom.class_name,
          description: classroom.class_details,
          code: classroom.class_code,
          studentCount: 0, // This would come from a separate API call if needed
          createdAt: classroom.created_at,
          lecturer: user?.name || 'Unknown'
        }));
        setClassrooms(transformedClassrooms);
      } else {
        setClassrooms([]);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to load classrooms. Please try again.'
      );
      setClassrooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Refresh classrooms
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClassrooms();
    setRefreshing(false);
  };

  // Load classrooms on component mount
  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        await logoutUser(token);
      }
      await logout(); // Clear local auth state
      navigation.navigate('AuthScreen');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, clear local state
      await logout();
      navigation.navigate('AuthScreen');
    }
  };

  const handleCreateClassroom = () => {
    navigation.navigate('CreateClassroom', {
      onClassroomCreated: fetchClassrooms // Pass callback to refresh list
    });
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const handleDeleteClassroom = (classroomId) => {
    Alert.alert(
      'Delete Classroom',
      'Are you sure you want to delete this classroom? This action cannot be undone.',
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
              await deleteClassroom(classroomId);
              Alert.alert('Success', 'Classroom deleted successfully');
              fetchClassrooms(); // Refresh the list
            } catch (error) {
              console.error('Delete classroom error:', error);
              Alert.alert(
                'Error', 
                error.message || 'Failed to delete classroom. Please try again.'
              );
            }
          }
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
      onDelete={() => handleDeleteClassroom(item.id)}
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

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Spinner />
        <Text style={styles.loadingText}>Loading classrooms...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lecturer Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user?.name || 'Lecturer'}!</Text>
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateClassroom}
      >
        <Text style={styles.createButtonText}>Create New Classroom</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Your Classrooms ({classrooms.length})</Text>
      
      {classrooms.length > 0 ? (
        <FlatList
          data={classrooms}
          renderItem={renderClassroom}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4a90e2']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.noClassesText}>
            You haven't created any classrooms yet. Create your first classroom to get started!
          </Text>
          <TouchableOpacity 
            style={[styles.createButton, styles.secondaryButton]}
            onPress={handleCreateClassroom}
          >
            <Text style={styles.createButtonText}>Create Your First Classroom</Text>
          </TouchableOpacity>
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  secondaryButton: {
    marginTop: 20,
    backgroundColor: '#28a745',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noClassesText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    fontSize: 16,
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
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