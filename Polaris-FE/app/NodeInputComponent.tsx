import { StyleSheet, Text, TextInput, View } from 'react-native';

const NodeInput = ({
  label,
  value,
  onChangeText,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
}) => {
  return (
    <View style={styles.nodeInputContainer}>
      <Text style={styles.nodeInputLabel}>{label}:</Text>
      <TextInput
        style={styles.nodeInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label} node`}
        placeholderTextColor="#888"
        keyboardType="default"
        autoCapitalize="characters"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nodeInputContainer: {
    marginBottom: 12,
  },
  nodeInputLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#fff',
  },
  nodeInput: {
    borderWidth: 1,
    borderColor: '#555',
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
});

export default NodeInput;
