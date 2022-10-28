export interface mappedEvent {
  start: string; // ISO8601
  end: string; // ISO8601
  id: string;
  summary: string;
  updated: string; // ISO8601
  location: string;
}

export interface GCalDateTime {
  date?: string | null;
  dateTime?: string | null;
  timeZone?: string | null;
}
