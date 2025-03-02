import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useSelectedCalendar() {
  const [selectedCalendarId, setSelectedCalendarId] = useState<string | null>(
    null
  );
  const [selectedCalendarName, setSelectedCalendarName] =
    useState<string>('Select a calendar');

  useEffect(() => {
    const loadSelectedCalendar = async () => {
      try {
        const storedId = await AsyncStorage.getItem('@selectedCalendarId');
        const storedName = await AsyncStorage.getItem('@selectedCalendarName');

        if (storedId && storedName) {
          setSelectedCalendarId(storedId);
          setSelectedCalendarName(storedName);
        }
      } catch (error) {
        console.error('Error loading calendar:', error);
      }
    };

    loadSelectedCalendar();
  }, []);

  const saveSelectedCalendar = async (id: string, name: string) => {
    try {
      await AsyncStorage.setItem('@selectedCalendarId', id);
      await AsyncStorage.setItem('@selectedCalendarName', name);
      setSelectedCalendarId(id);
      setSelectedCalendarName(name);
    } catch (error) {
      console.error('Error saving calendar:', error);
    }
  };

  return { selectedCalendarId, selectedCalendarName, saveSelectedCalendar };
}
