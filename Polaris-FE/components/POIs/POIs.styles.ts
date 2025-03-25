import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  scrollWrapper: {
    width: '100%',
    paddingVertical: 10,
  },
  categoryContainer: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    paddingRight: 20,
  },
  categoryButton: {
    backgroundColor: 'rgba(151, 151, 151, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  categoryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
