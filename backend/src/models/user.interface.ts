export interface User {
    id: string;
    name: string;
    email: string;
    username: string | null;
    password: string;
    role: 'ADMIN' | 'CLIENT';
    authKey?: string | null;
    authKeyExpiresAt?: Date | null;
  }
  
export interface CreateUserInput {
    name: string;
    email: string;
    username?: string;
    password: string;
    role: 'ADMIN' | 'CLIENT';
    authKey?: string;
  }
  
export interface LoginUserInput {
    username: string;
    password: string;
  }
  
export interface UpdateUserInput {
    id: string;
    name?: string;
    email?: string;
    role?: 'ADMIN' | 'CLIENT';
    currentPassword: string;
    newPassword?: string;
    username?: string;
  }
