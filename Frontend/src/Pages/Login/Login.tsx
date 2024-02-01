import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useForm } from "react-hook-form";
import authService from "../../Services/AuthService";
import CredentialsModel from "../../Models/CredentialsModel";
import useTitle from "../../Hooks/useTitle";
import notifyService from "../../Services/NotifyService";
import { NavLink } from "react-router-dom";

function Login(): JSX.Element {
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    useTitle('Login');

    const save = async (credentials: CredentialsModel) => {
        try {
            await authService.login(credentials);
            notifyService.success('Welcome Back! :)');
            navigate('/vacations');
        } catch (error: any) {
            notifyService.error(error);
        }
    }

    return (
        <div className="Login">
            <form onSubmit={handleSubmit(save)}>
                <h2>Login</h2>

                <label>Email:</label>
                <input type="text" inputMode="email" {...register('email', CredentialsModel.EmailValidation)} />
                <span>{formState.errors.email?.message}</span>

                <label>Password:</label>
                <input type="password" {...register('password', CredentialsModel.PasswordValidation)} />
                <span>{formState.errors.password?.message}</span>

                <button className="cool">Login</button>

                <div className="register-link">
                    <span>don't have account</span>
                    <NavLink to='/register'>register now</NavLink>
                </div>
            </form>
        </div>
    );
}

export default Login;
