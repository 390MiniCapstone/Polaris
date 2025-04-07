import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import {
  Card,
  Text,
  Button,
  Menu,
  ActivityIndicator,
} from 'react-native-paper';
import dayjs from 'dayjs';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useGoogleNextEvent } from '@/hooks/useGoogleNextEvent';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useGoogleAuth } from '@/contexts/AuthContext/AuthContext';
import { useGoogleCalendars } from '@/hooks/useGoogleCalendar';
import { useSelectedCalendar } from '@/hooks/useSelectedCalendar';
import { useNextClassTimer } from '@/hooks/useNextClassTimer';
import { styles } from './NextClassCard.styles';

const NextClassCard: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { user, accessToken, promptAsync, logout } = useGoogleAuth();
  const { data: calendars, isLoading, error } = useGoogleCalendars();
  const { selectedCalendarId, selectedCalendarName, saveSelectedCalendar } =
    useSelectedCalendar();
  const { data: nextevent } = useGoogleNextEvent(
    accessToken,
    selectedCalendarId
  );
  const { timeLeft, progress } = useNextClassTimer(nextevent ?? null);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const confirmSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout },
      ],
      { cancelable: true }
    );
  };

  const renderMenuItems = () => {
    if (isLoading) {
      return <ActivityIndicator animating size="small" color="#ffffff" />;
    }
    if (error) {
      return <Menu.Item title="Error loading calendars" disabled />;
    }
    if (calendars && calendars.length > 0) {
      return calendars.map(calendar => (
        <Menu.Item
          key={calendar.id}
          onPress={() => {
            saveSelectedCalendar(calendar.id, calendar.summary);
            closeMenu();
          }}
          title={calendar.summary}
        />
      ));
    }
    return <Menu.Item title="No calendars available" disabled />;
  };

  const renderEventDetails = () => {
    if (!nextevent) {
      return <Text style={styles.noEventText}>🚀 No Future Events Found</Text>;
    }
    return (
      <React.Fragment>
        <View style={styles.separator} />
        <Text style={styles.classText}>{nextevent.summary}</Text>
        <Text style={styles.locationText}>{nextevent.location}</Text>
        {nextevent.start?.date ? (
          <Text style={styles.timeText}>
            {dayjs(nextevent.start.date).format('dddd, MMM D, YYYY')} (All Day)
          </Text>
        ) : (
          <Text style={styles.timeText}>
            {dayjs(nextevent?.start?.dateTime).format('hh:mm A')} -{' '}
            {dayjs(nextevent?.end?.dateTime).format('hh:mm A')}
          </Text>
        )}
      </React.Fragment>
    );
  };

  return user ? (
    <Card style={styles.card}>
      <Card.Content>
        {/* Sign Out Button */}
        <View style={styles.signOutButtonContainer}>
          <Button
            onPress={confirmSignOut}
            style={styles.signOutButton}
            labelStyle={styles.signOutButtonText}
          >
            Sign Out
          </Button>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Next Class</Text>

          {/* Circular Timer */}
          <AnimatedCircularProgress
            size={70}
            width={7}
            fill={progress}
            tintColor="#D84343"
            backgroundColor="#555"
          >
            {() => (
              <View style={styles.timer}>
                <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
              </View>
            )}
          </AnimatedCircularProgress>
        </View>

        {/* Dropdown Menu */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Button
              onPress={openMenu}
              style={styles.menuButton}
              labelStyle={styles.menuText}
            >
              {selectedCalendarName} <Text>{''}</Text>
              <FontAwesome name="caret-down" size={14} color="#C0C0C0" />
            </Button>
          }
        >
          {renderMenuItems()}
        </Menu>

        {/* Event Details */}
        {renderEventDetails()}
      </Card.Content>

      <Card.Actions>
        <Button
          mode="contained"
          buttonColor="#D84343"
          textColor="white"
          style={styles.button}
        >
          Get Directions
        </Button>
      </Card.Actions>
    </Card>
  ) : (
    <Card style={styles.card}>
      <Card.Content style={styles.centeredContent}>
        <Button
          mode="contained"
          style={styles.signInButton}
          labelStyle={styles.signInText}
          onPress={() => promptAsync()}
          testID="google-sign-in"
          accessibilityLabel="google-sign-in"
        >
          <FontAwesome
            name="google"
            size={20}
            color="white"
            style={styles.googleIcon}
          />
          <Text style={styles.signInText}> Sign in with Google</Text>
        </Button>
      </Card.Content>
    </Card>
  );
};

export default NextClassCard;
