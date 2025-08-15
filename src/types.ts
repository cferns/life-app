export type PinKind = 'you' | 'root' | 'note' | 'task' | 'person' | 'location' | 'decision';
export type PinStatus = 'red' | 'yellow' | 'green';

export type MapPin = {
  id: string;
  label: string;
  color?: string;
  xPct: number;
  yPct: number;
  kind: PinKind;
  status?: PinStatus;
  meta?: any;
};

