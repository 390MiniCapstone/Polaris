import { useEffect, useState } from 'react';
import { useMapLocation } from './useMapLocation';
import { downtownBuildings, loyolaBuildings } from '../constants/buildings';

const isPointInPolygon = (point: [number, number], polygon: number[][]) => {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const findCurrentBuilding = (latitude: number, longitude: number) => {
  const allBuildings = [
    ...downtownBuildings.features,
    ...loyolaBuildings.features,
  ];
  return allBuildings.find(building => {
    const coordinates = building.geometry.coordinates[0];
    return isPointInPolygon([longitude, latitude], coordinates);
  });
};

export const useCurrentBuilding = () => {
  const { location } = useMapLocation();
  interface Building {
    geometry: {
      coordinates: number[][][];
    };
  }

  const [currentBuilding, setCurrentBuilding] = useState<Building | null>(null);

  useEffect(() => {
    if (location) {
      const building = findCurrentBuilding(
        location.latitude,
        location.longitude
      );
      setCurrentBuilding(building || null);
    }
  }, [location]);

  return currentBuilding;
};
