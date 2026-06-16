export interface Review {
  id: number;
  profile: Profile;
  review: string;
  rating: number;
  date: string;
}

export interface Profile {
  id: number;
  full_name: string;
  image: string;
}
