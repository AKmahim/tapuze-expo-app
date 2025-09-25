import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoBanner = ({ children, type = 'info' }) => {
  const getBannerStyle = () => {
    switch (type) {
      case 'warning':
        return {
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
        };
      case 'error':
        return {
          backgroundColor: '#fecaca',
          borderColor: '#ef4444',
        };
      case 'success':
        return {
          backgroundColor: '#d1fae5',
          borderColor: '#10b981',
        };
      default:
        return {
          backgroundColor: '#dbeafe',
          borderColor: '#3b82f6',
        };
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return '#92400e';
      case 'error':
        return '#dc2626';
      case 'success':
        return '#065f46';
      default:
        return '#1e40af';
    }
  };

  return (
    <View style={[styles.container, getBannerStyle()]}>
      <View style={styles.content}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === Text) {
            return React.cloneElement(child, {
              style: [child.props.style, { color: getTextColor() }]
            });
          }
          return child;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginVertical: 8,
  },
  content: {
    flex: 1,
  },
});

export default InfoBanner;
