import { StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: screenWidth * 0.9,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  timer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 0,
  },
  menuText: {
    color: '#B0B0B0',
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: '#B0B0B0',
    marginVertical: 5,
  },
  classText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  locationText: {
    color: '#B0B0B0',
    fontSize: 16,
    marginBottom: 5,
  },
  timeText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 10,
  },
  noEventText: {
    color: '#D84343',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    borderRadius: 5,
  },
  signInButton: {
    marginTop: 10,
    backgroundColor: '#D84343',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    minWidth: 260,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  signInText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  signOutButtonContainer: {
    position: 'absolute',
    top: -4,
    right: 257,
    zIndex: 1,
  },
  signOutButton: {
    backgroundColor: '#8B2E2E',
    borderRadius: 8,
    height: 34,
    width: 69,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  signOutButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
