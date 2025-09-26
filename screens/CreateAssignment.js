import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/AuthContext';
import { createAssignment } from '../services/apiService';
import Spinner from '../components/Spinner';
import * as DocumentPicker from 'expo-document-picker'; // Use Expo DocumentPicker

export default function CreateAssignment({ navigation, route }) {
  const { classroom } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [questionPaperUri, setQuestionPaperUri] = useState(null);
  const [questionPaperName, setQuestionPaperName] = useState('');
  const [questionPaperFile, setQuestionPaperFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCreateAssignment = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter an assignment title');
      return;
    }

    try {
      setLoading(true);
      
      // Format deadline to ISO string
      const deadline = dueDate.toISOString();
      
      const assignmentData = {
        title: title.trim(),
        description: description.trim() || '',
        deadline: deadline,
        classroom_id: classroom.id,
      };

      // Add question paper file if selected
      if (questionPaperFile) {
        assignmentData.questions = questionPaperFile;
      }
      
      const response = await createAssignment(assignmentData);
      
      if (response.success) {
        Alert.alert(
          'Success', 
          `Assignment "${title}" created successfully for ${classroom.name}`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Call the callback if provided to refresh the assignment list
                if (route?.params?.onAssignmentCreated) {
                  route.params.onAssignmentCreated();
                }
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to create assignment');
      }
    } catch (error) {
      console.error('Create assignment error:', error);
      
      let errorMessage = 'Failed to create assignment. Please try again.';
      
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

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDocumentPick = async () => {
    try {
      setIsUploading(true);
      
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf'], // API only supports PDF according to Postman collection
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a PDF file smaller than 10MB.');
          return;
        }

        // Create file object for API
        const fileObject = {
          uri: file.uri,
          type: file.mimeType || 'application/pdf',
          name: file.name,
        };

        setQuestionPaperUri(file.uri);
        setQuestionPaperName(file.name);
        setQuestionPaperFile(fileObject);
        
        Alert.alert(
          'File Selected', 
          `File: ${file.name}\nSize: ${formatFileSize(file.size)}`
        );
      }
    } catch (err) {
      console.error('DocumentPicker Error:', err);
      Alert.alert('Error', 'Failed to pick a document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    Alert.alert(
      'Remove File',
      'Are you sure you want to remove the selected question paper?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setQuestionPaperUri(null);
            setQuestionPaperName('');
            setQuestionPaperFile(null);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Create Assignment for {classroom.name}</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Assignment Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter assignment title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter assignment description (optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(dueDate)}
          </Text>
        </TouchableOpacity>
      </View>
      
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Question Paper (Optional)</Text>
        <Text style={styles.helperText}>
          Supported formats: PDF only (Max: 10MB)
        </Text>
        
        {!questionPaperUri ? (
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleDocumentPick}
            disabled={isUploading}
          >
            <Text style={styles.uploadButtonText}>
              {isUploading ? 'Selecting File...' : '📎 Upload Question Paper'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.fileContainer}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>📄 {questionPaperName}</Text>
              <Text style={styles.fileStatus}>✅ File attached</Text>
            </View>
            <View style={styles.fileActions}>
              <TouchableOpacity 
                style={styles.changeFileButton}
                onPress={handleDocumentPick}
                disabled={isUploading}
              >
                <Text style={styles.changeFileText}>Change</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.removeFileButton}
                onPress={handleRemoveFile}
              >
                <Text style={styles.removeFileText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      
      <TouchableOpacity 
        style={[styles.createButton, (!title.trim() || loading) && styles.disabledButton]}
        onPress={handleCreateAssignment}
        disabled={!title.trim() || loading}
      >
        {loading ? (
          <Spinner size="small" color="#fff" showText={false} style={styles.buttonSpinner} />
        ) : (
          <Text style={styles.createButtonText}>
            Create Assignment
          </Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    marginTop: 20,
    textAlign: 'center',
    color: '#2c3e50',
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    height: 50,
    borderColor: '#e0e6ed',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#2c3e50',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  dateButton: {
    height: 50,
    borderColor: '#e0e6ed',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  dateButtonText: {
    color: '#2c3e50',
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bdc3c7',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    color: '#34495e',
    fontSize: 16,
    fontWeight: '500',
  },
  fileContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#27ae60',
  },
  fileInfo: {
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 4,
  },
  fileStatus: {
    fontSize: 14,
    color: '#27ae60',
  },
  fileActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  changeFileButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  changeFileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  removeFileButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
  },
  removeFileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#27ae60',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 20,
  },
  buttonSpinner: {
    padding: 0,
    margin: 0,
    flex: 0,
  },
});