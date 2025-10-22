
export interface Recipient {
  email: string;
  name?: string;
}

export interface SendResult {
  success: number;
  failed: number;
}

export interface Campaign {
  id: string;
  subject: string;
  body: string;
  recipientsCount: number;
  result: SendResult;
  sentAt: Date;
}

export interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
}
