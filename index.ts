export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  verified: boolean;
  authMethod: 'google' | 'facebook' | 'sms' | 'email';
}

export interface Match {
  id: string;
  name: string;
  age: number;
  distance: number;
  bio: string;
  avatar: string;
  verified: boolean;
}

export interface Notification {
  id: string;
  type: 'match' | 'message' | 'like';
  title: string;
  description: string;
  timestamp: number;
}