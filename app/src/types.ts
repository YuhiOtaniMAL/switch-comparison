export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface ProjectUser {
  id: number;
  status: string;
  "validated?": boolean | null;
  project: { name: string };
}

export interface CursusUser {
  level: number;
  skills: Skill[];
  cursus: { kind: string };
}

export interface User {
  login: string;
  email: string;
  phone: string;
  wallet: number;
  correction_point: number;
  location: string | null;
  image: { link: string | null };
  cursus_users: CursusUser[];
  projects_users: ProjectUser[];
}

export type RootStackParamList = {
  Search: undefined;
  Profile: { user: User };
};
