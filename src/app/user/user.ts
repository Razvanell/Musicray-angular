export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    imageUrl: string;
    enabled: boolean;
    token: string;
}