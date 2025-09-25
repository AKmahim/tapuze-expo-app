import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, TextInput, Image, ScrollView, Dimensions } from 'react-native';
import { signUpUser } from '../services/apiService';

export default function SignupScreen({ navigation }) {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Reset form fields
  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setDepartment('');
    setRole('student');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFieldErrors({});
    setIsLoading(false);
  };

  // Clear form when component mounts (when user navigates to signup screen)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, [navigation]);
  
  const handleGoogleSignup = () => {
    Alert.alert(
      'Coming Soon',
      'Google sign-up will be available in a future update. Please use the manual signup form below.',
      [{ text: 'OK' }]
    );
  };

  const validateInputs = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address');
      return false;
    }
    if (!email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return false;
    }
    if (!password) {
      Alert.alert('Validation Error', 'Please enter a password');
      return false;
    }
    if (password.length < 8) {
      Alert.alert('Validation Error', 'Password must be at least 8 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const formatValidationErrors = (errors) => {
    const errorMessages = [];
    
    Object.keys(errors).forEach(field => {
      const fieldErrors = errors[field];
      if (Array.isArray(fieldErrors)) {
        fieldErrors.forEach(error => {
          // Make error messages more user-friendly
          let friendlyError = error;
          
          // Common Laravel validation message improvements
          if (error.includes('email field must be a valid email address')) {
            friendlyError = 'Please enter a valid email address';
          } else if (error.includes('email has already been taken')) {
            friendlyError = 'This email address is already registered. Please use a different email or try signing in.';
          } else if (error.includes('password field must be at least 8 characters')) {
            friendlyError = 'Password must be at least 8 characters long';
          } else if (error.includes('password field confirmation does not match')) {
            friendlyError = 'Password confirmation does not match';
          } else if (error.includes('name field is required')) {
            friendlyError = 'Full name is required';
          } else if (error.includes('role field is required')) {
            friendlyError = 'Please select your role (Student or Lecturer)';
          }
          
          errorMessages.push(`• ${friendlyError}`);
        });
      }
    });
    
    return errorMessages.join('\n');
  };

  const getFieldName = (field) => {
    const fieldNames = {
      'name': 'Name',
      'email': 'Email',
      'password': 'Password',
      'phone_number': 'Phone Number',
      'role': 'Role',
      'department': 'Department'
    };
    return fieldNames[field] || field;
  };

  const clearFieldError = (fieldName) => {
    if (fieldErrors[fieldName]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const setServerValidationErrors = (errors) => {
    const errorMap = {};
    Object.keys(errors).forEach(field => {
      errorMap[field] = errors[field][0]; // Take first error message
    });
    setFieldErrors(errorMap);
  };

  const handleManualSignup = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        password_confirmation: confirmPassword,
        role: role,
      };

      // Add phone number if provided
      if (phoneNumber.trim()) {
        userData.phone_number = phoneNumber.trim();
      }

      // Add department for lecturers
      if (role === 'lecturer' && department.trim()) {
        userData.department = department.trim();
      }

      const response = await signUpUser(userData);
      
      if (response.status && response.data) {
        // Reset form completely
        resetForm();
        
        Alert.alert(
          'Account Created Successfully! 🎉', 
          'Your account has been created. Please sign in to continue.',
          [
            { 
              text: 'Sign In Now', 
              onPress: () => navigation.navigate('AuthScreen')
            }
          ]
        );
      } else {
        throw new Error(response.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Signup error:', error);
      
      let title = 'Signup Failed';
      let message = 'An unexpected error occurred. Please try again.';
      
      if (error.status === 422 && error.validationErrors) {
        // Handle Laravel validation errors
        setServerValidationErrors(error.validationErrors);
        title = 'Please Fix the Following Issues';
        message = formatValidationErrors(error.validationErrors);
      } else if (error.status === 0) {
        // Network error
        title = 'Connection Error';
        message = 'Please check your internet connection and try again.';
      } else if (error.message) {
        // Other API errors
        if (error.message.includes('email') && error.message.includes('unique')) {
          title = 'Email Already Exists';
          message = 'An account with this email address already exists. Please use a different email or try signing in.';
        } else {
          message = error.message;
        }
      }
      
      Alert.alert(title, message, [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our learning community today</Text>
          </View>
          
          <View style={styles.formContainer}>
            <View style={styles.formHeader}>
              <Text style={styles.sectionLabel}>I am a</Text>
              {(name || email || password || phoneNumber || department) && (
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={resetForm}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearButtonText}>Clear Form</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.roleSelector}>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'student' && styles.activeRole]}
                onPress={() => {
                  setRole('student');
                  clearFieldError('role');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.roleIcon}>🎓</Text>
                <Text style={[styles.roleText, role === 'student' && styles.activeRoleText]}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.roleButton, role === 'lecturer' && styles.activeRole]}
                onPress={() => {
                  setRole('lecturer');
                  clearFieldError('role');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.roleIcon}>👨‍🏫</Text>
                <Text style={[styles.roleText, role === 'lecturer' && styles.activeRoleText]}>Lecturer</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={[styles.input, fieldErrors.name && styles.inputError]}
                placeholder="Full Name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  clearFieldError('name');
                }}
                autoCapitalize="words"
                autoCorrect={false}
              />
              <TextInput
                style={[styles.input, fieldErrors.email && styles.inputError]}
                placeholder="Email address"
                placeholderTextColor="#94a3b8"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  clearFieldError('email');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TextInput
                style={[styles.input, fieldErrors.phone_number && styles.inputError]}
                placeholder="Phone Number (Optional)"
                placeholderTextColor="#94a3b8"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  clearFieldError('phone_number');
                }}
                keyboardType="phone-pad"
                autoCorrect={false}
              />
              {role === 'lecturer' && (
                <TextInput
                  style={[styles.input, fieldErrors.department && styles.inputError]}
                  placeholder="Department (Optional)"
                  placeholderTextColor="#94a3b8"
                  value={department}
                  onChangeText={(text) => {
                    setDepartment(text);
                    clearFieldError('department');
                  }}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
              )}
              <View style={[styles.passwordContainer, fieldErrors.password && styles.inputError]}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    clearFieldError('password');
                  }}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm Password"
                  placeholderTextColor="#94a3b8"
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    clearFieldError('password');
                  }}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
              onPress={handleManualSignup}
              activeOpacity={isLoading ? 1 : 0.9}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity 
              style={styles.googleButton} 
              onPress={handleGoogleSignup}
              activeOpacity={0.9}
            >
              <View style={styles.googleIconContainer}>
                <Text style={styles.googleIcon}>G</Text>
              </View>
              <Text style={styles.googleButtonText}>Sign up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginLink}
              onPress={() => navigation.navigate('AuthScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.securityInfo}>
              <Text style={styles.infoText}>
                🔒 Your data is protected with enterprise-grade security
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    minHeight: Dimensions.get('window').height - 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    marginBottom: 18,
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
    fontSize: 26,
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
    paddingTop: 8,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    flex: 1,
    textAlign: 'center',
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 5,
    gap: 10,
    paddingHorizontal: 4,
  },
  roleButton: {
    flex: 1,
    maxWidth: 130,
    alignItems: 'center',
    paddingVertical: 14,
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
    minHeight: 66,
  },
  activeRole: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
  roleIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  roleText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  activeRoleText: {
    color: '#ffffff',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 12,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
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
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 14,
    fontSize: 15,
    color: '#1e293b',
  },
  eyeButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  eyeIcon: {
    fontSize: 18,
  },
  signupButton: {
    height: 50,
    backgroundColor: '#6366f1',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#6366f1',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: '#9ca3af',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 1.5,
  },
  signupButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
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
  loginLink: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  loginLinkText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
  },
  loginLinkBold: {
    color: '#6366f1',
    fontWeight: '600',
  },
  securityInfo: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  infoText: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 13,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});