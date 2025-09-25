import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function AIEvaluationScreen({ navigation, route }) {
  const { submission, assignment } = route.params;
  const { updateSubmissionWithEvaluation } = useAuth();
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  // Mock AI evaluation data
  const mockEvaluation = {
    overallScore: 85,
    totalPoints: 100,
    feedback: "Excellent work! The student demonstrated strong understanding of the concepts with clear explanations and proper formatting.",
    parts: [
      {
        part: "Introduction",
        score: 9,
        maxScore: 10,
        feedback: "Well-structured introduction with clear thesis statement."
      },
      {
        part: "Literature Review",
        score: 17,
        maxScore: 20,
        feedback: "Comprehensive review but could include more recent sources."
      },
      {
        part: "Methodology",
        score: 18,
        maxScore: 20,
        feedback: "Detailed methodology section with appropriate research design."
      },
      {
        part: "Analysis",
        score: 16,
        maxScore: 20,
        feedback: "Good analysis but could delve deeper into the data interpretation."
      },
      {
        part: "Conclusion",
        score: 9,
        maxScore: 10,
        feedback: "Strong conclusion that effectively summarizes key findings."
      },
      {
        part: "References",
        score: 8,
        maxScore: 10,
        feedback: "Mostly proper formatting, but missing a few citations."
      },
      {
        part: "Formatting",
        score: 8,
        maxScore: 10,
        feedback: "Good overall formatting with consistent style."
      }
    ],
    tips: [
      "Include more recent scholarly sources in literature review",
      "Expand data interpretation in analysis section",
      "Double-check citation formatting for consistency",
      "Consider adding visual aids to support arguments"
    ],
    evaluatedAt: new Date().toISOString()
  };

  const simulateAIEvaluation = () => {
    setIsEvaluating(true);

    // Simulate AI processing time
    setTimeout(() => {
      setEvaluation(mockEvaluation);
      setIsEvaluating(false);
    }, 2000);
  };

  const submitEvaluation = () => {
    updateSubmissionWithEvaluation(submission.id, evaluation);
    Alert.alert(
      "Evaluation Complete",
      "AI evaluation has been submitted and the student will be notified.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>AI Evaluation</Text>

        <View style={styles.assignmentInfo}>
          <Text style={styles.sectionTitle}>Assignment: {assignment.title}</Text>
          <Text style={styles.studentInfo}>Student: {submission.studentName}</Text>
          <Text style={styles.fileInfo}>File: {submission.files[0]?.name}</Text>
        </View>

        {!evaluation ? (
          <View style={styles.evaluationPrompt}>
            <Text style={styles.promptText}>
              AI will evaluate this submission based on content quality, structure, formatting, and adherence to assignment requirements.
            </Text>

            {!isEvaluating ? (
              <TouchableOpacity
                style={styles.evaluateButton}
                onPress={simulateAIEvaluation}
              >
                <Text style={styles.evaluateButtonText}>Start AI Evaluation</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>AI is evaluating submission...</Text>
                <Text style={styles.loadingSubtext}>Analyzing content, structure, and quality</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.resultsContainer}>
            <View style={styles.overallScore}>
              <Text style={styles.scoreTitle}>Overall Score</Text>
              <Text style={styles.scoreValue}>{evaluation.overallScore}%</Text>
              <Text style={styles.scoreSubtext}>out of {evaluation.totalPoints} points</Text>
            </View>

            <Text style={styles.sectionTitle}>Detailed Feedback</Text>
            <Text style={styles.overallFeedback}>{evaluation.feedback}</Text>

            <Text style={styles.sectionTitle}>Part-by-Part Evaluation</Text>
            {evaluation.parts.map((part, index) => (
              <View key={index} style={styles.partEvaluation}>
                <View style={styles.partHeader}>
                  <Text style={styles.partName}>{part.part}</Text>
                  <Text style={styles.partScore}>{part.score}/{part.maxScore}</Text>
                </View>
                <Text style={styles.partFeedback}>{part.feedback}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Improvement Tips</Text>
            {evaluation.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}

            <TouchableOpacity
              style={styles.submitEvaluationButton}
              onPress={submitEvaluation}
            >
              <Text style={styles.submitEvaluationText}>Apply AI Evaluation</Text>
            </TouchableOpacity>

          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  assignmentInfo: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    marginTop: 20,
  },
  studentInfo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  fileInfo: {
    fontSize: 14,
    color: '#888',
  },
  evaluationPrompt: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  promptText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  evaluateButton: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  evaluateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#4a90e2',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  resultsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  overallScore: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
  },
  scoreTitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  scoreSubtext: {
    fontSize: 14,
    color: '#666',
  },
  overallFeedback: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  partEvaluation: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  partHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  partName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  partScore: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  partFeedback: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#fff8e1',
    borderRadius: 6,
  },
  tipBullet: {
    fontSize: 16,
    color: '#ff8f00',
    marginRight: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  submitEvaluationButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitEvaluationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});