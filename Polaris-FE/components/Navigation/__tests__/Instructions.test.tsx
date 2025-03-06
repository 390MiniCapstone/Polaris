import React from 'react';
import { render } from '@testing-library/react-native';
import { Instructions } from '@/components/Navigation/Instructions';

jest.mock('@/contexts/NavigationContext/NavigationContext', () => ({
  useNavigation: () => ({
    nextInstruction: 'Turn right in 100 meters',
  }),
}));

describe('Instructions Component', () => {
  it('renders the next instruction from the navigation context', () => {
    const { getByText } = render(<Instructions />);
    expect(getByText('Turn right in 100 meters')).toBeTruthy();
  });
});
