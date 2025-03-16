import { handleCalloutPress } from '../utils';
import { Alert } from 'react-native';
import { Router } from 'expo-router';

jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('handleCalloutPress', () => {
  let mockRouter: Router;
  let mockSetIndoorBuilding: jest.Mock;

  beforeEach(() => {
    mockRouter = { push: jest.fn() } as unknown as Router;
    mockSetIndoorBuilding = jest.fn();
    jest.clearAllMocks();
  });

  it('calls Alert.alert when a valid building is pressed', () => {
    handleCalloutPress('Hall Building', mockRouter, mockSetIndoorBuilding);

    expect(Alert.alert).toHaveBeenCalledWith(
      'Enter Hall Building?',
      'Do you wish to enter this building?',
      expect.any(Array)
    );
  });

  it('does not call Alert.alert for an invalid building', () => {
    handleCalloutPress('Unknown Building', mockRouter, mockSetIndoorBuilding);

    expect(Alert.alert).not.toHaveBeenCalled();
  });

  it('calls setIndoorBuilding and navigates to /indoor when "Enter" is pressed', () => {
    let enterButtonCallback: (() => void) | undefined;

    (Alert.alert as jest.Mock).mockImplementation(
      (
        _title: string,
        _message: string,
        buttons?: { text: string; onPress?: () => void }[]
      ) => {
        const enterButton = buttons?.find(btn => btn.text === 'Enter');
        enterButtonCallback = enterButton?.onPress;
      }
    );

    handleCalloutPress('MB Building', mockRouter, mockSetIndoorBuilding);

    expect(Alert.alert).toHaveBeenCalled();

    enterButtonCallback?.();

    expect(mockSetIndoorBuilding).toHaveBeenCalledWith('MB Building');
    expect(mockRouter.push).toHaveBeenCalledWith('/indoor');
  });

  it('does not call setIndoorBuilding or navigate if "Cancel" is pressed', () => {
    let cancelButtonCallback: (() => void) | undefined;

    (Alert.alert as jest.Mock).mockImplementation(
      (
        _title: string,
        _message: string,
        buttons?: { text: string; onPress?: () => void }[]
      ) => {
        const cancelButton = buttons?.find(btn => btn.text === 'Cancel');
        cancelButtonCallback = cancelButton?.onPress;
      }
    );

    handleCalloutPress('VE Building', mockRouter, mockSetIndoorBuilding);

    expect(Alert.alert).toHaveBeenCalled();

    cancelButtonCallback?.();

    expect(mockSetIndoorBuilding).not.toHaveBeenCalled();
    expect(mockRouter.push).not.toHaveBeenCalled();
  });
});
