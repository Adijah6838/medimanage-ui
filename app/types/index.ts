export interface Department {
  id: number;
  name: string;
}

export interface Staff {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  department_id: number | null;
  department?: Department;
  created_at: string;
  updated_at: string;
}

export interface SearchStaffResponse {
  data: Staff[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}