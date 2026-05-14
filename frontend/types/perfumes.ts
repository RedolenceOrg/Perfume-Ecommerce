export interface PerfumeImage {
    image: string;
    is_primary: boolean;
}

export interface Notes {
    top: string[];
    middle: string[];
    base: string[];
}
export interface Decant {
    id: number;
    size: number;
    price: number;
    stock: number;
}
export interface PerformanceMetrics {
    longevity: number;
    sillage: number;
}

export interface Perfume {
    id: number;
    name: string;
    brand: string;
    price: number;
    description: string;
    gender: string;
    images: PerfumeImage[];
    notes: Notes;
    family: string[];
    slug: string;
    decant: Decant[];
    stock: number;
    performance: PerformanceMetrics[]
}

export interface PerfumeSummary {
    id: number;
    name: string;
    brand: string;
    price: string;
    images: PerfumeImage[];
    slug: string;
}
export interface AtomizerVariant {
    id: number;
    stock: number;
    size: number;
    price: number;
    colors: string;
    image: string;
}
export interface Atomizer {
    id: number;
    name: string;
    description: string;
    is_premium: boolean;
    variants: AtomizerVariant[];
}
export interface Thrift {
    id: number;
    perfume_id: number;
    perfume_name: string;
    brand: string;
    remaining_juice: number;
    thrift_price: number;
    image: PerfumeImage[];
}
export interface CartItem {
    id: number;
    perfume_name: string;
    variant_name: string;
    unit_price: number;
    total_price: number;
    quantity: number;
    images: string;
}


