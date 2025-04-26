export type UserBase = {
  email: string;
  password: string;
};

export type SignUpPayload = UserBase & {
  address: string;
  confirmPassword: string;
  invitationCode?: string;
  lastName: string;
  firstName: string;
  phoneNumber: string;
  isDelivery: boolean;
};
