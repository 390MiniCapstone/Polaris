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
import { NodeNav } from '@/app/NodeNav';

export type FloorPlanBuilding = {
  building: FloorPlanObject[];
};

export type Edge = {
  from: string;
  to: string;
};

export type FloorPlanObject = {
  SvgComponent: React.FC<any>;
  name: string;
  width: string;
  height: string;
  nodes: NodeNav[];
  edges: Edge[];
};

export const FLOOR_PLANS: Record<string, FloorPlanObject[]> = {
  'Hall Building': [
    {
      SvgComponent: H1,
      name: 'Hall 1',
      width: '2643',
      height: '2823',
      nodes: [
        new NodeNav('H0', 0.24, 0.84, 'hallway'),
        new NodeNav('H1', 0.24, 0.9, 'hallway'),
        new NodeNav('H2', 0.32, 0.9, 'hallway'),
        new NodeNav('H3', 0.41, 0.9, 'hallway'),
        new NodeNav('H4', 0.5, 0.9, 'hallway'),
        new NodeNav('H5', 0.54, 0.9, 'hallway'),
        new NodeNav('H6', 0.6, 0.9, 'hallway'),
        new NodeNav('H7', 0.69, 0.9, 'hallway'),
        new NodeNav('H8', 0.78, 0.9, 'hallway'),
        new NodeNav('H9', 0.82, 0.9, 'hallway'),
        new NodeNav('H10', 0.82, 0.85, 'hallway'),
        new NodeNav('H11', 0.83, 0.78, 'hallway'),
        new NodeNav('H12', 0.82, 0.71, 'hallway'),
        new NodeNav('H13', 0.74, 0.71, 'hallway'),
        new NodeNav('H14', 0.68, 0.72, 'hallway'),
        new NodeNav('H15', 0.6, 0.71, 'hallway'),
        new NodeNav('H16', 0.53, 0.71, 'hallway'),
        new NodeNav('H17', 0.53, 0.79, 'hallway'),
        new NodeNav('H18', 0.53, 0.86, 'hallway'),
        new NodeNav('H19', 0.53, 0.66, 'hallway'),
        new NodeNav('H20', 0.81, 0.94, 'hallway'),
        new NodeNav('EN1', 0.79, 0.95, 'hallway'),
        new NodeNav('EN2', 0.9, 0.88, 'hallway'),
        new NodeNav('EN3', 0.59, 0.87, 'hallway'),
        new NodeNav('EN4', 0.32, 0.94, 'hallway'),
        new NodeNav('C1', 0.24, 0.79, 'hallway'),
      ],
      edges: [
        { from: 'H0', to: 'H1' },
        { from: 'H1', to: 'H2' },
        { from: 'H2', to: 'H3' },
        { from: 'H3', to: 'H4' },
        { from: 'H4', to: 'H5' },
        { from: 'H5', to: 'H6' },
        { from: 'H6', to: 'H7' },
        { from: 'H7', to: 'H8' },
        { from: 'H8', to: 'H9' },
        { from: 'H9', to: 'H10' },
        { from: 'H10', to: 'H11' },
        { from: 'H11', to: 'H12' },
        { from: 'H12', to: 'H13' },
        { from: 'H13', to: 'H14' },
        { from: 'H14', to: 'H15' },
        { from: 'H15', to: 'H16' },
        { from: 'H16', to: 'H17' },
        { from: 'H17', to: 'H18' },
        { from: 'H16', to: 'H19' },
        { from: 'H5', to: 'H18' },
        { from: 'H9', to: 'H20' },
        { from: 'EN1', to: 'H20' },
        { from: 'EN2', to: 'H9' },
        { from: 'EN4', to: 'H2' },
        { from: 'C1', to: 'H0' },
      ],
    },
    {
      SvgComponent: H2,
      name: 'Hall 2',
      width: '2400',
      height: '1800',
      nodes: [],
      edges: [],
    },
    {
      SvgComponent: H8,
      name: 'Hall 8',
      width: '1000',
      height: '1000',
    },
    {
      SvgComponent: H9,
      name: 'Hall 9',
      width: '1000',
      height: '1000',
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
      width: '1000',
      height: '1000',
    },
    {
      SvgComponent: VL2,
      name: 'VL 2',
      width: '1000',
      height: '1000',
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
