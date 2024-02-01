import Joi from "joi";
import { ValidationError } from "./client-error";
import RoleModel from "./role-model";

class UserModel {
    public id: number;
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public roleId: RoleModel;

    public constructor(user: UserModel) {
        this.id = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.roleId = user.roleId;
    }

    public static ValidationSchema = Joi.object({
        id: Joi.number().integer().positive().optional(),
        firstName: Joi.string().required().min(2).max(30),
        lastName: Joi.string().required().min(2).max(30),
        email: Joi.string().required().min(6).max(320).email(),
        password: Joi.string().required().min(8).max(300),
        roleId: Joi.number().optional().integer().positive(),
    });

    public validate(): void {
        const result = UserModel.ValidationSchema.validate(this);
        if (result.error) throw new ValidationError(result.error.message);
    }
}
export default UserModel;
