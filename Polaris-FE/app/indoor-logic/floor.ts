import { NodeNav } from '../NodeNav';
import { Edge } from './graph';

export class Floor {
  readonly nodes: Map<string, NodeNav> = new Map();
  readonly edges: Edge[] = [];
  constructor() {}
}
