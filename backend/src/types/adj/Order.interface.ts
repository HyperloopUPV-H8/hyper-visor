export type OrderId = number;
export type OrderName = string;
export type OrderType = string;
export type OrderVariable = string;

export interface Order {
    id: OrderId;
    name: OrderName;
    type: OrderType;
    variables: OrderVariable[];
}