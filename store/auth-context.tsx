import { User } from "firebase/auth";
import { ReactNode } from "react";
import { createContext, useState } from "react";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    authenticate: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext({
    user: null,
    isAuthenticated: false,
    authenticate: (user: User) => { },
    logout: () => { },
} as AuthContextType);


interface AuthContextProviderProps {
    children: ReactNode
}

function AuthContextProvider({ children }: AuthContextProviderProps) {

    const [userData, setUserData] = useState<User | null>(null);

    function authenticate(user: User) {
        setUserData(user);
    }

    function logout() {
        setUserData(null);
    }

    const value = {
        user: userData,
        isAuthenticated: !!userData,
        authenticate,
        logout,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;