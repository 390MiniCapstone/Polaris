import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View, Text } from 'react-native';
import { useSearchParams } from 'expo-router/build/hooks';
import { useGoogleAuth } from '@/contexts/AuthContext/AuthContext';

export default function OAuthRedirect() {
  const router = useRouter();
  const { user } = useGoogleAuth();

  useEffect(() => {
    if (user) {
      router.replace('/');
    } else {
      console.error('OAuth Error:', user);
      router.replace('/');
    }
  }, [user]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator
        size="large"
        color="#D84343"
        testID="activity-indicator"
      />
      <Text testID="processing-text" style={{ marginTop: 10 }}>
        Processing OAuth...
      </Text>
    </View>
  );
}
