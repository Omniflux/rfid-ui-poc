export interface TagData {
  id: number;
  time: number;
  epc: string;
  bib: number;
  antenna?: number;
  frequency?: number;
  rssi?: number;
}
