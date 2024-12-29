// types.ts
export interface UserData {
  uid: string;
  name: string;
  email: string;
  token: string;
}


export interface SignupData {
  name: string;
  email: string;
  password: string;
  gender?: string;
  location?: string;
  language?: string;
  interests?: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

// Helper function to transform API user data to UserData type
export const mapUserData = (apiUser: any, token: string): UserData => {
  return {
    uid: apiUser.id || apiUser.uid,
    name: apiUser.name || apiUser.displayName || '',
    email: apiUser.email || '',
    token: token
  };
};