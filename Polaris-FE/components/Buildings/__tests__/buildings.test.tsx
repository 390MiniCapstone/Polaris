import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Buildings } from '../Buildings';
import { Building } from '@/constants/buildingInfo';
import { BuildingProvider } from '../../../contexts/BuildingContext/BuildingContext';

jest.mock('@/constants/buildingInfo', () => ({
  BUILDING_INFO: [
    {
      Building: 'B1',
      Latitude: '11',
      Longitude: '11',
      Building_Name: 'Building A',
      Building_Long_Name: 'Building A Long Name',
      Address: '123',
    },
    {
      Building: 'B2',
      Latitude: '22',
      Longitude: '22',
      Building_Name: 'Building B',
      Building_Long_Name: 'Building B Long Name',
      Address: '456',
    },
    {
      Building: 'B3',
      Latitude: '33',
      Longitude: '33',
      Building_Name: 'Building C',
      Building_Long_Name: 'Building C Long Name',
      Address: '789',
    },
  ] as Building[],
}));

describe('Testing the buildings Component', () => {
  it('Three building markers should render on screen', () => {
    render(
      <BuildingProvider>
        <Buildings />
      </BuildingProvider>
    );

    const markers = screen.queryAllByTestId('concordia-building');
    expect(markers.length).toBe(3);
  });
});
