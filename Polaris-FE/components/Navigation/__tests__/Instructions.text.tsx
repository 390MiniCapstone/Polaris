import React from 'react';
import { render } from '@testing-library/react-native';
import { Instructions } from '@/components/Navigation/Instructions';

describe('Instructions component', () => {
  it('renders the instruction text correctly', () => {
    const testInstruction = 'Turn left in 100 meters';
    const { getByText } = render(
      <Instructions instruction={testInstruction} />
    );

    expect(getByText(testInstruction)).toBeTruthy();
  });

  it('matches the snapshot', () => {
    const testInstruction = 'Turn right in 50 meters';
    const { toJSON } = render(<Instructions instruction={testInstruction} />);

    expect(toJSON()).toMatchSnapshot();
  });
});
