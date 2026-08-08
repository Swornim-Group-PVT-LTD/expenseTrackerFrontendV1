export interface CurrencyPayload {
 
    country_name: string;
    symbol: string;
    currency_code: string;
}


export interface CurrencyResponse {
    country_name: string;
    currency: string;
    symbol: string;
    customer_id: string;
    id: number;
    created_at: string;
    updated_at: string;
    sn:number
}
