import { useEffect } from 'react';
import Constants from 'expo-constants';

/**
 * Hook to gather usability testing on the app.
 * This hook initializes MS Clarity only when running on native code. To avoid
 * Maestro from tampering with the stats, set the environment variable MAESTRO_TEST=true when running system tests on the
 * application.
 */
const useClarity = () => {
  useEffect(() => {
    const execEnv = Constants.executionEnvironment;
    const msClarityApiKey = Constants.expoConfig?.extra?.msClarityApiKey;
    const maestroTest = Constants.expoConfig?.extra?.maestroTest;
    if (execEnv == 'bare' && !maestroTest) {
      const Clarity = require('@microsoft/react-native-clarity') as {
        initialize: (key: string) => void;
      };
      Clarity.initialize(msClarityApiKey);
      console.log('MS Clarity Initialized');
    }
  }, []);
};

export default useClarity;
