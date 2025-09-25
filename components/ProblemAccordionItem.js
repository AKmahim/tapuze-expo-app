import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';

const ProblemAccordionItem = ({ 
  problem, 
  language, 
  onHoverError, 
  isEditable, 
  onProblemChange, 
  onErrorChange, 
  onAddError, 
  onRemoveError 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={toggleExpanded}>
        <View style={styles.headerContent}>
          <Text style={styles.problemTitle}>
            {problem.problem_description[language]}
          </Text>
          <Text style={styles.score}>
            {problem.score}/{problem.max_score}
          </Text>
        </View>
        <Text style={styles.expandIcon}>
          {isExpanded ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          <Text style={styles.feedback}>
            {problem.feedback[language]}
          </Text>
          
          {problem.teacher_recommendation[language] && (
            <View style={styles.recommendationContainer}>
              <Text style={styles.recommendationLabel}>Recommendation:</Text>
              <Text style={styles.recommendation}>
                {problem.teacher_recommendation[language]}
              </Text>
            </View>
          )}
          
          {problem.errors && problem.errors.length > 0 && (
            <View style={styles.errorsContainer}>
              <Text style={styles.errorsLabel}>Errors:</Text>
              {problem.errors.map((error, index) => (
                <View key={index} style={styles.errorItem}>
                  <Text style={styles.errorType}>{error.error_type}</Text>
                  <Text style={styles.errorExplanation}>
                    {error.explanation[language]}
                  </Text>
                  <Text style={styles.errorDeduction}>
                    -{error.deduction} points
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  problemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
  },
  score: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginLeft: 16,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginLeft: 16,
  },
  content: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  feedback: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationContainer: {
    marginBottom: 12,
  },
  recommendationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  recommendation: {
    fontSize: 14,
    color: '#059669',
    fontStyle: 'italic',
  },
  errorsContainer: {
    marginTop: 8,
  },
  errorsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 8,
  },
  errorItem: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  errorType: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  errorExplanation: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  errorDeduction: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '500',
  },
});

export default ProblemAccordionItem;
