
export enum BicycleType {
    Mountain = "Mountain",
    Road = "Road",
    Hybrid = "Hybrid",
    BMX = "BMX",
    Electric = "Electric"
}

export type Product = {
    name: string;
    brand: string;
    price: number;
    type: BicycleType;
    description: string;
    quantity: number;
    inStock: boolean;
};