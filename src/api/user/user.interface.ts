
export interface LoginRequest {
    id: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        id: string;
        created_at: Date;
        updated_at: Date;
    };
}