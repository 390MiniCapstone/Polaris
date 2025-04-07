import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Buildings } from '../Buildings';
import { BuildingProvider } from '@/contexts/BuildingContext/BuildingContext';

jest.mock('@/constants/buildings', () => ({
  campusBuildings: {
    features: [
      {
        type: 'Feature',
        properties: {
          building: 'B1',
          name: 'Building A',
          shortName: 'BldgA',
          address: '123',
          campus: 'Campus A',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          building: 'B2',
          name: 'Building B',
          shortName: 'BldgB',
          address: '456',
          campus: 'Campus B',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          building: 'B3',
          name: 'Building C',
          shortName: 'BldgC',
          address: '789',
          campus: 'Campus C',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [0, 0],
              [0, 1],
              [1, 1],
              [1, 0],
              [0, 0],
            ],
          ],
        },
      },
    ],
  },
}));

describe('Testing the Buildings Component', () => {
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
