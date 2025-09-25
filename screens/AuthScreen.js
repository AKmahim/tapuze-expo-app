import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, TextInput, Alert } from 'react-native';
import { signInUser, testApiConnection } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

export default function AuthScreen({ navigation }) {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

  const handleContinue = async () => {
    // Clear previous errors
    setEmailError('');
    setPasswordError('');
    
    // Client-side validation
    let hasErrors = false;
    
    if (!email.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      hasErrors = true;
    }
    
    if (hasErrors) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await signInUser({
        email: email.trim(),
        password: password
      });

      if (response.status && response.data) {
        // Store user data in context
        const userData = {
          ...response.data.user,
          token: response.data.token
        };
        
        await login(userData.email, password, userData.role, userData);

        console.log('Login successful:', userData);
        
        // Navigate based on user role from API response
        if (userData.role === 'student') {
          navigation.navigate('StudentDashboard');
        } else if (userData.role === 'lecturer') {
          navigation.navigate('LecturerDashboard');
        } else {
          Alert.alert('Error', 'Invalid user role');
        }
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle different types of errors
      let errorTitle = 'Login Failed';
      let errorMessage = 'An unexpected error occurred. Please try again.';
      
      if (error.status === 422 && error.validationErrors) {
        // Handle validation errors from server
        if (error.validationErrors.email) {
          setEmailError(error.validationErrors.email[0]);
        }
        if (error.validationErrors.password) {
          setPasswordError(error.validationErrors.password[0]);
        }
        
        // Don't show alert for validation errors, let field errors show
        return;
          
      } else if (error.status === 401) {
        // Handle invalid credentials
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        
      } else if (error.status === 500) {
        // Handle server errors
        errorMessage = 'Server error occurred. Please try again later.';
        
      } else if (error.status === 0) {
        // Handle network errors
        errorMessage = 'Network error. Please check your internet connection and try again.';
        
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert(errorTitle, errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Mock Google login - does nothing for frontend demo
    Alert.alert(
      'Google Login',
      `Google sign-in as ${role} would happen here.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image 
                source={require('../assets/logo2.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your learning portal</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.sectionLabel}>I am a</Text>
          <View style={styles.roleSelector}>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'student' && styles.activeRole]}
              onPress={() => setRole('student')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>🎓</Text>
              <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>Student</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.roleButton, role === 'lecturer' && styles.activeRole]}
              onPress={() => setRole('lecturer')}
              activeOpacity={0.8}
            >
              <Text style={styles.roleIcon}>👨‍🏫</Text>
              <Text style={[styles.roleText, role === 'lecturer' && styles.activeRoleText]}>Lecturer</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder="Email address"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            
            <TextInput
              style={[styles.input, passwordError ? styles.inputError : null]}
              placeholder="Password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError('');
              }}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            
            <Text style={styles.demoHint}>
              Demo: Use credentials from your Tapuze account
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.9}
            disabled={isLoading}
          >
            <Text style={styles.continueButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton} 
            onPress={handleGoogleLogin}
            activeOpacity={0.9}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => navigation.navigate('Signup')}
            activeOpacity={0.7}
          >
            <Text style={styles.signupText}>
              Don't have an account? <Text style={styles.signupTextBold}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 18,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  logoImage: {
    width: 70,
    height: 70,
    borderRadius: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    color: '#1e293b',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 22,
  },
  formContainer: {
    flex: 1,
    minHeight: 400,
    paddingTop: 8,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 10,
    textAlign: 'center',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
    paddingHorizontal: 4,
  },
  roleButton: {
    flex: 1,
    maxWidth: 130,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    minHeight: 70,
  },
  activeRole: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  roleIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  roleText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 14,
  },
  activeRoleText: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 20,
  },
  demoHint: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  input: {
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 12,
    marginLeft: 2,
    fontWeight: '500',
  },
  continueButton: {
    height: 52,
    backgroundColor: '#6366f1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: '#94a3b8',
    shadowColor: '#94a3b8',
    shadowOpacity: 0.1,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 14,
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#dadce0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  googleIconContainer: {
    width: 18,
    height: 18,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4285f4',
  },
  googleButtonText: {
    color: '#3c4043',
    fontSize: 15,
    fontWeight: '500',
  },
  signupLink: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 8,
  },
  signupText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  signupTextBold: {
    color: '#6366f1',
    fontWeight: '600',
  },
});