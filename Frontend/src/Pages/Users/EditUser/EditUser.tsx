import { useForm } from "react-hook-form";
import "./EditUser.css";
import UserModel from "../../../Models/UserModel";
import useTitle from "../../../Hooks/useTitle";
import { useNavigate } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";
import { useEffect } from "react";
import usersService from "../../../Services/UsersService";

function EditUser(): JSX.Element {
    const { register, handleSubmit, formState, setValue } = useForm<UserModel>();

    const navigate = useNavigate();
    useTitle('Update User');

    useEffect(() => {
        const user = usersService.getUser();
        setValue('id', user.id);
        setValue('firstName', user.firstName);
        setValue('lastName', user.lastName);
        setValue('email', user.email);
        setValue('password', user.password);
    }, [])

    const update = async (user: UserModel) => {
        try {
            await usersService.updateUser(user);
            notifyService.success('User successfully updated!');
            navigate('/vacations');
        } catch (error: any) {
            notifyService.error(error);
        }
    }
    return (
        <div className="EditUser">
            <form className="box" onSubmit={handleSubmit(update)}>
                <h2>Update User</h2>

                <input type="hidden" {...register('id')} />

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

                <button className="cool">Update</button>
            </form>
        </div>
    );
}

export default EditUser;
