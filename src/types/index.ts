export type CustomerStatus = 'pending' | 'contacted' | 'quoted' | 'closed' | 'lost';

export interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface FollowupNote {
  id: string;
  customerId: string;
  content: string;
  createdAt: string;
}

export interface CustomerFormData {
  name: string;
  contact: string;
  phone: string;
  status: CustomerStatus;
}

export interface NoteFormData {
  content: string;
}
