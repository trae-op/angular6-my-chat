
export interface PrivateDialoguesModel {
  _id: string;
  users: [
    {
      name: string,
      email: string
    },
    {
      name: string,
      email: string
    }
  ];
  created_at: string;
}
