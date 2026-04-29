export type CurrentUser = {
  id: number;
  email: string;
  role: string;
  displayName: string;
};

export type UserDirectoryItem = {
  id: number;
  email: string;
  displayName: string;
  role: string;
};

export type ProfilePageProps = {
  user: CurrentUser;
};
