import React from 'react';
import { TravelModeToggle } from '@/components/Navigation/TravelModeToggle';
import { Instructions } from './Instructions';
import { NavigationInfo } from '@/components/Navigation/NavigationInfo';
import { useNavigation } from '@/contexts/NavigationContext/NavigationContext';

export const Navigation: React.FC = () => {
  const { navigationState, routeData } = useNavigation();

  return (
    <React.Fragment>
      {navigationState === 'planning' && <TravelModeToggle />}

      {navigationState === 'navigating' && <Instructions />}

      {(navigationState === 'planning' || navigationState === 'navigating') &&
        routeData && <NavigationInfo />}
    </React.Fragment>
  );
};
