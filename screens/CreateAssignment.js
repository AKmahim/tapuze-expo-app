import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../contexts/AuthContext';
import * as DocumentPicker from 'expo-document-picker'; // Use Expo DocumentPicker

export default function CreateAssignment({ navigation, route }) {
  const { classroom } = route.params;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [questionPaperUri, setQuestionPaperUri] = useState(null);
  const [questionPaperName, setQuestionPaperName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { addAssignment } = useAuth();

  const handleCreateAssignment = () => {
    if (title.trim()) {
      const newAssignment = {
        title,
        description,
        dueDate: dueDate.toISOString().split('T')[0],
        submissions: 0,
        totalStudents: 25,
        classroomId: classroom.id,
        questionPaper: questionPaperUri,
        questionPaperName: questionPaperName,
        hasQuestionPaper: !!questionPaperUri,
      };
      
      addAssignment(newAssignment);
      
      Alert.alert('Success', `Assignment "${title}" created for ${classroom.name}`);
      navigation.goBack();
    } else {
      Alert.alert('Error', 'Please enter an assignment title');
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
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/*'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB.');
          return;
        }

        setQuestionPaperUri(file.uri);
        setQuestionPaperName(file.name);
        
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
          Supported formats: PDF, DOC, DOCX, Images (Max: 10MB)
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
        style={[styles.createButton, !title.trim() && styles.disabledButton]}
        onPress={handleCreateAssignment}
        disabled={!title.trim()}
      >
        <Text style={styles.createButtonText}>
          Create Assignment
        </Text>
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
});