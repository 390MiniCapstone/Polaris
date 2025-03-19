import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
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
});
