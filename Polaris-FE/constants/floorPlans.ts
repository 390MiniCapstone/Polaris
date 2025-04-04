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

export type EdgeType = 'stairs' | 'elevator' | 'hallway' | 'escalator';

/**
 * An edge will be defined as ID_1, ID_2, EdgeType
 * The order of the node IDs don't matter. Whichever order you put it will not affect the graph topology.
 */
export type FloorPlanEdge = [string, string, EdgeType];

export type FloorPlanObject = {
  SvgComponent: React.FC<any>;
  name: string;
  width: string;
  height: string;
  nodes: NodeNav[];
  edges: FloorPlanEdge[];
};

export const FLOOR_PLANS: Record<string, FloorPlanObject[]> = {
  'Hall Building': [
    {
      SvgComponent: H1,
      name: 'Hall 1',
      width: '2643',
      height: '2823',
      nodes: [
        //hallways
        new NodeNav('0', 0.99, 0.89, 'hallway'),
        new NodeNav('1', 0.81, 0.89, 'hallway'),
        new NodeNav('2', 0.8, 0.82, 'hallway'),
        new NodeNav('3', 0.81, 0.72, 'hallway'),
        new NodeNav('4', 0.84, 0.71, 'hallway'),
        new NodeNav('5', 0.91, 0.72, 'hallway'),
        new NodeNav('6', 0.98, 0.62, 'hallway'),
        new NodeNav('7', 0.84, 0.69, 'hallway'),
        new NodeNav('8', 0.79, 0.69, 'hallway'),
        new NodeNav('9', 0.79, 0.66, 'hallway'),
        new NodeNav('10', 0.77, 0.66, 'hallway'),
        new NodeNav('11', 0.7, 0.66, 'hallway'),
        new NodeNav('12', 0.67, 0.64, 'hallway'),
        new NodeNav('13', 0.64, 0.64, 'hallway'),
        new NodeNav('14', 0.62, 0.68, 'hallway'),
        new NodeNav('15', 0.61, 0.71, 'hallway'),
        new NodeNav('16', 0.54, 0.71, 'hallway'),
        new NodeNav('17', 0.54, 0.66, 'hallway'),
        new NodeNav('18', 0.54, 0.63, 'hallway'),
        new NodeNav('19', 0.52, 0.63, 'hallway'),
        new NodeNav('20', 0.49, 0.63, 'hallway'),
        new NodeNav('21', 0.49, 0.66, 'hallway'),
        new NodeNav('22', 0.52, 0.49, 'hallway'),
        new NodeNav('23', 0.54, 0.85, 'hallway'),
        new NodeNav('24', 0.38, 0.85, 'hallway'),
        new NodeNav('25', 0.25, 0.86, 'hallway'),
        new NodeNav('26', 0.25, 0.81, 'hallway'),
        new NodeNav('27', 0.19, 0.86, 'hallway'),
        new NodeNav('28', 0.11, 0.86, 'hallway'),
        new NodeNav('29', 0.11, 0.78, 'hallway'),
        new NodeNav('30', 0.07, 0.76, 'hallway'),
        new NodeNav('31', 0.08, 0.72, 'hallway'),
        new NodeNav('32', 0.1, 0.69, 'hallway'),
        new NodeNav('33', 0.07, 0.51, 'hallway'),
        new NodeNav('34', 0.19, 0.67, 'hallway'),
        new NodeNav('35', 0.27, 0.68, 'hallway'),
        new NodeNav('36', 0.34, 0.99, 'hallway'),
        new NodeNav('37', 0.75, 0.94, 'escalator'),
        new NodeNav('38', 0.71, 0.89, 'hallway'),
        new NodeNav('39', 0.61, 0.89, 'hallway'),
        new NodeNav('40', 0.73, 0.71, 'hallway'),
        new NodeNav('41', 0.66, 0.71, 'elevator'),
        new NodeNav('42', 0.73, 0.75, 'hallway'),
        new NodeNav('43', 0.77, 0.75, 'hallway'),

        //rooms
        new NodeNav('102-91', 0.61, 0.85, 'escalator'),
        new NodeNav('102-90', 0.8, 0.94, 'room'),
        new NodeNav('101', 0.94, 0.87, 'room'),
        new NodeNav('102-2', 0.92, 0.77, 'room'),
        new NodeNav('102-3', 0.77, 0.79, 'room'),
        new NodeNav('198-1', 0.94, 0.72, 'room'),
        new NodeNav('198', 0.93, 0.63, 'room'),
        new NodeNav('118-5', 0.84, 0.66, 'room'),
        new NodeNav('118-4', 0.84, 0.62, 'room'),
        new NodeNav('118-3', 0.77, 0.62, 'room'),
        new NodeNav('118', 0.74, 0.66, 'room'),
        new NodeNav('118-2', 0.74, 0.62, 'room'),
        new NodeNav('118-14', 0.69, 0.62, 'room'),
        new NodeNav('118-1', 0.67, 0.66, 'room'),
        new NodeNav('118-13', 0.67, 0.62, 'room'),
        new NodeNav('118-12', 0.61, 0.64, 'room'),
        new NodeNav('118-11', 0.64, 0.67, 'room'),
        new NodeNav('115', 0.58, 0.53, 'room'),
        new NodeNav('116-4', 0.58, 0.66, 'room'),
        new NodeNav('116-1', 0.6, 0.67, 'room'),
        new NodeNav('196-1', 0.58, 0.74, 'room'),
        new NodeNav('196', 0.61, 0.75, 'room'),
        new NodeNav('196-2', 0.59, 0.77, 'room'),
        new NodeNav('112', 0.45, 0.64, 'washroom'),
        new NodeNav('114', 0.48, 0.54, 'washroom'),
        new NodeNav('199-40', 0.47, 0.48, 'room'),
        new NodeNav('110-6', 0.39, 0.49, 'room'),
        new NodeNav('110', 0.27, 0.52, 'room'),
        new NodeNav('110-7', 0.16, 0.48, 'room'),
        new NodeNav('190', 0.07, 0.49, 'room'),
        new NodeNav('109-1', 0.07, 0.54, 'room'),
        new NodeNav('109-2', 0.11, 0.53, 'room'),
        new NodeNav('109', 0.1, 0.61, 'room'),
        new NodeNav('110-12', 0.14, 0.7, 'room'),
        new NodeNav('110-8', 0.19, 0.74, 'room'),
        new NodeNav('110-2', 0.19, 0.76, 'washroom'),
        new NodeNav('110-3', 0.24, 0.76, 'room'),
        new NodeNav('110-1', 0.27, 0.7, 'room'),
        new NodeNav('110-9', 0.36, 0.73, 'room'),
        new NodeNav('110-5', 0.41, 0.71, 'room'),
        new NodeNav('110-4', 0.36, 0.76, 'room'),
        new NodeNav('102', 0.33, 0.85, 'room'),
        new NodeNav('103', 0.34, 0.97, 'room'),
      ],
      edges: [
        ['0', '101', 'hallway'], // entrance
        ['101', '1', 'hallway'],
        ['1', '102-90', 'escalator'],
        ['102-90', '37', 'hallway'],
        ['1', '2', 'hallway'],
        ['2', '102-2', 'hallway'],
        ['2', '3', 'hallway'],
        ['3', '4', 'hallway'],
        ['4', '5', 'hallway'],
        ['5', '198-1', 'hallway'], //room
        ['3', '40', 'hallway'],
        ['40', '42', 'hallway'],
        ['42', '43', 'hallway'],
        ['2', '102-2', 'hallway'],
        ['43', '102-3', 'elevator'],
        ['39', '38', 'hallway'],
        ['38', '1', 'hallway'],
        ['39', '102-91', 'escalator'],
        ['4', '102-2', 'hallway'], //room
        ['5', '198', 'stairs'],
        ['5', '198-1', 'hallway'],
        ['6', '198', 'hallway'], // entrance
        ['118-5', '118-4', 'hallway'], //room
        ['4', '7', 'hallway'],
        ['7', '8', 'hallway'],
        ['8', '9', 'hallway'],
        ['9', '118-5', 'hallway'], //room
        ['10', '118-3', 'hallway'], //room
        ['9', '10', 'hallway'],
        ['10', '118', 'hallway'], //room
        ['118', '118-2', 'hallway'], //room
        ['118', '11', 'hallway'],
        ['11', '118-14', 'hallway'], //room
        ['11', '118-1', 'hallway'], //room
        ['118-1', '12', 'hallway'],
        ['12', '118-13', 'hallway'], //room
        ['12', '13', 'hallway'],
        ['13', '118-12', 'hallway'], //room
        ['13', '118-11', 'hallway'], //room
        ['14', '15', 'hallway'],
        ['14', '116-1', 'hallway'], //room
        ['116-4', '115', 'hallway'], //room
        ['15', '196', 'hallway'], //room
        ['196', '196-1', 'hallway'], //room
        ['196', '196-2', 'hallway'], //room
        ['15', '16', 'hallway'],
        ['16', '17', 'hallway'],
        ['17', '18', 'hallway'],
        ['18', '19', 'hallway'],
        ['19', '20', 'hallway'],
        ['20', '114', 'hallway'], //washroom
        ['17', '21', 'hallway'], //washroom
        ['21', '112', 'hallway'], //washroom
        ['19', '22', 'hallway'],
        ['22', '199-40', 'hallway'], //room
        ['199-40', '110-6', 'hallway'], //room
        ['23', '24', 'hallway'],
        ['24', '110-4', 'hallway'], //room
        ['110-4', '110-5', 'hallway'], //room
        ['110-4', '110-9', 'hallway'], //room
        ['24', '102', 'hallway'], //room
        ['102', '25', 'hallway'],
        ['102', '103', 'hallway'], //room
        ['36', '103', 'hallway'], //room
        ['25', '26', 'hallway'],
        ['26', '110-3', 'hallway'], //room
        ['25', '27', 'hallway'],
        ['27', '28', 'hallway'],
        ['28', '29', 'hallway'],
        ['29', '30', 'hallway'],
        ['30', '31', 'hallway'],
        ['31', '32', 'hallway'],
        ['32', '109', 'hallway'], //room
        ['109', '109-1', 'hallway'], //room
        ['109-1', '109-2', 'hallway'], //room
        ['109-1', '33', 'hallway'],
        ['33', '190', 'hallway'], //room
        ['190', '110-7', 'hallway'], //room
        ['110-7', '110', 'hallway'], //room
        ['110', '110-6', 'hallway'], //room
        ['27', '110-2', 'hallway'], //room
        ['110-2', '110-12', 'hallway'], //room
        ['110-2', '110-8', 'stairs'],
        ['110-2', '34', 'hallway'],
        ['34', '35', 'hallway'],
        ['35', '110-1', 'hallway'], //room
      ],
    },
    {
      SvgComponent: H2,
      name: 'Hall 2',
      width: '2400',
      height: '1800',
      nodes: [
        new NodeNav('H0', 0.27, 0.21, 'hallway'),
        new NodeNav('H1', 0.27, 0.27, 'hallway'),
        new NodeNav('H2', 0.27, 0.3, 'hallway'),
        new NodeNav('H3', 0.31, 0.3, 'hallway'),
        new NodeNav('H4', 0.31, 0.26, 'hallway'),
        new NodeNav('H5', 0.34, 0.29, 'hallway'),
        new NodeNav('H6', 0.35, 0.26, 'hallway'),
        new NodeNav('H7', 0.38, 0.3, 'hallway'),
        new NodeNav('H8', 0.44, 0.29, 'hallway'),
        new NodeNav('H9', 0.51, 0.29, 'hallway'),
        new NodeNav('H10', 0.52, 0.35, 'hallway'),
        new NodeNav('H11', 0.55, 0.35, 'hallway'),
        new NodeNav('224-1', 0.55, 0.33, 'room'),
        new NodeNav('H13', 0.51, 0.43, 'hallway'),
        new NodeNav('H14', 0.54, 0.43, 'hallway'),
        new NodeNav('224', 0.56, 0.44, 'hallway'),
        new NodeNav('H16', 0.51, 0.53, 'hallway'),
        new NodeNav('H17', 0.62, 0.55, 'hallway'),
        new NodeNav('H18', 0.73, 0.56, 'hallway'),
        new NodeNav('H19', 0.75, 0.56, 'hallway'),
        new NodeNav('H20', 0.77, 0.56, 'hallway'),
        new NodeNav('H21', 0.82, 0.56, 'hallway'),
        new NodeNav('H22', 0.85, 0.56, 'hallway'),
        new NodeNav('H23', 0.85, 0.52, 'hallway'),
        new NodeNav('H24', 0.88, 0.56, 'hallway'),
        new NodeNav('225', 0.91, 0.56, 'room'),
        new NodeNav('H26', 0.93, 0.56, 'hallway'),
        new NodeNav('H27', 0.97, 0.56, 'hallway'),
        new NodeNav('H28', 0.99, 0.56, 'hallway'),
        new NodeNav('H29', 0.85, 0.6, 'hallway'),
        new NodeNav('H30', 0.84, 0.62, 'hallway'),
        new NodeNav('H31', 0.79, 0.61, 'hallway'),
        new NodeNav('283', 0.79, 0.63, 'hallway'), // todo: this is a stairway but im leaving it as hallway for now
        new NodeNav('H33', 0.82, 0.64, 'hallway'),
        new NodeNav('290', 0.86, 0.49, 'hallway'), // todo: this is a stairway but im leaving it as hallway for now
        new NodeNav('H35', 0.88, 0.51, 'hallway'),
        new NodeNav('H36', 0.92, 0.51, 'hallway'),
        new NodeNav('H37', 0.92, 0.48, 'hallway'),
        new NodeNav('H38', 0.94, 0.48, 'hallway'),
        new NodeNav('H39', 0.94, 0.45, 'hallway'),
        new NodeNav('H40', 0.92, 0.44, 'hallway'),
        new NodeNav('290-1', 0.9, 0.46, 'room'),
        new NodeNav('H42', 0.94, 0.36, 'hallway'),
        new NodeNav('H43', 0.92, 0.38, 'hallway'),
        new NodeNav('205', 0.89, 0.4, 'room'),
        new NodeNav('H45', 0.75, 0.62, 'hallway'),
        new NodeNav('213-90', 0.75, 0.67, 'room'),
        new NodeNav('H47', 0.85, 0.67, 'hallway'),
        new NodeNav('H48', 0.88, 0.67, 'hallway'),
        new NodeNav('H49', 0.87, 0.7, 'hallway'),
        new NodeNav('231-00', 0.9, 0.71, 'room'),
        new NodeNav('H51', 0.95, 0.76, 'hallway'),
        new NodeNav('H52', 0.85, 0.7, 'hallway'),
        new NodeNav('H53', 0.75, 0.69, 'hallway'),
        new NodeNav('H54', 0.69, 0.69, 'hallway'),
        new NodeNav('H55', 0.61, 0.7, 'hallway'),
        new NodeNav('H56', 0.64, 0.72, 'hallway'),
        new NodeNav('H57', 0.7, 0.72, 'hallway'),
        new NodeNav('H58', 0.75, 0.72, 'hallway'),
        new NodeNav('H59', 0.82, 0.72, 'hallway'),
        new NodeNav('H60', 0.75, 0.79, 'hallway'),
        new NodeNav('235', 0.79, 0.79, 'room'), // todo: 235 is a stairway
        new NodeNav('H62', 0.85, 0.79, 'hallway'),
        new NodeNav('H63', 0.51, 0.61, 'hallway'),
        new NodeNav('H64', 0.45, 0.53, 'hallway'),
        new NodeNav('H65', 0.44, 0.6, 'hallway'),
        new NodeNav('H66', 0.44, 0.64, 'hallway'),
        new NodeNav('H67', 0.44, 0.68, 'hallway'),
        new NodeNav('H68', 0.44, 0.71, 'hallway'),
        new NodeNav('239-00', 0.44, 0.76, 'room'),
        new NodeNav('H70', 0.44, 0.78, 'hallway'),
        new NodeNav('H71', 0.48, 0.78, 'hallway'),
        new NodeNav('H72', 0.53, 0.78, 'hallway'),
        new NodeNav('H73', 0.57, 0.78, 'hallway'),
        new NodeNav('H74', 0.38, 0.52, 'hallway'),
        new NodeNav('H75', 0.33, 0.53, 'hallway'),
        new NodeNav('H76', 0.33, 0.55, 'hallway'),
        new NodeNav('H77', 0.19, 0.53, 'hallway'),
        new NodeNav('H78', 0.19, 0.55, 'hallway'),
        new NodeNav('222-000', 0.26, 0.56, 'room'),
        new NodeNav('222-01', 0.16, 0.56, 'room'),
        new NodeNav('H81', 0.1, 0.53, 'hallway'),
        new NodeNav('H82', 0.1, 0.55, 'hallway'),
        new NodeNav('H83', 0.12, 0.55, 'hallway'),
        new NodeNav('281', 0.13, 0.57, 'room'),
        new NodeNav('280', 0.09, 0.57, 'room'),
        new NodeNav('H86', 0.07, 0.53, 'hallway'),
        new NodeNav('H87', 0.07, 0.61, 'hallway'),
        new NodeNav('275', 0.05, 0.61, 'room'), // todo: 275 is a stairway
        new NodeNav('H89', 0.07, 0.67, 'hallway'),
        new NodeNav('H90', 0.07, 0.45, 'hallway'),
        new NodeNav('H91', 0.16, 0.46, 'hallway'),
        new NodeNav('H92', 0.18, 0.46, 'hallway'),
        new NodeNav('H93', 0.18, 0.49, 'hallway'),
        new NodeNav('H94', 0.18, 0.51, 'hallway'),
        new NodeNav('H95', 0.18, 0.44, 'hallway'),
        new NodeNav('H96', 0.16, 0.44, 'hallway'),
        new NodeNav('H97', 0.18, 0.42, 'hallway'),
        new NodeNav('H98', 0.16, 0.42, 'hallway'),
        new NodeNav('H99', 0.18, 0.4, 'hallway'),
        new NodeNav('H100', 0.16, 0.41, 'hallway'),
        new NodeNav('H101', 0.18, 0.38, 'hallway'),
        new NodeNav('H102', 0.16, 0.38, 'hallway'),
        new NodeNav('H103', 0.18, 0.37, 'hallway'),
        new NodeNav('H104', 0.16, 0.37, 'hallway'),
        new NodeNav('H105', 0.18, 0.34, 'hallway'),
        new NodeNav('H106', 0.15, 0.34, 'hallway'),
        new NodeNav('H107', 0.18, 0.28, 'hallway'),
        new NodeNav('H108', 0.15, 0.29, 'hallway'),
        new NodeNav('H109', 0.1, 0.28, 'hallway'),
        new NodeNav('H110', 0.34, 0.32, 'hallway'),
        new NodeNav('H111', 0.39, 0.32, 'hallway'),
        new NodeNav('H112', 0.34, 0.35, 'hallway'),
        new NodeNav('H113', 0.39, 0.35, 'hallway'),
        new NodeNav('H114', 0.34, 0.38, 'hallway'),
        new NodeNav('H115', 0.39, 0.38, 'hallway'),
        new NodeNav('H116', 0.34, 0.42, 'hallway'),
        new NodeNav('H117', 0.39, 0.41, 'hallway'),
        new NodeNav('H118', 0.34, 0.45, 'hallway'),
        new NodeNav('H119', 0.39, 0.45, 'hallway'),
        new NodeNav('H120', 0.34, 0.48, 'hallway'),
        new NodeNav('H121', 0.38, 0.48, 'hallway'),
        new NodeNav('H122', 0.25, 0.28, 'hallway'),
        new NodeNav('H123', 0.25, 0.29, 'hallway'),
        new NodeNav('H124', 0.25, 0.22, 'hallway'),
      ],
      edges: [
        ['H0', 'H1', 'hallway'], // ? escalator?
        ['H1', 'H2', 'hallway'],
        ['H2', 'H3', 'hallway'],
        ['H3', 'H4', 'hallway'], // ? elevator?
        ['H3', 'H5', 'hallway'],
        ['H5', 'H6', 'hallway'], // ? elevator?
        ['H5', 'H7', 'hallway'],
        ['H7', 'H8', 'hallway'],
        ['H8', 'H9', 'hallway'],
        ['H9', 'H10', 'hallway'],
        ['H10', 'H11', 'hallway'],
        ['H11', '224-1', 'hallway'], // room
        ['H10', 'H13', 'hallway'],
        ['H13', 'H14', 'hallway'],
        ['H14', '224', 'hallway'], // room
        ['H13', 'H16', 'hallway'],
        ['H16', 'H17', 'hallway'],
        ['H17', 'H18', 'hallway'],
        ['H18', 'H19', 'hallway'],
        ['H19', 'H20', 'hallway'],
        ['H20', 'H21', 'hallway'], // ? stairs?
        ['H21', 'H22', 'hallway'],
        ['H22', 'H23', 'hallway'],
        ['H23', '290', 'hallway'], // room
        ['290', 'H35', 'hallway'], // room, stairs?
        ['H35', 'H36', 'hallway'],
        ['290', 'H37', 'hallway'], // room, stairs?
        ['H37', 'H38', 'hallway'],
        ['H39', 'H40', 'hallway'],
        ['H40', '290-1', 'hallway'], // room
        ['H39', 'H42', 'hallway'],
        ['H42', 'H43', 'hallway'],
        ['H43', '205', 'hallway'], // room
        ['H22', 'H29', 'hallway'],
        ['H29', 'H30', 'hallway'],
        ['H30', 'H31', 'hallway'], // stairs?
        ['H31', '283', 'hallway'], // room
        ['283', 'H33', 'hallway'], // room, stairs?
        ['H22', 'H24', 'hallway'],
        ['H24', '225', 'hallway'], // room
        ['225', 'H26', 'hallway'], // room
        ['H26', 'H27', 'hallway'],
        ['H27', 'H28', 'hallway'], // stairs?
        ['H19', 'H45', 'hallway'],
        ['H45', '213-90', 'hallway'], // room
        ['213-90', 'H47', 'hallway'], // room
        ['H47', 'H48', 'hallway'],
        ['H48', 'H49', 'hallway'],
        ['H49', '231-00', 'hallway'], // room
        ['231-00', 'H51', 'hallway'], // room
        ['H49', 'H52', 'hallway'],
        ['H52', 'H53', 'hallway'],
        ['H53', '213-90', 'hallway'], // room
        ['H53', 'H54', 'hallway'],
        ['H54', 'H55', 'hallway'],
        ['H55', 'H56', 'hallway'],
        ['H56', 'H57', 'hallway'],
        ['H53', 'H58', 'hallway'],
        ['H58', 'H59', 'hallway'],
        ['H58', 'H60', 'hallway'],
        ['H60', '235', 'hallway'], // room
        ['235', 'H62', 'hallway'], // room, stairs?
        ['H16', 'H63', 'hallway'],
        ['H16', 'H64', 'hallway'],
        ['H64', 'H65', 'hallway'],
        ['H65', 'H66', 'hallway'],
        ['H66', 'H67', 'hallway'],
        ['H67', 'H68', 'hallway'],
        ['H68', '239-00', 'hallway'], // room
        ['239-00', 'H70', 'hallway'], // room
        ['H70', 'H71', 'hallway'],
        ['H71', 'H72', 'hallway'],
        ['H72', 'H73', 'hallway'],
        ['H64', 'H74', 'hallway'],
        ['H74', 'H75', 'hallway'],
        ['H75', 'H76', 'hallway'],
        ['H75', 'H77', 'hallway'],
        ['H77', 'H78', 'hallway'],
        ['H77', '222-01', 'hallway'], // room
        ['H78', '222-000', 'hallway'], // room
        ['H77', 'H81', 'hallway'],
        ['H81', 'H82', 'hallway'],
        ['H82', 'H83', 'hallway'],
        ['H83', '281', 'hallway'], // room
        ['H82', '280', 'hallway'], // room
        ['H81', 'H86', 'hallway'],
        ['H86', 'H87', 'hallway'],
        ['H87', '275', 'hallway'], // room?  // todo: 275 is a stairway
        ['H87', 'H89', 'hallway'],
        ['H86', 'H90', 'hallway'],
        ['H90', 'H91', 'hallway'],
        ['H91', 'H92', 'hallway'],
        ['H91', 'H96', 'hallway'],
        ['H96', 'H95', 'hallway'],
        ['H96', 'H98', 'hallway'],
        ['H98', 'H97', 'hallway'],
        ['H98', 'H100', 'hallway'],
        ['H100', 'H99', 'hallway'],
        ['H100', 'H102', 'hallway'],
        ['H102', 'H101', 'hallway'],
        ['H102', 'H104', 'hallway'],
        ['H104', 'H106', 'hallway'],
        ['H106', 'H105', 'hallway'],
        ['H106', 'H108', 'hallway'],
        ['H108', 'H109', 'hallway'],
        ['H108', 'H107', 'hallway'],
        ['H107', 'H105', 'hallway'],
        ['H105', 'H103', 'hallway'],
        ['H103', 'H101', 'hallway'],
        ['H101', 'H99', 'hallway'],
        ['H99', 'H97', 'hallway'],
        ['H97', 'H95', 'hallway'],
        ['H95', 'H92', 'hallway'],
        ['H92', 'H93', 'hallway'],
        ['H93', 'H94', 'hallway'],
        ['H94', 'H77', 'hallway'],
        ['H107', 'H122', 'hallway'],
        ['H122', 'H124', 'hallway'], // escalators?
        ['H122', 'H123', 'hallway'],
        ['H123', 'H2', 'hallway'],
        ['H5', 'H110', 'hallway'],
        ['H110', 'H111', 'hallway'],
        ['H110', 'H112', 'hallway'],
        ['H112', 'H114', 'hallway'],
        ['H114', 'H116', 'hallway'],
        ['H116', 'H118', 'hallway'],
        ['H118', 'H120', 'hallway'],
        ['H120', 'H121', 'hallway'],
        ['H121', 'H119', 'hallway'],
        ['H119', 'H117', 'hallway'],
        ['H117', 'H115', 'hallway'],
        ['H115', 'H113', 'hallway'],
        ['H113', 'H111', 'hallway'],
        ['H111', 'H7', 'hallway'],
        ['H121', 'H74', 'hallway'],
      ],
    },
    {
      SvgComponent: H8,
      name: 'Hall 8',
      width: '1000',
      height: '1000',
      nodes: [],
      edges: [],
    },
    {
      SvgComponent: H9,
      name: 'Hall 9',
      width: '1000',
      height: '1000',
      nodes: [],
      edges: [],
    },
  ],
  'MB Building': [
    {
      SvgComponent: MB1,
      name: 'MB 1',
      width: '1024',
      height: '1024',
      nodes: [
        new NodeNav('H0', 0.45, 0.12, 'hallway'),
        new NodeNav('H1', 0.46, 0.22, 'hallway'),
        new NodeNav('H2', 0.54, 0.22, 'hallway'),
        new NodeNav('H3', 0.62, 0.22, 'hallway'),
        new NodeNav('H4', 0.71, 0.25, 'hallway'),
        new NodeNav('H5', 0.46, 0.3, 'hallway'),
        new NodeNav('H6', 0.47, 0.37, 'hallway'),
        new NodeNav('H7', 0.47, 0.41, 'hallway'),
        new NodeNav('H8', 0.47, 0.49, 'hallway'),
        new NodeNav('H9', 0.47, 0.55, 'hallway'),
        new NodeNav('H10', 0.56, 0.56, 'hallway'),
        new NodeNav('H11', 0.56, 0.59, 'hallway'),
        new NodeNav('H12', 0.62, 0.58, 'hallway'),
        new NodeNav('H13', 0.66, 0.59, 'hallway'),
        new NodeNav('H14', 0.69, 0.59, 'hallway'),
        new NodeNav('H15', 0.73, 0.59, 'hallway'),
        new NodeNav('H16', 0.73, 0.63, 'hallway'),
        new NodeNav('H17', 0.56, 0.63, 'hallway'),
        new NodeNav('H18', 0.56, 0.67, 'hallway'),
        new NodeNav('H19', 0.56, 0.72, 'hallway'),
        new NodeNav('H20', 0.56, 0.79, 'hallway'),
        new NodeNav('H21', 0.56, 0.85, 'hallway'),
        new NodeNav('H22', 0.6, 0.85, 'hallway'),
        new NodeNav('H23', 0.65, 0.85, 'hallway'),
        new NodeNav('H24', 0.7, 0.85, 'hallway'),
        new NodeNav('H25', 0.7, 0.93, 'hallway'),
        new NodeNav('H26', 0.73, 0.84, 'hallway'),
        new NodeNav('H27', 0.76, 0.83, 'hallway'),
        new NodeNav('H28', 0.79, 0.83, 'hallway'),
        new NodeNav('H29', 0.82, 0.83, 'hallway'),
        new NodeNav('H30', 0.85, 0.83, 'hallway'),
        new NodeNav('R0', 0.57, 0.16, 'room'),
        new NodeNav('R1', 0.67, 0.16, 'room'),
        new NodeNav('R2', 0.75, 0.2, 'room'),
        new NodeNav('R3', 0.77, 0.25, 'room'),
        new NodeNav('R4', 0.58, 0.4, 'room'),
        new NodeNav('R5', 0.61, 0.52, 'room'),
        new NodeNav('R6', 0.73, 0.55, 'room'),
        new NodeNav('R7', 0.62, 0.55, 'room'),
        new NodeNav('R8', 0.66, 0.55, 'room'),
        new NodeNav('R9', 0.7, 0.55, 'room'),
        new NodeNav('R10', 0.76, 0.58, 'room'),
        new NodeNav('R11', 0.76, 0.53, 'room'),
        new NodeNav('R12', 0.76, 0.63, 'room'),
        new NodeNav('R13', 0.69, 0.62, 'room'),
        new NodeNav('R14', 0.66, 0.62, 'room'),
        new NodeNav('R15', 0.62, 0.62, 'room'),
        new NodeNav('R16', 0.62, 0.68, 'room'),
        new NodeNav('R17', 0.73, 0.66, 'room'),
        new NodeNav('R18', 0.61, 0.72, 'room'),
        new NodeNav('R19', 0.6, 0.81, 'room'),
        new NodeNav('R20', 0.66, 0.81, 'room'),
        new NodeNav('R21', 0.7, 0.8, 'room'),
        new NodeNav('R22', 0.74, 0.78, 'room'),
        new NodeNav('R23', 0.76, 0.8, 'room'),
        new NodeNav('R24', 0.79, 0.8, 'room'),
        new NodeNav('R25', 0.82, 0.8, 'room'),
        new NodeNav('R26', 0.86, 0.8, 'room'),
        new NodeNav('R27', 0.73, 0.87, 'room'),
        new NodeNav('R28', 0.76, 0.86, 'room'),
        new NodeNav('R29', 0.73, 0.93, 'room'),
      ],
      edges: [
        ['H0', 'H1', 'hallway'],
        ['H1', 'H2', 'hallway'],
        ['H2', 'R0', 'hallway'],
        ['H2', 'H3', 'hallway'],
        ['H3', 'R1', 'hallway'],
        ['H3', 'H4', 'hallway'],
        ['H4', 'R2', 'hallway'],
        ['H4', 'R3', 'hallway'],
        ['H1', 'H5', 'hallway'],
        ['H5', 'H6', 'hallway'],
        ['H6', 'H7', 'hallway'],
        ['H7', 'R4', 'hallway'],
        ['H7', 'H8', 'hallway'],
        ['H8', 'H9', 'hallway'],
        ['H9', 'H10', 'hallway'],
        ['H10', 'R5', 'hallway'],
        ['H10', 'H11', 'hallway'],
        ['H11', 'H12', 'hallway'],
        ['H12', 'H13', 'hallway'],
        ['H12', 'R7', 'hallway'],
        ['H12', 'R15', 'hallway'],
        ['H13', 'H14', 'hallway'],
        ['H13', 'H14', 'hallway'],
        ['H13', 'R8', 'hallway'],
        ['H13', 'R14', 'hallway'],
        ['H14', 'H15', 'hallway'],
        ['H14', 'R9', 'hallway'],
        ['H14', 'R13', 'hallway'],
        ['H15', 'R6', 'hallway'],
        ['H15', 'R10', 'hallway'],
        ['R10', 'R11', 'hallway'],
        ['H15', 'H16', 'hallway'],
        ['H16', 'R12', 'hallway'],
        ['H16', 'R17', 'hallway'],
        ['H11', 'H17', 'hallway'],
        ['H17', 'H18', 'hallway'],
        ['H18', 'R16', 'hallway'],
        ['H18', 'H19', 'hallway'],
        ['H19', 'R18', 'hallway'],
        ['H19', 'H20', 'hallway'],
        ['H20', 'H21', 'hallway'],
        ['H21', 'H22', 'hallway'],
        ['H22', 'R19', 'hallway'],
        ['H22', 'H23', 'hallway'],
        ['H23', 'R20', 'hallway'],
        ['H23', 'H24', 'hallway'],
        ['H24', 'R21', 'hallway'],
        ['H24', 'H25', 'hallway'],
        ['H24', 'H26', 'hallway'],
        ['H25', 'R29', 'hallway'],
        ['H26', 'R22', 'hallway'],
        ['H26', 'R27', 'hallway'],
        ['H26', 'H27', 'hallway'],
        ['H27', 'R23', 'hallway'],
        ['H27', 'R28', 'hallway'],
        ['H27', 'H28', 'hallway'],
        ['H28', 'R24', 'hallway'],
        ['H28', 'H29', 'hallway'],
        ['H29', 'R25', 'hallway'],
        ['H29', 'H30', 'hallway'],
        ['H30', 'R26', 'hallway'],
      ],
    },
    {
      SvgComponent: MBS2,
      name: 'MB S2',
      width: '1000',
      height: '1300',
      nodes: [],
      edges: [],
    },
  ],
  'VE Building': [
    {
      SvgComponent: VE1,
      name: 'VE 1',
      width: '1450',
      height: '700',
      nodes: [],
      edges: [],
    },
    {
      SvgComponent: VE2,
      name: 'VE 2',
      width: '1000',
      height: '700',
      nodes: [],
      edges: [],
    },
  ],
  'VL Building': [
    {
      SvgComponent: VL1,
      name: 'VL 1',
      width: '1000',
      height: '1000',
      nodes: [],
      edges: [],
    },
    {
      SvgComponent: VL2,
      name: 'VL 2',
      width: '1000',
      height: '1000',
      nodes: [],
      edges: [],
    },
  ],
  'CC Building': [
    {
      SvgComponent: CC1,
      name: 'CC 1',
      width: '4900',
      height: '2000',
      nodes: [],
      edges: [],
    },
  ],
};

// constant file --> factory pattern & flyweight --> dijkstra algo --> UI rendering
// 1. design pattersn
// 2. facilitates writing the nodes and editing them
//
