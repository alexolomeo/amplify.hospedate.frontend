export interface Location {
  address: string;
  city: string;
  apt?: string;
  state: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}
