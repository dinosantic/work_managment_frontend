export type CurrentUser = {
  id: number;
  email: string;
  role: string;
  displayName: string;
};

export type ProfilePageProps = {
  user: CurrentUser;
};
