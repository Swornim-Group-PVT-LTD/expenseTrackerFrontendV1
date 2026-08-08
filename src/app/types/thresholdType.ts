export interface AddThresholdPayload {
    expense_threshold_amount: number;
    frequency: "Monthly" | "Yearly";
    isEnable: boolean;
}

export interface ThresholdResponse {
    id: number;
    sn: string;
    customerid: string;
    expense_threshold_amount: number;
    frequency: "Monthly" | "Yearly";
    isEnable: boolean;
    create_date: string;
}

export interface CompareExpenseAndThresholdResponse {
    message: string;
    filter: string;
    threshold_amount: number;
    total_expenses: number;
    remaining_amount: number;
    exceeded_amount: number;
    percent_used: number;
    warning: string;
    currency: string;
    symbol: string;
    threshold_sn: string;
}
