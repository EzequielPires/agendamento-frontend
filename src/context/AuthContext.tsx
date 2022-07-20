import router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, useContext, useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { useNotification } from "src/hooks/useNotification";
import { api } from "src/services/api";
import { useLoading } from "./LoadingContext";

interface signInRequest {
    email: string;
    password: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    business: {
        id: string,
        name: string,
        logo?: string,
        banner?: string,
        phone: string
    }
}

interface Auth {
    user: User;
    signIn: ({ email, password }: signInRequest) => Promise<void>
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    resetPassword: (password: string, repeat_password: string, token: string) => Promise<void>;
}

const AuthContext = createContext({} as Auth);

function AuthProvider({ children }) {
    const [user, setUser] = useState<User>(null);
    const { handleHiddenLoading, handleShowLoading } = useLoading();
    const notificationHook = useNotification();

    useEffect(() => {
        const { 'instabio.token': token, 'instabio.user': user } = parseCookies();
        if (token && user) {
            api.defaults.headers['Authorization'] = `Bearer ${token}`;
            setUser(JSON.parse(user));
        }
    }, []);

    function setInstabioCookie(name, data) {
        setCookie(undefined, name, data, { maxAge: 60 * 60 * 1, path: '/', })
    }

    async function signIn({ email, password }: signInRequest) {
        try {
            handleShowLoading();
            const authResponse = await api.post('/auth/login', {
                email,
                password
            });
            if (!authResponse || !authResponse.data?.success) {
                notificationHook.execute('danger', `Falha ao realizar login, email e/ou senha incorretos`);
            } else {
                console.log(authResponse);
                setInstabioCookie('instabio.token', authResponse.data.token);
                api.defaults.headers['Authorization'] = `Bearer ${authResponse.data.token}`;
                setInstabioCookie('instabio.user', JSON.stringify(authResponse.data.user));
                setUser(authResponse.data.user);
                {authResponse.data.user.role === "admin" || authResponse.data.user.role === "collaborator" ? router.push('/admin') : router.back()}
            }
            handleHiddenLoading();
        } catch (error) {
            handleHiddenLoading();
            notificationHook.execute('danger', `Falha ao realizar login, email e/ou senha incorretos`);
        }
    }

    async function signOut() {
        const { 'instabio.token': token } = parseCookies();
        const { 'instabio.user': user } = parseCookies();
        if (token && user) {
            setUser(null);
            destroyCookie(null, 'instabio.token', { path: '/', });
            destroyCookie(null, 'instabio.user', { path: '/', });
        }
        router.push('/login');
    }

    async function forgotPassword(email: string) {
        try {
            handleShowLoading();
            const { data } = await api.post('/users/forgot-password', {
                email
            });
            if (data.success) {
                notificationHook.execute('success', `Email com o link de recuperação de senha enviado com sucesso.`);
            } else {
                notificationHook.execute('danger', `${data.message}`);
            }
        } catch (error) {
            console.log(error);
            notificationHook.execute('danger', `Falha ao enviar o link de recuperação de senha`);
        } finally {
            handleHiddenLoading();
        }
    }

    async function resetPassword(password: string, repeat_password: string, token: string) {
        try {
            handleShowLoading();
            const { data } = await api.post('/users/reset-password', {
                password,
                repeat_password,
                token
            });
            if (data.success) {
                notificationHook.execute('success', `Senha resetada com sucesso.`);
            } else {
                notificationHook.execute('danger', `${data.message}`);
            }
        } catch (error) {
            console.log(error);
            notificationHook.execute('danger', `Falha ao resetar senha`);
        } finally {
            handleHiddenLoading();
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            signOut,
            forgotPassword,
            resetPassword
        }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth }
