import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const SparklesIcon = ({ className, style, ...props }) => {
  // Extract size from className or use default
  const sizeMatch = className?.match(/w-(\d+)/);
  const size = sizeMatch ? parseInt(sizeMatch[1]) * 4 : 24; // Convert from Tailwind to pixels
  
  return (
    <View style={[{ width: size, height: size }, style]} {...props}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
        <Path d="M19 12l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" />
        <Path d="M5 5l0.5 1.5L7 7l-1.5 0.5L5 9l-0.5-1.5L3 7l1.5-0.5L5 5z" />
      </Svg>
    </View>
  );
};

export default SparklesIcon;
