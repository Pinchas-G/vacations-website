import UserModel from "../2-models/user-model";
import { executeSP } from "../4-utils/dal";
import { ResourceNotFound, ValidationError } from "../2-models/client-error";
import { createToken, hashPassword } from "../4-utils/cyber";
import { isEmailTaken } from "./auth-service";

export async function updateUser(user: UserModel): Promise<string> {
    user.validate();
    const { id, firstName, lastName, email, password } = user;

    const isTaken = await isEmailTaken(email, id);
    if (isTaken) throw new ValidationError(`Email: ${email} alredy exists`);

    user.password = hashPassword(password);

    const result = await executeSP('spUpdateUser', id, firstName, lastName, email, user.password);
    if (!result.affectedRows) throw new ResourceNotFound(id);

    const token = createToken(user);
    return token;
}