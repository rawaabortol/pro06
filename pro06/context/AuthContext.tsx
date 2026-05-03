
// import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
// import { User, UserRole } from '../types';
// import { api } from '../services/api';

// interface AuthContextType {
//     user: User | null;
//     login: (email: string, role: UserRole) => Promise<boolean>;
//     logout: () => void;
//     isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);

//     useEffect(() => {
//         const storedUser = localStorage.getItem('odyssey_user');
//         if (storedUser) {
//             setUser(JSON.parse(storedUser));
//         }
//     }, []);

//     const login = async (email: string, role: UserRole): Promise<boolean> => {
//         try {
//             const response = await api.login(email, role);
//             if (response.success && response.user) {
//                 setUser(response.user);
//                 localStorage.setItem('odyssey_user', JSON.stringify(response.user));
//                 return true;
//             }
//             return false;
//         } catch (e) {
//             console.error("Login failed", e);
//             return false;
//         }
//     };

//     const logout = () => {
//         setUser(null);
//         localStorage.removeItem('odyssey_user');
//     };

//     return (
//         <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };



import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, RegisterCredentials } from '../types';
import { api } from '../services/api';

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole, password?: string) => Promise<boolean>;
    register: (data: RegisterCredentials) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('odyssey_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, role: UserRole, password?: string): Promise<boolean> => {
        try {
            const response = await api.login(email, role, password);
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem('odyssey_user', JSON.stringify(response.user));
                return true;
            }
            return false;
        } catch (e) {
            console.error("Login failed", e);
            return false;
        }
    };

    const register = async (data: RegisterCredentials): Promise<boolean> => {
        try {
            const response = await api.register(data);
            if (response.success && response.user) {
                setUser(response.user);
                localStorage.setItem('odyssey_user', JSON.stringify(response.user));
                return true;
            }
            return false;
        } catch (e) {
            console.error("Registration failed", e);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('odyssey_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};