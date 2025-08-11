export interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  tags: string[];
  publishedAt: Date;
  isPublished: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
}
