import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    color: 'white',
  },
  clearButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontSize: 14,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    paddingHorizontal: 10,
  },
});
