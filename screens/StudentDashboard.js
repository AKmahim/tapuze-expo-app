import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StyleSheet, Alert, Clipboard } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ClassroomCard from '../components/ClassroomCard';
import { useAuth } from '../contexts/AuthContext';

export default function StudentDashboard({ navigation }) {
  const [joinCode, setJoinCode] = useState('');
  const { logout } = useAuth();
  
  // Dummy user data for visual purposes (override the real user data)
  const user = {
    name: 'Demo Student',
    userId: 'S12345'
  };

  // Dummy classroom data for visual purposes
  const dummyClassrooms = [
    {
      id: '1',
      name: 'Introduction to Computer Science',
      description: 'Learn the fundamentals of programming and computer science',
      code: 'CS101',
      lecturerName: 'Dr. Sarah Johnson',
      evaluationStatus: '3/5 assignments evaluated'
    },
    {
      id: '2', 
      name: 'Data Structures & Algorithms',
      description: 'Master essential data structures and algorithmic thinking',
      code: 'CS201',
      lecturerName: 'Prof. Michael Chen',
      evaluationStatus: '2/3 assignments evaluated'
    },
    {
      id: '3',
      name: 'Web Development',
      description: 'Build modern web applications with React and Node.js',
      code: 'WEB301',
      lecturerName: 'Dr. Emily Rodriguez',
      evaluationStatus: 'No submissions yet'
    }
  ];

  const handleJoinClassroom = () => {
    // Mock join classroom - does nothing for frontend demo
    if (joinCode.trim()) {
      Alert.alert('Join Classroom', 'Classroom joining functionality would happen here.');
      setJoinCode('');
    } else {
      Alert.alert('Error', 'Please enter a classroom code');
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
        <TouchableOpacity style={styles.joinButton} onPress={handleJoinClassroom}>
          <Text style={styles.joinButtonText}>Join Classroom</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Your Classrooms</Text>
      
      <FlatList
        data={dummyClassrooms}
        renderItem={renderClassroom}
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