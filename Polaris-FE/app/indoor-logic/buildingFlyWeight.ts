import { FLOOR_PLANS } from '@/constants/floorPlans';
import { Building } from './building';

/**
 * Building fly weight factory will take care of reviewing repeated elements that were already computed.
 */
export class BuildingFlyWeight {
  private static buildings: Map<string, Building>;

  static getBuilding(name: string) {
    if (!(name in FLOOR_PLANS)) {
      throw new Error('Building not in Floor plans');
    }
    let building = this.buildings.get(name);
    if (building) {
      return building;
    }
    // building not found, then create it and add it to flyweight
    building = new Building(name, FLOOR_PLANS[name]);
    // add to flyweight for caching
    this.buildings.set(name, building);
    return building;
  }
}
