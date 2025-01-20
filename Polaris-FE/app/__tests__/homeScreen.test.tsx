import { fireEvent, render, screen } from '@testing-library/react-native';
import HomeScreen from '../(tabs)';

it('Testing the increment button of the homescreen component', () => {
  // 1 - Render
  render(<HomeScreen />);

  const titleElement = screen.getByTestId('homescreen-title-value');

  // 3 - assert the initial value
  expect(titleElement).toHaveTextContent('0');

  // 4 - query the button element
  const buttonElement = screen.getByTestId('homescreen-title-button');

  //5 -Simulate user behaviour:
  // It is also possible to simulate user behaviour using fireEvent
  // Here a button click is simulating expecting the component to increment "val" and display "1" in the native text component
  fireEvent.press(buttonElement);

  //6 - assert the value after 1 simulated click
  expect(titleElement).toHaveTextContent('1');
});
