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
    available_stock: number;
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
    available_stock: number;
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
    available_stock: number;
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
    available_stock: number;
}
export interface CartItem {
    id: number;
    perfume_name: string;
    variant_name: string;
    unit_price: number;
    total_price: number;
    quantity: number;
    images: string;
    in_stock: boolean;
}
export const VALLEY_DISTRICTS = ["Kathmandu", "Bhaktapur", "Lalitpur"]

export const NEPAL_DISTRICTS = [
    "Kathmandu", "Bhaktapur", "Lalitpur", "Achham", "Arghakhanchi",
    "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke", "Bara",
    "Bardiya", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh", "Dang",
    "Darchula", "Dhading", "Dhankuta", "Dhanusa", "Dolakha", "Dolpa",
    "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam",
    "Jajarkot", "Jhapa", "Jumla", "Kailali", "Kalikot", "Kanchanpur",
    "Kapilvastu", "Kaski", "Kavrepalanchok", "Khotang",
    "Lamjung", "Mahottari", "Makwanpur", "Manang", "Morang", "Mugu",
    "Mustang", "Myagdi", "Nawalpur", "Nuwakot", "Okhaldhunga", "Palpa",
    "Panchthar", "Parbat", "Parsa", "Pyuthan", "Ramechhap", "Rasuwa",
    "Rautahat", "Rolpa", "Rupandehi", "Salyan", "Sankhuwasabha", "Saptari",
    "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha", "Solukhumbu",
    "Sunsari", "Surkhet", "Syangja", "Taplejung", "Tehrathum",
    "Udayapur", "Western Rukum"
]



