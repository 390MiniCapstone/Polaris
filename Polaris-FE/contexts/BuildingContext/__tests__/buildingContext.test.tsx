import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import {
  BuildingProvider,
  useBuildingContext,
} from '@/contexts/BuildingContext/BuildingContext';
import { Text } from 'react-native';

const TestComponent = () => {
  const { indoorBuilding, setIndoorBuilding } = useBuildingContext();

  return (
    <>
      <Text testID="building-value">{indoorBuilding}</Text>
      <Text
        testID="update-building"
        onPress={() => setIndoorBuilding('New Building')}
      >
        Update Building
      </Text>
    </>
  );
};

describe('BuildingContext', () => {
  it('provides the default indoorBuilding value', () => {
    render(
      <BuildingProvider>
        <TestComponent />
      </BuildingProvider>
    );

    const buildingValue = screen.getByTestId('building-value');
    expect(buildingValue.props.children).toBe('');
  });

  it('updates indoorBuilding when setIndoorBuilding is called', async () => {
    render(
      <BuildingProvider>
        <TestComponent />
      </BuildingProvider>
    );

    const buildingValue = screen.getByTestId('building-value');
    const updateButton = screen.getByTestId('update-building');

    fireEvent.press(updateButton);

    await waitFor(() => {
      expect(buildingValue.props.children).toBe('New Building');
    });
  });

  it('throws an error when setIndoorBuilding is called outside of BuildingProvider', () => {
    const BrokenComponent = () => {
      const { setIndoorBuilding } = useBuildingContext();
      setIndoorBuilding('Test Building');
      return <Text>Broken</Text>;
    };

    expect(() => {
      render(<BrokenComponent />);
    }).toThrow('setIndoorBuilding was called outside of BuildingProvider');
  });
});
