import { NOTIFICATION_TYPE, Store } from "react-notifications-component"

export function useNotification() {
    const execute = (type: NOTIFICATION_TYPE, message: string) => {
        Store.addNotification(
            {
                title: type === 'success' ? "Tudo certo!" : "Ops, algo deu errado!",
                message: message,
                type: type,
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated animate__fadeIn"],
                animationOut: ["animate__animated animate__fadeOut"],
                dismiss: {
                    duration: 2500,
                    onScreen: true
                }
            }
        )
    }
    return {
        execute
    }
}