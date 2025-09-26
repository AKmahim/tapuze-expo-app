import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { createClassroom } from '../services/apiService';
import Spinner from '../components/Spinner';
import * as Clipboard from 'expo-clipboard';   // ✅ use expo-clipboard

export default function CreateClassroom({ navigation, route }) {
  const [className, setClassName] = useState('');
  const [classDescription, setClassDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const [classCode, setClassCode] = useState(generateRandomCode());

  const handleCreateClassroom = async () => {
    if (!className.trim()) {
      Alert.alert('Error', 'Please enter a classroom name');
      return;
    }

    try {
      setLoading(true);
      
      const classroomData = {
        class_name: className.trim(),
        class_details: classDescription.trim() || '',
        class_code: classCode
      };
      
      const response = await createClassroom(classroomData);
      
      if (response.success) {
        Alert.alert(
          'Success', 
          `Classroom "${className}" created successfully with code: ${classCode}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Call the callback if provided to refresh the dashboard
                if (route?.params?.onClassroomCreated) {
                  route.params.onClassroomCreated();
                }
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to create classroom');
      }
    } catch (error) {
      console.error('Create classroom error:', error);
      
      let errorMessage = 'Failed to create classroom. Please try again.';
      
      if (error.status === 422 && error.validationErrors) {
        // Handle validation errors
        const errorMessages = Object.values(error.validationErrors).flat();
        errorMessage = errorMessages.join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const refreshCode = () => {
    setClassCode(generateRandomCode());
  };

  const copyCodeToClipboard = async () => {
    await Clipboard.setStringAsync(classCode);   // ✅ expo API is async
    Alert.alert('Copied!', 'Classroom code copied to clipboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create New Classroom</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Classroom Name"
        value={className}
        onChangeText={setClassName}
      />
      
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Description (Optional)"
        value={classDescription}
        onChangeText={setClassDescription}
        multiline
        numberOfLines={4}
      />
      
      <View style={styles.codeSection}>
        <Text style={styles.codeLabel}>Classroom Code:</Text>
        <View style={styles.codeContainer}>
          <Text style={styles.codeText}>{classCode}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.copyButton} onPress={copyCodeToClipboard}>
              <Text style={styles.copyText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshCode}>
              <Text style={styles.refreshText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.codeHint}>Students will use this code to join your classroom</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.createButton, (!className.trim() || loading) && styles.disabledButton]}
        onPress={handleCreateClassroom}
        disabled={!className.trim() || loading}
      >
        {loading ? (
          <Spinner size="small" color="#fff" showText={false} style={styles.buttonSpinner} />
        ) : (
          <Text style={styles.createButtonText}>Create Classroom</Text>
        )}
      </TouchableOpacity>
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
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  codeSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  codeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a90e2',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  copyButton: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4a90e2',
    borderRadius: 4,
  },
  copyText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  refreshButton: {
    padding: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  refreshText: {
    color: '#666',
    fontSize: 12,
  },
  codeHint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  createButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonSpinner: {
    padding: 0,
    margin: 0,
    flex: 0,
  },
});
