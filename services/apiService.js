// API Service for handling backend communication

const API_BASE_URL = 'https://tapuze.xrinteractive.site/api/v1'; // Tapuze API base URL

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
      throw new Error(result.message || 'Sign in failed');
    }

    return result;
  } catch (error) {
    console.error('Sign in failed:', error);
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

// Helper function to get auth token (implement based on your auth system)
const getAuthToken = () => {
  // Replace with your actual token retrieval logic
  return localStorage.getItem('authToken') || '';
};

// Additional API functions you might need:

export const getSubmissions = async (classroomId, assignmentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}/submissions`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
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
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}/assignments/${assignmentId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
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
    const response = await fetch(`${API_BASE_URL}/classrooms/${classroomId}`, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
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
