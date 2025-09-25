import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const PlusIcon = ({ className, style, ...props }) => {
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
        <Path d="M12 5v14m-7-7h14" />
      </Svg>
    </View>
  );
};

export default PlusIcon;
