export interface Partnership {
    id: number;
    name: string;
    logo: string;
    website?: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface PartnershipFormData {
    name: string;
    logo: File | null;
    website: string;
    description: string;
}
