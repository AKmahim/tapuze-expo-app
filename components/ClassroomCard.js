import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function ClassroomCard({ classroom, onPress, showStudentCount = false, onDelete, evaluationStatus }) {
  const { user } = useAuth();

  const handleDelete = () => {
    Alert.alert(
      "Delete Classroom",
      `Are you sure you want to delete "${classroom.name}"? This will also delete all assignments in this classroom.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: () => onDelete(classroom.id),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <Text style={styles.name}>{classroom.name}</Text>
        <Text style={styles.code}>Code: {classroom.code}</Text>
        {showStudentCount && classroom.studentCount !== undefined && (
          <Text style={styles.studentCount}>{classroom.studentCount} students</Text>
        )}
        {classroom.lecturer && (
          <Text style={styles.lecturer}>Lecturer: {classroom.lecturer}</Text>
        )}
        {classroom.description && (
          <Text style={styles.description}>{classroom.description}</Text>
        )}
        {/* Add evaluation status */}
        {evaluationStatus && (
          <Text style={[
            styles.evaluationStatus,
            evaluationStatus.includes('evaluated') ? styles.evaluated : 
            evaluationStatus.includes('submissions') ? styles.pending : 
            styles.noSubmissions
          ]}>
            {evaluationStatus}
          </Text>
        )}
      </TouchableOpacity>
      
      {user?.role === 'lecturer' && onDelete && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  code: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  studentCount: {
    fontSize: 14,
    color: '#4a90e2',
    marginBottom: 5,
  },
  lecturer: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 5,
  },
  evaluationStatus: {
    fontSize: 12,
    marginTop: 8,
    padding: 6,
    borderRadius: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  evaluated: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  pending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    borderWidth: 1,
    borderColor: '#ffeaa7',
  },
  noSubmissions: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4757',
    padding: 5,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});