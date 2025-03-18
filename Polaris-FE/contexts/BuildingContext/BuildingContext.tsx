import { createContext, useContext, useState } from 'react';

const EMPTY_STRING: string = '';

export interface BuildingContextType {
  indoorBuilding: string;
  setIndoorBuilding: React.Dispatch<React.SetStateAction<string>>;
}

export const BuildingContext = createContext<BuildingContextType>({
  indoorBuilding: EMPTY_STRING,
  setIndoorBuilding: () => {
    throw new Error('setIndoorBuilding was called outside of BuildingProvider');
  },
});

export const useBuildingContext = () => {
  const context = useContext(BuildingContext);
  if (!context) {
    throw new Error(
      'useBuildingContext must be used within a BuildingProvider'
    );
  }
  return context;
};

export const BuildingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [indoorBuilding, setIndoorBuilding] = useState<string>(EMPTY_STRING);

  return (
    <BuildingContext.Provider value={{ indoorBuilding, setIndoorBuilding }}>
      {children}
    </BuildingContext.Provider>
  );
};
