import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import EvaluationScreen from './EvaluationScreen';

const DemoEvaluationScreen = ({ navigation }) => {
  // Mock navigation object for demo
  const mockNavigation = {
    goBack: () => console.log('Going back to previous screen'),
    navigate: (screen, params) => console.log(`Navigating to ${screen}`, params),
  };

  // Mock route params for demo
  const mockRoute = {
    params: {
      submission: {
        studentId: 'john.doe',
        fileName: 'homework.pdf',
        fileData: 'mock-base64-data',
        id: '1'
      },
      assignment: {
        title: 'Mathematics Assignment #1',
        id: '1'
      },
      classroom: {
        id: '1',
        name: 'Math Class'
      },
      userRole: 'Teacher'
    }
  };

  return (
    <EvaluationScreen 
      navigation={mockNavigation}
      route={mockRoute}
    />
  );
};

export default DemoEvaluationScreen;
