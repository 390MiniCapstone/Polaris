import { Alert } from 'react-native';
import { Router } from 'expo-router';

export const handleCalloutPress = (
  buildingName: string,
  router: Router,
  setIndoorBuilding: React.Dispatch<React.SetStateAction<string>>
) => {
  const pressable = ['Hall', 'MB', 'VE', 'CC', 'VL'].filter((el: string) =>
    buildingName.includes(el)
  );
  if (pressable.length) {
    Alert.alert(
      `Enter ${buildingName}?`,
      'Do you wish to enter this building?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enter',
          onPress: () =>
            handleEnterBuilding(buildingName, router, setIndoorBuilding),
        },
      ]
    );
  }
};

const handleEnterBuilding = (
  buildingName: string,
  router: Router,
  setIndoorBuilding: React.Dispatch<React.SetStateAction<string>>
) => {
  setIndoorBuilding(buildingName);
  router.push('/indoor');
};
