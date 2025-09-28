export interface LoginRequest {
    id: string;
    password: string;
}

export interface RefreshTokenRequest {
    token: string;
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data?: {
        token: string;
        tokenType: 'Bearer';
        expiresIn: string;
    };
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            created_at: Date;
            updated_at: Date;
        };
        token: string;
        tokenType: 'Bearer';
        expiresIn: string;
    };
}