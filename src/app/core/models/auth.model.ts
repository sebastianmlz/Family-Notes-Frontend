export interface User {
    id: number;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
    user?: User;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    family_name: string;
    first_name?: string;
    last_name?: string;
}