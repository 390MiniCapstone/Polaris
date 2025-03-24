export interface Equals {
  equals(other: Equals): boolean;
}

export interface Hashable extends Equals {
  hash(): string;
}
