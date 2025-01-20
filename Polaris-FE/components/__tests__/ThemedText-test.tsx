import * as React from 'react';
import { render } from '@testing-library/react-native';
import { ThemedText } from '../ThemedText';

// A snapshot captures the rendered state of a component's native elements  at a specific point in time.
//  This allows us to compare future renders to detect unintended UI changes.
it(`renders correctly`, () => {
  const view = render(<ThemedText>Snapshot test!</ThemedText>);

  expect(view).toMatchSnapshot();
});
