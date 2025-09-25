import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen';
import SignupScreen from './screens/SignupScreen';
import StudentDashboard from './screens/StudentDashboard';
import LecturerDashboard from './screens/LecturerDashboard';
import ClassroomScreen from './screens/ClassroomScreen';
import StudentClassroomScreen from './screens/StudentClassroomScreen';
import LecturerClassroomScreen from './screens/LecturerClassroomScreen';
import CreateClassroom from './screens/CreateClassroom';
import CreateAssignment from './screens/CreateAssignment';
import SubmitAssignment from './screens/SubmitAssignment';
import SubmissionsScreen from './screens/SubmissionsScreen';
import SubmissionDetailScreen from './screens/SubmissionDetailScreen';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AIEvaluationScreen from './screens/AIEvaluationScreen';
import EvaluationScreen from './screens/EvaluationScreen';
import DemoEvaluationScreen from './screens/DemoEvaluationScreen';
import ProfileScreen from './screens/ProfileScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitle: 'Back', // For iOS
      }}
    >
      {/* Always available auth screens */}
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{ title: 'Sign Up' }}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      
      {/* Student Dashboard and related screens */}
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{
          title: 'Student Dashboard',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="StudentClassroom"
        component={StudentClassroomScreen}
        options={{ title: 'Classroom' }}
      />
      <Stack.Screen
        name="SubmitAssignment"
        component={SubmitAssignment}
        options={{ title: 'Submit Assignment' }}
      />
      
      {/* Lecturer Dashboard and related screens */}
      <Stack.Screen
        name="LecturerDashboard"
        component={LecturerDashboard}
        options={{
          title: 'Lecturer Dashboard',
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="CreateClassroom"
        component={CreateClassroom}
        options={{ title: 'Create Classroom' }}
      />
      <Stack.Screen
        name="LecturerClassroom"
        component={LecturerClassroomScreen}
        options={{ title: 'Classroom' }}
      />
      <Stack.Screen
        name="CreateAssignment"
        component={CreateAssignment}
        options={{ title: 'Create Assignment' }}
      />
      <Stack.Screen
        name="Submissions"
        component={SubmissionsScreen}
        options={{ title: 'Student Submissions' }}
      />
      <Stack.Screen
        name="SubmissionDetail"
        component={SubmissionDetailScreen}
        options={{ title: 'Submission Details' }}
      />
      <Stack.Screen 
        name="EvaluationScreen" 
        component={EvaluationScreen}
        options={{ title: 'Evaluate Submission' }}
      />
      <Stack.Screen
        name="AIEvaluation"
        component={AIEvaluationScreen}
        options={{ title: 'AI Evaluation' }}
      />
      <Stack.Screen
        name="DemoEvaluation"
        component={DemoEvaluationScreen}
        options={{ title: 'Evaluation Demo' }}
      />
      
      {/* Shared screens */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}