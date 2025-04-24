export type AuthBase = {
  email: string;
  password: string;
};

export type SignUpPayload = AuthBase & {
  address: string;
  confirmPassword: string;
  invitationCode?: string;
  isDelivery: boolean;
  lastName: string;
  firstName: string;
  phoneNumber: string;
};
