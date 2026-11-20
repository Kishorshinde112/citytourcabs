export interface RateTableRow {
  vehicle: string;
  h8?: string;
  h10?: string;
  h12?: string;
  extra?: string;
  extraKm?: string;
  extraHr?: string;
}

export interface AttractionSpot {
  name: string;
  desc?: string;
  emoji?: string;
}

export interface TourPackage {
  id: string;
  slug?: string;
  title: string;
  category?: string;
  duration?: string;
  tagline?: string;
  shortDescription?: string;
  badge?: string;
  banner?: string;
  heroImage?: string;
  startingPrice?: string;
  rating?: number;
  reviewsCount?: number;
  rates?: RateTableRow[];
  attractions?: AttractionSpot[];
  rules?: string[];
  inclusions?: string[];
  exclusions?: string[];
  leftHtml?: string;
  rightHtml?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
  };
}
