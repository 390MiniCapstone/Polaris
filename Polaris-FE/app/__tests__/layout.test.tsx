import { render, screen } from '@testing-library/react-native';
import RootLayout from '../_layout';

it('Testing the native elements of initial application layout - tabs', () => {
  // Step 1: Render the component being tested
  render(<RootLayout />);

  //Step2 : Query a react native element - Here "root-container-view" is a view element located in RootLayout from '../_layout'
  // This component was given the following attribute: testID='root-container-view' (Can be verified inside the RootLayout component)
  // The line below scans the rendered component and queries the element that has attribute testID='root-container-view' and saves in element variable
  const element: unknown = screen.getByTestId('root-container-view');

  //Step3: Assertion
  // Here we test that the queried element has a certain value
  if (typeof element === 'object' && element !== null && 'props' in element) {
    expect(element).toHaveTextContent('Hello from RootLayout');
  }
  //Extra/Debug: It is possible to display what is rendered on screen by uncommenting the line below:
  //   screen.debug();
});
