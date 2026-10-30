export type RsvpStatus = 'confirmed' | 'declined';

export interface RsvpPayload {
  guest_name: string;
  phone: string;
  status: RsvpStatus;
  number_of_companions: number;
  companion_names: string[];
  dietary_restrictions?: string;
}

export interface GuestbookMessage {
  id: string;
  created_at: string;
  author_name: string;
  message: string;
}

