export interface Credentials {
    name?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface CredentialsInvalid {
    name: boolean;
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
}