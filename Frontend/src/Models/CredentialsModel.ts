class CredentialsModel {
    public email: string;
    public password: string;

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
        minLength: { value: 4, message: 'Password must be more than 8 chars!' },
        maxLength: { value: 20, message: 'Password is must be less than 20 chars!' }
    }
}

export default CredentialsModel;