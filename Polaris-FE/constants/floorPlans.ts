import H1 from '../assets/images/h1.svg';
import H2 from '../assets/images/h2.svg';
import H8 from '../assets/images/h8.svg';
import H9 from '../assets/images/h9.svg';
import MB1 from '../assets/images/MB1.svg';
import MBS2 from '../assets/images/MBS2.svg';
import VE1 from '../assets/images/VE1.svg';
import VE2 from '../assets/images/VE2.svg';
import VL1 from '../assets/images/VL1.svg';
import VL2 from '../assets/images/VL2.svg';
import CC1 from '../assets/images/CC1.svg';

export type FloorPlanBuilding = {
  building: FloorPlanObject[];
};

export type FloorPlanObject = {
  SvgComponent: React.FC<any>;
  name: string;
  width: string;
  height: string;
};

export const FLOOR_PLANS: Record<string, FloorPlanObject[]> = {
  'Hall Building': [
    {
      SvgComponent: H1,
      name: 'Hall 1',
      width: '4131',
      height: '4413',
    },
    {
      SvgComponent: H2,
      name: 'Hall 2',
      width: '3681',
      height: '4069',
    },
    {
      SvgComponent: H8,
      name: 'Hall 8',
      width: '1024',
      height: '1024',
    },
    {
      SvgComponent: H9,
      name: 'Hall 9',
      width: '1024',
      height: '1024',
    },
  ],
  'MB Building': [
    {
      SvgComponent: MB1,
      name: 'MB 1',
      width: '1250',
      height: '1200',
    },
    {
      SvgComponent: MBS2,
      name: 'MB S2',
      width: '1000',
      height: '1300',
    },
  ],
  'VE Building': [
    {
      SvgComponent: VE1,
      name: 'VE 1',
      width: '1450',
      height: '700',
    },
    {
      SvgComponent: VE2,
      name: 'VE 2',
      width: '1000',
      height: '700',
    },
  ],
  'VL Building': [
    {
      SvgComponent: VL1,
      name: 'VL 1',
      width: '1024',
      height: '1024',
    },
    {
      SvgComponent: VL2,
      name: 'VL 2',
      width: '1024',
      height: '1024',
    },
  ],
  'CC Building': [
    {
      SvgComponent: CC1,
      name: 'CC 1',
      width: '4900',
      height: '2000',
    },
  ],
};
