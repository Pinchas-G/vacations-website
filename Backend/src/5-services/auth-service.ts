import UserModel from "../2-models/user-model";
import { executeSP } from "../4-utils/dal";
import { UnauthorizedError, ValidationError } from "../2-models/client-error";
import RoleModel from "../2-models/role-model";
import { createToken, hashPassword } from "../4-utils/cyber";
import CredentialsModel from "../2-models/credentials-model";

export async function register(user: UserModel): Promise<string> {
    user.validate();

    const { firstName, lastName, email } = user;

    const isTaken = await isEmailTaken(email);
    if (isTaken) throw new ValidationError(`Email: ${email} alredy exists`);

    user.roleId = RoleModel.User;
    user.password = hashPassword(user.password);

    const result = await executeSP<{ id: number }[]>('spRegister', firstName, lastName, email, user.password, user.roleId);
    user.id = result.result[0].id;

    const token = createToken(user);
    return token;
}

export async function login(credentials: CredentialsModel): Promise<string> {
    credentials.validate();
    credentials.password = hashPassword(credentials.password);

    const result = await executeSP<UserModel[]>('spLogin', credentials.email, credentials.password);
    const user = result.result[0];

    if (!user) throw new UnauthorizedError('Incorrect email or password');

    const token = createToken(user);
    return token;
}

export async function isEmailTaken(email: string, id?: number): Promise<boolean> {
    const result = await executeSP<{ isTaken: number }[]>('spIsEmailTaken', id, email);
    const isTaken = result.result[0].isTaken;
    return isTaken === 1;
}
