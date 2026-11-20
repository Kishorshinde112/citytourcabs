export interface Vehicle {
  id: string;
  name: string;
  category: string;
  tag?: string;
  badgeColor?: string;
  seats: string;
  configuration?: string;
  bootSpace?: string;
  luggage: string;
  acType?: string;
  fuelType?: string;
  ratePerKm: string;
  localFullDay?: string;
  image: string;
  features: string[];
  bestFor?: string;
}
