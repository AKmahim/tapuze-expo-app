import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Generate unique IDs
  const generateUniqueId = () => {
    return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateStudentId = () => {
    return `S${Math.floor(10000 + Math.random() * 90000)}`;
  };

  const generateLecturerId = () => {
    return `L${Math.floor(1000 + Math.random() * 9000)}`;
  };

  const signup = (email, password, name, role, additionalData = {}) => {
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      throw new Error('User already exists with this email');
    }

    const uniqueId = role === 'student' ? generateStudentId() : generateLecturerId();

    const newUser = {
      id: generateUniqueId(),
      userId: uniqueId,
      email,
      name,
      role,
      joinedClassrooms: [],
      avatar: null,
      bio: '',
      department: role === 'lecturer' ? '' : undefined,
      phone: '',
      ...additionalData
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return newUser;
  };

  const login = (email, password, role) => {
    // In a real app, this would verify credentials with a backend
    const foundUser = users.find(u => u.email === email) || {
      id: generateUniqueId(),
      userId: role === 'student' ? generateStudentId() : generateLecturerId(),
      email,
      name: role === 'student' ? 'Student User' : 'Lecturer User',
      role,
      joinedClassrooms: [],
    };

    setUser(foundUser);
    return foundUser;
  };

  const logout = () => {
    setUser(null);
  };

  const joinClassroom = (classroomCode) => {
    if (user && !user.joinedClassrooms.includes(classroomCode)) {
      const updatedUser = {
        ...user,
        joinedClassrooms: [...user.joinedClassrooms, classroomCode]
      };
      setUser(updatedUser);

      // Update in users array
      setUsers(prev => prev.map(u =>
        u.id === user.id ? updatedUser : u
      ));
    }
  };

  const addClassroom = (newClassroom) => {
    // Check if classroom with same name already exists
    const nameExists = classrooms.some(
      classroom => classroom.name.toLowerCase() === newClassroom.name.toLowerCase()
    );

    if (nameExists) {
      throw new Error('A classroom with this name already exists');
    }

    // Check if classroom with same code already exists
    const codeExists = classrooms.some(
      classroom => classroom.code === newClassroom.code
    );

    if (codeExists) {
      throw new Error('A classroom with this code already exists');
    }

    const classroomWithId = {
      ...newClassroom,
      id: generateUniqueId()
    };
    setClassrooms(prev => [...prev, classroomWithId]);
  };

  const deleteClassroom = (classroomId) => {
    setClassrooms(prev => prev.filter(classroom => classroom.id !== classroomId));
    // Also delete all assignments and submissions for this classroom
    setAssignments(prev => prev.filter(assignment => assignment.classroomId !== classroomId));
    setSubmissions(prev => prev.filter(submission => submission.classroomId !== classroomId));
  };

  const addAssignment = (newAssignment) => {
    const assignmentWithId = {
      ...newAssignment,
      id: generateUniqueId(),
      submissions: 0 // Initialize submission count
    };
    setAssignments(prev => [...prev, assignmentWithId]);
  };

  const deleteAssignment = (assignmentId) => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
    // Also delete all submissions for this assignment
    setSubmissions(prev => prev.filter(submission => submission.assignmentId !== assignmentId));
  };

  const addSubmission = (submissionData) => {
    const newSubmission = {
      id: generateUniqueId(),
      ...submissionData,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    setSubmissions(prev => [...prev, newSubmission]);

    // Update assignment submission count
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === submissionData.assignmentId
          ? { ...assignment, submissions: (assignment.submissions || 0) + 1 }
          : assignment
      )
    );

    return newSubmission;
  };

  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions.filter(submission => submission.assignmentId === assignmentId);
  };

  const updateSubmissionWithEvaluation = (submissionId, evaluation) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === submissionId
          ? { ...submission, evaluation, status: 'evaluated' }
          : submission
      )
    );
  };

  const getSubmissionEvaluation = (submissionId) => {
    return submissions.find(sub => sub.id === submissionId)?.evaluation || null;
  };

  return (
    <AuthContext.Provider value={{
      user,
      users,
      classrooms,
      assignments,
      submissions,
      signup,
      login,
      logout,
      joinClassroom,
      addClassroom,
      deleteClassroom,
      addAssignment,
      deleteAssignment,
      addSubmission,
      getSubmissionsForAssignment,
      updateSubmissionWithEvaluation,
      getSubmissionEvaluation
    }}>
      {children}
    </AuthContext.Provider>
  );
};