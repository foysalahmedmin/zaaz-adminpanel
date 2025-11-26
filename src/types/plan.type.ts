export type TPlan = {
  _id: string;
  name: string;
  description?: string;
  duration: number;
  sequence?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

