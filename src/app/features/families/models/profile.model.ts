export interface Profile {
  id: string;
  family: string;
  name: string;
  age: number;
  is_admin: boolean;
  created_at: string;
}

export interface CreateProfileDTO {
  name: string;
  age: number;
  pin: string;
  is_admin: boolean;
}
