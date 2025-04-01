import { FloorPlanObject, FLOOR_PLANS } from '@/constants/floorPlans';

export const handleFloorChange = (
  itemValue: string,
  indoorBuilding: string | null,
  selectFloor: (floorPlan: FloorPlanObject) => void
) => {
  if (!indoorBuilding) return;

  const selected = FLOOR_PLANS[indoorBuilding]?.find(
    (floor: FloorPlanObject) => floor.name === itemValue
  );

  if (selected) selectFloor(selected);
};
