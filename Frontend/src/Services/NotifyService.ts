import { Store } from "react-notifications-component";

class NotifyService {

    public success(message: string): void {
        Store.addNotification({
            title: "Success!",
            message,
            type: "success",
            insert: "top",
            container: "bottom-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            }
        });
    }

    public error(error: any): void {
        const message = this.extractMessage(error);
        Store.addNotification({
            title: "Error!",
            message,
            type: "danger",
            insert: "top",
            container: "bottom-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            }
        });
    }

    public info(message:string): void {
        Store.addNotification({
            title: "info!",
            message,
            type: "info",
            insert: "top",
            container: "bottom-left",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            dismiss: {
                duration: 5000,
                onScreen: true,
            }
        });
    }

    private extractMessage(error: any): string {

        // fron-end
        if (typeof error === 'string') return error;

        // back-end throw string
        if (typeof error.response?.data === 'string') return error.response.data;

        // back-end throw [] validation
        if (Array.isArray(error.response?.data)) return error.response.data[0];

        // fron-end throw new Error('message')
        if (typeof error.message === 'string') return error.message;

        // else
        return 'Somthing went wrong...😭';
    }
}
const notifyService = new NotifyService();
export default notifyService;