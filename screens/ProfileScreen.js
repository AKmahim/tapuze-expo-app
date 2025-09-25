// screens/ProfileScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { user, users, setUser, setUsers } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    department: user?.department || '',
  });

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...formData
    };

    // Update current user
    setUser(updatedUser);
    
    // Update in users array
    setUsers(prev => prev.map(u => 
      u.id === user.id ? updatedUser : u
    ));

    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.name?.charAt(0)?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userId}>{user.userId}</Text>
        <Text style={styles.roleBadge}>
          {user.role?.toUpperCase()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user.phone || 'Not set'}</Text>
          )}
        </View>

        {user.role === 'lecturer' && (
          <View style={styles.field}>
            <Text style={styles.label}>Department</Text>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={formData.department}
                onChangeText={(text) => setFormData({...formData, department: text})}
              />
            ) : (
              <Text style={styles.value}>{user.department || 'Not set'}</Text>
            )}
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          {isEditing ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.bio}
              onChangeText={(text) => setFormData({...formData, bio: text})}
              multiline
              numberOfLines={3}
            />
          ) : (
            <Text style={styles.value}>{user.bio || 'No bio yet'}</Text>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Joined Classrooms</Text>
          <Text style={styles.value}>{user.joinedClassrooms?.length || 0}</Text>
        </View>
        
        {user.role === 'student' && (
          <View style={styles.field}>
            <Text style={styles.label}>Student ID</Text>
            <Text style={styles.value}>{user.userId}</Text>
          </View>
        )}

        {user.role === 'lecturer' && (
          <View style={styles.field}>
            <Text style={styles.label}>Lecturer ID</Text>
            <Text style={styles.value}>{user.userId}</Text>
          </View>
        )}
      </View>

      <View style={styles.actions}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => {
                setIsEditing(false);
                setFormData({
                  name: user.name,
                  email: user.email,
                  bio: user.bio,
                  phone: user.phone,
                  department: user.department,
                });
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => setIsEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  roleBadge: {
    backgroundColor: '#007AFF',
    color: 'white',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  actions: {
    padding: 20,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;