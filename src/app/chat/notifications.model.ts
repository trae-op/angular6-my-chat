
export interface NotificationsModel {
  _id: string;
  type: string;
  user: {
    name: string,
    email: string
  };
  message: string;
  created_at: string;
  interlocutor_email: string;
}
