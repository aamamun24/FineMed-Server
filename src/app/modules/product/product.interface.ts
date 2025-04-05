export enum BicycleType {
    Mountain = "Mountain",
    Road = "Road",
    Hybrid = "Hybrid",
    BMX = "BMX",
    Electric = "Electric"
}

export interface Product {
    name: string;
    brand: string;
    price: number;
    image: string;
    type: BicycleType;
    description: string;
    quantity: number;
    inStock: boolean;
}
