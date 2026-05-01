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
    size: number;
    price: number;
}
export interface PerformanceMetrics {
    longevity: number;
    sillage: number;
}

export interface Perfume {
    id?: number;
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

    size: number;
    price: number;
    colors: string;

}
export interface Atomizer {
    id: number;
    name: string;
    description: string;
    is_premium: boolean;
    variants: AtomizerVariant[];
}

