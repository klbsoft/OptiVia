// UserSession.ts

export interface UserInfo {
  id: string;
  name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  phone: string;
}

export interface Card {
  id: string;
  name_on_card: string;
  card_number: string;
  expiry_date: string;
  cvv: string;
  card_type: string;
}

export interface TripHistory {
  id: string;
  route_name: string;
  driver: string;
  drop_off_point: string;
  price: number;
  payment_method: Card ;
  date: string;
  status: string;
}

export interface NotificationSettings {
  trip_updates: boolean;
  price_changes: boolean;
  security_alerts: boolean;
  promotions: boolean;
}

export interface UserSettings {
  notifications: NotificationSettings;
  language: string;
}

export interface UserSession {
  user: UserInfo;
  cards: Card[];
  history: TripHistory[];
  settings: UserSettings;
}

