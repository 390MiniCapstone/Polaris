import { createContext, useContext, useState } from 'react';

export interface BuildingContextType {
  indoorBuilding: string | null;
  setIndoorBuilding: React.Dispatch<React.SetStateAction<string | null>>;
}

export const BuildingContext = createContext<BuildingContextType | undefined>(
  undefined
);

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
  const [indoorBuilding, setIndoorBuilding] = useState<string | null>(null);

  return (
    <BuildingContext.Provider value={{ indoorBuilding, setIndoorBuilding }}>
      {children}
    </BuildingContext.Provider>
  );
};
