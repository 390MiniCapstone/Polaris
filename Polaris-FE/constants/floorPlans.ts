import H8 from '../assets/images/h8.svg';
import H9 from '../assets/images/h9.svg';

export type FloorPlanObject = {
  SvgComponent: React.FC<any>;
  name: string;
  width: string;
  height: string;
};

export const FLOOR_PLANS = {
  H8_FLOOR_PLAN: {
    SvgComponent: H8,
    name: 'Hall 8',
    width: '1000',
    height: '1000',
  },
  H9_FLOOR_PLAN: {
    SvgComponent: H9,
    name: 'Hall 9',
    width: '1000',
    height: '1000',
  },
};
