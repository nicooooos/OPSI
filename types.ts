
export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export type EducationLevel = 'Elementary' | 'High School' | 'Intermediate';
