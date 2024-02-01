import Joi from "joi";
import { ValidationError } from "./client-error";
import { UploadedFile } from "express-fileupload";

class VacationModel {
    public id: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageUrl: string;
    public image: UploadedFile;
    public followerId: number;
    public isFollower: number;
    public followersCount: number;
    public vacationsCount: number;

    public constructor(vacation: VacationModel) {
        this.id = vacation.id;
        this.destination = vacation.destination;
        this.description = vacation.description;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageUrl = vacation.imageUrl;
        this.image = vacation.image;
        this.isFollower = vacation.isFollower;
        this.followersCount = vacation.followersCount;
    }

    public static ValidationSchema = Joi.object({
        id: Joi.number().integer().positive().optional(),
        destination: Joi.string().required().min(2).max(30),
        description: Joi.string().required().min(20).max(500),
        startDate: Joi.string().required().isoDate(),
        endDate: Joi.string().required().isoDate(),
        price: Joi.number().required().integer().positive().max(10000),
        imageUrl: Joi.string().optional().min(20).max(1000),
        image: Joi.required(),
        folllwerId: Joi.number(),
        isFollower: Joi.number(),
        followersCount: Joi.number()
    });

    private static isValidDateRange(startDate: string, endDate: string): boolean {
        const currentDate = new Date();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return start <= end && start >= currentDate;
    }

    public validate(): void {
        const result = VacationModel.ValidationSchema.validate(this);

        if (result.error) throw new ValidationError(result.error.message);

        if (!VacationModel.isValidDateRange(this.startDate, this.endDate)) {
            throw new ValidationError("Invalid date range or start date has already passed.");
        }
    }
}
export default VacationModel;