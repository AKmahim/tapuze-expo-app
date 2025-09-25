import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GradeDonutChart = ({ score, isEditable, onScoreChange }) => {
  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e'; // green
    if (score >= 80) return '#eab308'; // yellow
    if (score >= 70) return '#f97316'; // orange
    return '#ef4444'; // red
  };

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: getScoreColor(score) }]}>
        <Text style={[styles.scoreText, { color: getScoreColor(score) }]}>
          {score}%
        </Text>
      </View>
      {isEditable && (
        <Text style={styles.editableHint}>Tap to edit</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  editableHint: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8,
  },
});

export default GradeDonutChart;
