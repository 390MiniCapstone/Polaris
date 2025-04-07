import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NextClassCard from '@/components/NextClassComponent/NextClassCard';
import { useGoogleAuth } from '@/contexts/AuthContext/AuthContext';
import { useGoogleNextEvent } from '@/hooks/useGoogleNextEvent';

jest.mock('@/contexts/AuthContext/AuthContext');
jest.mock('@/hooks/useGoogleNextEvent');

const mockAuth = useGoogleAuth as jest.Mock;
const mockNextEvent = useGoogleNextEvent as jest.Mock;

const queryClient = new QueryClient();

const renderWithQueryProvider = (ui: React.ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

describe('NextClassCard Component', () => {
  beforeEach(() => {
    mockAuth.mockReturnValue({
      user: { name: 'Test User' },
      promptAsync: jest.fn(),
      logout: jest.fn(),
    });

    mockNextEvent.mockReturnValue({ data: null });
  });

  it('renders correctly when user is signed in', () => {
    renderWithQueryProvider(<NextClassCard />);
    expect(screen.getByText('Next Class')).toBeTruthy();
  });

  it('displays "No Future Events Found" when no upcoming events', () => {
    mockNextEvent.mockReturnValue({ data: null });

    renderWithQueryProvider(<NextClassCard />);
    expect(screen.getByText('🚀 No Future Events Found')).toBeTruthy();
  });

  it('renders the sign out button when user is signed in', () => {
    renderWithQueryProvider(<NextClassCard />);
    expect(screen.getByText('Sign Out')).toBeTruthy();
  });

  it('calls logout when the sign out button is pressed', () => {
    const mockLogout = jest.fn();
    mockAuth.mockReturnValue({
      user: { name: 'Test User' },
      promptAsync: jest.fn(),
      logout: mockLogout,
    });

    jest.spyOn(Alert, 'alert').mockImplementation((title, message, buttons) => {
      const signOutButton = buttons?.find(button => button.text === 'Sign Out');
      if (signOutButton && signOutButton.onPress) {
        signOutButton.onPress();
      }
    });

    renderWithQueryProvider(<NextClassCard />);
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.press(signOutButton);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('does not render the sign out button when user is not signed in', () => {
    mockAuth.mockReturnValue({
      user: null,
      promptAsync: jest.fn(),
      logout: jest.fn(),
    });

    renderWithQueryProvider(<NextClassCard />);
    expect(screen.queryByText('Sign Out')).toBeNull();
  });

  it('displays event details when there is an upcoming event', () => {
    mockNextEvent.mockReturnValue({
      data: {
        summary: 'Team Meeting',
        location: 'Conference Room',
        start: { dateTime: '2025-04-01T10:00:00Z' },
        end: { dateTime: '2025-04-01T11:00:00Z' },
      },
    });

    renderWithQueryProvider(<NextClassCard />);
    expect(screen.getByText('Team Meeting')).toBeTruthy();
    expect(screen.getByText('Conference Room')).toBeTruthy();
  });

  it('formats the timer correctly', () => {
    mockNextEvent.mockReturnValue({
      data: {
        summary: 'Team Meeting',
        start: { dateTime: '2025-04-01T10:00:00Z' },
      },
    });

    renderWithQueryProvider(<NextClassCard />);
    const timerText = screen.getByText(/h \d+m/); // Matches "xh ym" format
    expect(timerText).toBeTruthy();
  });
});
