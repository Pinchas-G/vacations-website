class VacationModel {
    public id: number;
    public destination: string;
    public description: string;
    public startDate: string;
    public endDate: string;
    public price: number;
    public imageUrl: string;
    public image: FileList;
    public followerId: number;
    public isFollower: number;
    public followersCount: number;
    public vacationsCount: number;

    public static DestinationValidation = {
        required: { value: true, message: 'Missing Destination!' },
        minLength: { value: 2, message: 'Destination is too short!' },
        maxLength: { value: 30, message: 'Destination is too long!' }
    }

    public static DescriptionValidation = {
        required: { value: true, message: 'Missing Description!' },
        minLength: { value: 20, message: 'Description is too short!' },
        maxLength: { value: 500, message: 'Description is too long!' }
    }

    public static StartDateValidation = {
        required: { value: true, message: 'Missing Start Date!' },
    }

    public static EndDateValidation = {
        required: { value: true, message: 'Missing End Date!' },
    }

    public static PriceValidation = {
        required: { value: true, message: 'Missing Price!' },
        min: { value: 1, message: 'Price cannot be negative' },
        max: { value: 10000, message: 'Price nust be less than 10000' }
    }

    public static ImageValidation = {
        required: { value: true, message: 'Missing Image!' },
    }
}
export default VacationModel;