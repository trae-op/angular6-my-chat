
export interface PrivateDialoguesModel {
  _id: string;
  interlocutor: {
    name: string,
    email: string
  };
  sender: {
    name: string,
    email: string
  };
  created_at: string;
}
