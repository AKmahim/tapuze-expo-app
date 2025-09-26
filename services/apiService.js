// API Service for handling backend communication
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://tapuze.xrinteractive.site/api/v1'; // Tapuze API base URL

// Test API connection
export const testApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/test`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    // Even if the endpoint doesn't exist, we can check if the server responds
    return response.status;
  } catch (error) {
    console.error('API connection test failed:', error);
    throw new Error('Unable to connect to the API server');
  }
};

// Authentication APIs
export const signUpUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sign-up`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && result.errors) {
        const errorObj = new Error(result.message || 'Validation failed');
        errorObj.validationErrors = result.errors;
        errorObj.status = 422;
        throw errorObj;
      }
      
      // Handle other errors
      const errorObj = new Error(result.message || result.error || 'Sign up failed');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Sign up failed:', error);
    
    // If it's a network error or JSON parsing error
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const signInUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && result.errors) {
        const errorObj = new Error(result.message || 'Validation failed');
        errorObj.validationErrors = result.errors;
        errorObj.status = 422;
        throw errorObj;
      }
      
      // Handle invalid credentials (401)
      if (response.status === 401) {
        const errorObj = new Error(result.message || 'Invalid credentials');
        errorObj.status = 401;
        throw errorObj;
      }
      
      // Handle server errors (500)
      if (response.status === 500) {
        const errorObj = new Error(result.message || 'Server error occurred');
        errorObj.status = 500;
        errorObj.serverError = result.error;
        throw errorObj;
      }
      
      // Handle other errors
      const errorObj = new Error(result.message || result.error || 'Sign in failed');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Sign in failed:', error);
    
    // If it's a network error or JSON parsing error
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const logoutUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Logout failed');
    }

    return result;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

// Lecturer Classroom Management APIs
export const getAllClassrooms = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/classroom/get-classrooms`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch classrooms');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch classrooms:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const createClassroom = async (classroomData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/classroom/create-classroom`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(classroomData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && result.errors) {
        const errorObj = new Error(result.message || 'Validation failed');
        errorObj.validationErrors = result.errors;
        errorObj.status = 422;
        throw errorObj;
      }
      
      // Handle other errors
      const errorObj = new Error(result.message || 'Failed to create classroom');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to create classroom:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const deleteClassroom = async (classroomId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/classroom/delete-classroom/${classroomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to delete classroom');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to delete classroom:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

// Lecturer Assignment Management APIs
export const getAllAssignments = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/assignment/get-assignments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch assignments');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch assignments:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const getAssignmentsByClassroomId = async (classroomId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/assignment/get-assignments-by-classroom/${classroomId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch assignments');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch assignments by classroom:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const createAssignment = async (assignmentData) => {
  try {
    const token = await getAuthToken();
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('title', assignmentData.title);
    formData.append('description', assignmentData.description);
    formData.append('deadline', assignmentData.deadline);
    formData.append('classroom_id', assignmentData.classroom_id);
    
    if (assignmentData.questions) {
      formData.append('questions', assignmentData.questions);
    }

    const response = await fetch(`${API_BASE_URL}/lecturer/assignment/create-assignment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && result.errors) {
        const errorObj = new Error(result.message || 'Validation failed');
        errorObj.validationErrors = result.errors;
        errorObj.status = 422;
        throw errorObj;
      }
      
      // Handle other errors
      const errorObj = new Error(result.message || 'Failed to create assignment');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to create assignment:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const deleteAssignment = async (assignmentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/assignment/delete-assignment/${assignmentId}`, {
      method: 'GET', // Note: API uses GET for delete
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to delete assignment');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to delete assignment:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

// Assignment Submission Management APIs
export const getAllSubmissions = async () => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/submission/get-submissions`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch submissions');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch all submissions:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const getSubmissionsByAssignmentId = async (assignmentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/submission/get-submissions-by-assignment-id/${assignmentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch submissions');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch submissions by assignment:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const getSubmissionById = async (submissionId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/submission/get-submission/${submissionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch submission');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch submission:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const gradeSubmission = async (submissionId, gradeData) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/submission/grade-submission/${submissionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(gradeData)
    });

    const result = await response.json();
    
    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && result.errors) {
        const errorObj = new Error(result.message || 'Validation failed');
        errorObj.validationErrors = result.errors;
        errorObj.status = 422;
        throw errorObj;
      }
      
      // Handle other errors
      const errorObj = new Error(result.message || 'Failed to grade submission');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to grade submission:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/lecturer/submission/delete-submission/${submissionId}`, {
      method: 'GET', // Note: API uses GET for delete
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to delete submission');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to delete submission:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

// Mock function for AI grading - replace with actual API call
export const gradeHomeworkWithAI = async (fileData) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response - replace with actual API call
    const mockResponse = {
      overall_score: 85,
      problem_breakdown: [
        {
          problem_description: { en: 'Problem 1: Basic Calculation', he: 'שאלה 1: חישוב בסיסי' },
          score: 20,
          max_score: 25,
          feedback: { 
            en: 'Good work on the basic calculation, but there are some minor errors.',
            he: 'עבודה טובה על החישוב הבסיסי, אך יש כמה שגיאות קטנות.'
          },
          teacher_recommendation: { 
            en: 'Review the calculation steps carefully.',
            he: 'בדוק את שלבי החישוב בקפידה.'
          },
          errors: [
            {
              error_type: 'minor_slip',
              deduction: 5,
              explanation: { 
                en: 'Minor calculation error in step 2.',
                he: 'שגיאת חישוב קטנה בשלב 2.'
              },
              hint: { 
                en: 'Double-check your arithmetic.',
                he: 'בדוק שוב את החשבון שלך.'
              },
              boundingBox: { x: 0.1, y: 0.2, width: 0.3, height: 0.1 }
            }
          ]
        },
        {
          problem_description: { en: 'Problem 2: Word Problem', he: 'שאלה 2: בעיית מילים' },
          score: 22,
          max_score: 25,
          feedback: { 
            en: 'Excellent understanding of the word problem.',
            he: 'הבנה מעולה של בעיית המילים.'
          },
          teacher_recommendation: { 
            en: 'Keep up the good work!',
            he: 'המשך בעבודה הטובה!'
          },
          errors: []
        }
      ]
    };
    
    return mockResponse;
  } catch (error) {
    console.error('AI grading failed:', error);
    throw new Error('Failed to get AI evaluation. Please try again.');
  }
};

// Mock function for updating submission evaluation - replace with actual API call
export const updateSubmissionEvaluation = async (classroomId, assignmentId, submissionId, evaluation) => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock API call - replace with actual implementation
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}/submissions/${submissionId}/evaluation`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add authentication headers if needed
        // 'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify(evaluation)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Failed to update submission evaluation:', error);
    throw new Error('Failed to save evaluation. Please try again.');
  }
};

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken') || '';
  } catch (error) {
    console.error('Error getting auth token:', error);
    return '';
  }
};

// Additional API functions you might need:

export const getSubmissions = async (classroomId, assignmentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}/submissions`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    throw error;
  }
};

export const getAssignment = async (classroomId, assignmentId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch assignment:', error);
    throw error;
  }
};

export const getClassroom = async (classroomId) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch classroom:', error);
    throw error;
  }
};

// Student APIs
export const getClassroomByCode = async (classroomCode) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/student/get-classroom-by-code/${classroomCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch classroom');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch classroom by code:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const getAssignmentsByClassroomCode = async (classroomCode) => {
  try {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/student/get-assignment-by-classroom-code/${classroomCode}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to fetch assignments');
      errorObj.status = response.status;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to fetch assignments by classroom code:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};

export const submitAssignment = async (assignmentId, submissionTitle, submissionDescription, fileUri, fileName, fileType) => {
  try {
    const token = await getAuthToken();
    
    const formData = new FormData();
    formData.append('assignment_id', assignmentId.toString());
    formData.append('submission_title', submissionTitle);
    formData.append('submission_description', submissionDescription);
    
    // Add the file
    formData.append('submission_file', {
      uri: fileUri,
      type: fileType || 'application/pdf',
      name: fileName || 'assignment_submission.pdf'
    });

    const response = await fetch(`${API_BASE_URL}/student/submit-assignment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      body: formData
    });

    const result = await response.json();
    
    if (!response.ok) {
      const errorObj = new Error(result.message || 'Failed to submit assignment');
      errorObj.status = response.status;
      errorObj.errors = result.errors;
      throw errorObj;
    }

    return result;
  } catch (error) {
    console.error('Failed to submit assignment:', error);
    
    if (!error.status) {
      const networkError = new Error('Network error. Please check your internet connection and try again.');
      networkError.status = 0;
      throw networkError;
    }
    
    throw error;
  }
};
