class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId: number;

    public static FirstNameValidation = {
        required: { value: true, message: 'FirstName is required!' },
        minLength: { value: 2, message: 'FirstName must be more than 8 chars!' },
        maxLength: { value: 20, message: 'FirstName must be less than 20 chars!' }
    }

    public static LastNameValidation = {
        required: { value: true, message: 'LastName is required!' },
        minLength: { value: 2, message: 'LastName must be more than 8 chars!!' },
        maxLength: { value: 20, message: 'LastName must be less than 20 chars!' }
    }

    public static EmailValidation =
        {
            required: 'Email is required',
            pattern: {
                value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address',
            }
        }

    public static PasswordValidation = {
        required: { value: true, message: 'Password is required!' },
        minLength: { value: 8, message: 'Password must be more than 8 chars!' },
        maxLength: { value: 20, message: 'Password is must be less than 20 chars!' }
    }
}

export default UserModel;