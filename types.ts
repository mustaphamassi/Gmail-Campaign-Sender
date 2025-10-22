export interface Recipient {
  name: string;
  email: string;
}

export enum AppStep {
  AUTHENTICATE,
  COMPOSE,
  SEND,
  COMPLETE,
  PROFILE,
}

export interface SendResult {
  success: number;
  failed: number;
}

export interface Campaign {
  id: string;
  subject: string;
  recipientsCount: number;
  sentAt: Date;
  result: SendResult;
}
