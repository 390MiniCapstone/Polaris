import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface InstructionsProps {
  instruction: string;
}

export const Instructions: React.FC<InstructionsProps> = ({ instruction }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>{instruction}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 64,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    height: 80,
    justifyContent: 'center',
  },
  instruction: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'left',
  },
});
