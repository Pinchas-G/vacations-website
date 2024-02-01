import { useForm } from "react-hook-form";
import "./Register.css";
import UserModel from "../../Models/UserModel";
import authService from "../../Services/AuthService";
import { useNavigate } from "react-router-dom";
import useTitle from "../../Hooks/useTitle";
import notifyService from "../../Services/NotifyService";

function Register(): JSX.Element {
    useTitle('Register');

    const { register, handleSubmit, formState } = useForm<UserModel>();
    const navigate = useNavigate();

    const save = async (user: UserModel) => {
        try {
            await authService.register(user);
            notifyService.success('Welcome! ' + user.firstName);
            navigate('/vacations');
        } catch (error: any) {
            notifyService.error(error);
        }
    }
    return (
        <div className="Register">
            <form onSubmit={handleSubmit(save)}>
                <h2>Register</h2>

                <label>First Name:</label>
                <input type="text" {...register('firstName', UserModel.FirstNameValidation)} />
                <span>{formState.errors.firstName?.message}</span>

                <label>Last Name:</label>
                <input type="text" {...register('lastName', UserModel.LastNameValidation)} />
                <span>{formState.errors.lastName?.message}</span>

                <label>Email:</label>
                <input type="text" inputMode="email"{...register('email', UserModel.EmailValidation)} />
                <span>{formState.errors.email?.message}</span>

                <label>Password:</label>
                <input type="password" {...register('password', UserModel.PasswordValidation)} />
                <span>{formState.errors.password?.message}</span>

                <button className="cool">Register</button>
            </form>
        </div>
    );
}

export default Register;
