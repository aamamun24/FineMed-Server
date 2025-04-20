export interface IProduct {
    name: string;
    generic:string;
    brand: string;
    price: number;
    image: string;
    form: 'Tablet' | 'Syrup' | 'Capsule' | 'Injection' | 'Ointment';
    category: 'Antibiotic' | 'Painkiller' | 'Antacid' | 'Antiseptic' | 'Antiviral';
    description: string;
    simptoms: string[];
    quantity: number;
    prescriptionRequired: boolean;
    manufacturer: string;
    expiryDate: string; 
    createdAt?: string; 
    updatedAt?: string; 
}
