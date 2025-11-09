export interface Todo {
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
  status: {
    leo: boolean;
    maria: boolean;
  };
  images?: string[];
}
