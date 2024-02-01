import Joi from "joi";
import { ValidationError } from "./client-error";

class CredentialsModel {
    public email: string;
    public password: string;

    public constructor(credentials: CredentialsModel) {
        this.email = credentials.email;
        this.password = credentials.password;
    }

    public static ValidationSchema = Joi.object({
        email: Joi.string().required().min(6).max(320).email(),
        password: Joi.string().required().min(8).max(300),
    });

    public validate(): void {
        const result = CredentialsModel.ValidationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}
export default CredentialsModel;