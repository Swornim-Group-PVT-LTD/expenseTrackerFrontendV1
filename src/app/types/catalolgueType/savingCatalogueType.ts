// types/incomeCategoryType.ts

// Payload for adding a new income category
export interface AddSavingCategoryPayload {
  static_value: string;
  saving_category: string;
  additional_value1?: string | null;
  additional_value2?: string | null;
  additional_value3?: string | null;
  additional_value4?: string | null;
}

// Response type returned by the API
export interface SavingCategoryResponse {
  id: number;
  sn: string;
  static_value: string;
  saving_category: string;
  additional_value1?: string | null;
  additional_value2?: string | null;
  additional_value3?: string | null;
  additional_value4?: string | null;
  created_date: string;
  updated_date: string;
}
