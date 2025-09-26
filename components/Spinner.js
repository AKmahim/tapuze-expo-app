import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

const Spinner = ({ 
  text = 'Loading...', 
  size = 'large', 
  color = '#0066cc', 
  showText = true,
  style 
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
      {showText && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default Spinner;
