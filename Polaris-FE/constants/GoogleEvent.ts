export interface GoogleEvent {
  id: string;
  summary: string;
  location?: string;
  start?: {
    dateTime?: string;
    date?: Date;
  };
  end?: {
    dateTime?: string;
    date?: Date;
  };
}
