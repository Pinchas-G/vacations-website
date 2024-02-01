import { ResourceNotFound } from "../2-models/client-error";
import VacationModel from "../2-models/vacation-model";
import appConfig from "../4-utils/app-config";
import { executeSP } from "../4-utils/dal";
import { saveImage, updateImage } from "../4-utils/file-handler";

const { vacationsImagesUrl } = appConfig;

export async function getVacations(page: number, limit: number, userId: number, filterBy: number): Promise<VacationModel[]> {
    const startIndex = (page - 1) * limit;
    const vacations = await executeSP<VacationModel[]>('spGetVacations', vacationsImagesUrl, startIndex, limit, userId, filterBy);
    return vacations.result;
}

export async function getVacation(id: number, userId: number): Promise<VacationModel> {
    const vacations = await executeSP<VacationModel[]>('spGetVacation', vacationsImagesUrl, id, userId);
    return vacations.result[0];
}

export async function addVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();

    const { destination, description, startDate, endDate, price, image } = vacation;
    
    let imageName: string;
    if (image) {
        imageName = await saveImage(image);
        vacation.imageUrl = vacationsImagesUrl + imageName;
    }
    const result = await executeSP<VacationModel>(`spAddVacation`, destination, description, startDate, endDate, price, imageName, vacationsImagesUrl);
    return result.result[0];
}

export async function updateVacation(vacation: VacationModel): Promise<VacationModel> {
    vacation.validate();
    
    const { id, destination, description, startDate, endDate, price, image } = vacation;

    let imageName = await getVacationImgName(id);

    if (image) {
        imageName = await updateImage(image, imageName);
        vacation.imageUrl = vacationsImagesUrl + imageName;
    }
    const result = await executeSP('spUpdateVacation', id, destination, description, startDate, endDate, price, imageName);
    if (!result.affectedRows) throw new ResourceNotFound(id);

    delete vacation.image;
    return vacation;
}

export async function deleteVacation(id: number): Promise<void> {
    const result = await executeSP('spDeleteVacation', id);
    if (!result.affectedRows) throw new ResourceNotFound(id);
}

async function getVacationImgName(id: number): Promise<string> {
    const result = await executeSP<{ imageName: string }[]>('spGetVacationImgName', id);
    return result.result[0].imageName;
}