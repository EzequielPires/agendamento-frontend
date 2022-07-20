import { useRouter } from "next/router";
import { createContext, useContext, useEffect, useState } from "react";
import { Loading } from "src/components/Loading";

interface LoadingProps {
    show: boolean;
    handleShowLoading: () => void;
    handleHiddenLoading: () => void;
}

const LoadingContext = createContext({} as LoadingProps);

function LoadingProvider({ children }) {
    const [show, setShow] = useState(false);
    /* const router = useRouter();

    useEffect(() => {
        const handleStart = (url) => {
            setShow(true);
        };
        const handleStop = () => {
            setShow(false);
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router]); */

    const handleShowLoading = () => setShow(true);

    const handleHiddenLoading = () => setShow(false);

    return (
        <LoadingContext.Provider value={{
            handleShowLoading,
            handleHiddenLoading,
            show
        }}>
            {show && <Loading />}
            {children}
        </LoadingContext.Provider>
    )
}

function useLoading() {
    const context = useContext(LoadingContext);

    return context;
}

export { LoadingProvider, useLoading }