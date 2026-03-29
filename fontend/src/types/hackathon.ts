export interface HackathonEvent {
  id: number;
  title_fr: string;
  title_ar: string;
  title_en: string;
  subtitle_fr: string;
  subtitle_ar: string;
  subtitle_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  date_start: string;
  date_end: string;
  location_fr: string;
  location_ar: string;
  location_en: string;
  registration_deadline: string | null;
  max_teams: number;
  contact_email: string;
  banner: string | null;
  is_active: boolean;
  year: number;
}

export interface Prize {
  id: number;
  event: number;
  place: number;
  title_fr: string;
  title_ar: string;
  title_en: string;
  amount: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  is_special: boolean;
}

export interface TimelineItem {
  id: number;
  event: number;
  day: number;
  time: string;
  title_fr: string;
  title_ar: string;
  title_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  is_highlight: boolean;
}

export interface Winner {
  id: number;
  event: number;
  team_name: string;
  project_name_fr: string;
  project_name_ar: string;
  project_name_en: string;
  project_description_fr: string;
  project_description_ar: string;
  project_description_en: string;
  place: number;
  members: string;
  photo: string | null;
}

export interface GalleryItem {
  id: number;
  event: number;
  image: string;
  caption_fr: string;
  caption_ar: string;
  caption_en: string;
}

export interface Theme {
  id: number;
  event: number;
  title_fr: string;
  title_ar: string;
  title_en: string;
  description_fr: string;
  description_ar: string;
  description_en: string;
  icon: string | null;
}
