import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClassroomCard from '../components/ClassroomCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import { getClassroomByCode } from '../services/apiService';

export default function StudentDashboard({ navigation }) {
  const [joinCode, setJoinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const [joinedClassrooms, setJoinedClassrooms] = useState([]);

  // Load joined classrooms from storage
  useEffect(() => {
    loadJoinedClassrooms();
  }, [user]);

  const loadJoinedClassrooms = async () => {
    try {
      if (user?.id) {
        const stored = await AsyncStorage.getItem(`joinedClassrooms_${user.id}`);
        if (stored) {
          const classrooms = JSON.parse(stored);
          setJoinedClassrooms(classrooms);
        }
      }
    } catch (error) {
      console.error('Error loading joined classrooms:', error);
    }
  };

  const saveJoinedClassrooms = async (classrooms) => {
    try {
      if (user?.id) {
        await AsyncStorage.setItem(`joinedClassrooms_${user.id}`, JSON.stringify(classrooms));
      }
    } catch (error) {
      console.error('Error saving joined classrooms:', error);
    }
  };

  const handleJoinClassroom = async () => {
    if (!joinCode.trim()) {
      Alert.alert('Error', 'Please enter a classroom code');
      return;
    }

    try {
      setLoading(true);
      const response = await getClassroomByCode(joinCode.trim());
      
      if (response.success && response.data) {
        const classroomData = response.data;
        
        // Show classroom details and ask for confirmation
        Alert.alert(
          'Classroom Found',
          `Class: ${classroomData.class_name}\nLecturer: ${classroomData.lecturer_name}\nDescription: ${classroomData.class_details}\n\nWould you like to join this classroom?`,
          [
            {
              text: 'Cancel',
              style: 'cancel'
            },
            {
              text: 'Join',
              onPress: () => {
                // Add classroom to joined classrooms list
                const newClassroom = {
                  id: classroomData.id.toString(),
                  name: classroomData.class_name,
                  description: classroomData.class_details,
                  code: classroomData.class_code,
                  lecturerName: classroomData.lecturer_name,
                  evaluationStatus: 'No submissions yet'
                };
                
                // Check if classroom is already joined
                const isAlreadyJoined = joinedClassrooms.some(classroom => classroom.id === newClassroom.id);
                
                if (isAlreadyJoined) {
                  Alert.alert('Info', 'You have already joined this classroom!');
                } else {
                  const updatedClassrooms = [...joinedClassrooms, newClassroom];
                  setJoinedClassrooms(updatedClassrooms);
                  saveJoinedClassrooms(updatedClassrooms);
                  Alert.alert('Success', 'Joined classroom successfully!');
                }
                
                setJoinCode('');
              }
            }
          ]
        );
      } else {
        Alert.alert('Error', 'Classroom not found. Please check the code and try again.');
      }
    } catch (error) {
      console.error('Error joining classroom:', error);
      
      let errorMessage = 'Failed to find classroom. Please try again.';
      
      if (error.status === 404) {
        errorMessage = 'Classroom not found. Please check the code and try again.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. Please make sure you have the correct permissions.';
      } else if (error.status === 0) {
        errorMessage = error.message || 'Network error. Please check your internet connection.';
      } else if (error.message && error.message.includes('not found')) {
        errorMessage = 'Classroom not found. Please check the code and try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasteCode = async () => {
    try {
      const clipboardContent = await Clipboard.getString();
      if (clipboardContent) {
        setJoinCode(clipboardContent.trim());
      } else {
        Alert.alert('Clipboard', 'No text found in clipboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access clipboard');
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Logout", 
          onPress: () => logout()
        }
      ]
    );
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
  };

  const renderClassroom = ({ item }) => (
    <ClassroomCard 
      classroom={item} 
      onPress={() => navigation.navigate('StudentClassroom', { classroom: item })}
      evaluationStatus={item.evaluationStatus}
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
      <Text style={styles.title}>Student Dashboard</Text>
      <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
      
      <View style={styles.joinSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Enter classroom code"
            value={joinCode}
            onChangeText={setJoinCode}
          />
          <TouchableOpacity 
            style={styles.pasteButton} 
            onPress={handlePasteCode}
            accessibilityLabel="Paste code from clipboard"
          >
            <Text style={styles.pasteText}>Paste</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.joinButton, loading && styles.disabledButton]} 
          onPress={handleJoinClassroom}
          disabled={loading}
        >
          {loading ? (
            <View style={styles.loadingContainer}>
              <Spinner size="small" color="#fff" />
              <Text style={styles.joinButtonText}>Searching...</Text>
            </View>
          ) : (
            <Text style={styles.joinButtonText}>Join Classroom</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Classrooms</Text>
      
      {joinedClassrooms.length > 0 ? (
        <FlatList
          data={joinedClassrooms}
          renderItem={renderClassroom}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={64} color="#ccc" />
          <Text style={styles.noClassesText}>No classrooms joined yet</Text>
          <Text style={styles.emptySubtext}>
            Enter a classroom code above to join your first classroom
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
  joinSection: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  codeInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
  },
  pasteButton: {
    padding: 10,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  pasteText: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  joinButton: {
    backgroundColor: '#4a90e2',
    borderRadius: 8,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    paddingTop: 40,
  },
  noClassesText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    fontSize: 18,
    fontWeight: '500',
  },
  emptySubtext: {
    textAlign: 'center',
    marginTop: 8,
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
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