import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./EditVacation.css";
import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import useTitle from "../../../Hooks/useTitle";
import { useEffect, useState } from "react";
import vacationsService from "../../../Services/VacationsService";
import notifyService from "../../../Services/NotifyService";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Store";

function EditVacation(): JSX.Element {
    useTitle('Edit Vacation');
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();
    const { page, filterBy } = location.state ?? {};

    const userId = useSelector((state: RootState) => state.auth.user.id);
    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const vacationId = +params.id;
                const vacation = await vacationsService.getVacation({ vacationId, page, filterBy, userId });

                const { id, destination, description, startDate, endDate, price, followerId, isFollower, followersCount } = vacation;
                setValue('id', id);
                setValue('destination', destination);
                setValue('description', description);
                setValue('startDate', new Date(startDate).toISOString().split('T')[0]);
                setValue('endDate', new Date(endDate).toISOString().split('T')[0]);
                setValue('price', price);
                setValue('followerId', followerId);
                setValue('isFollower', isFollower);
                setValue('followersCount', followersCount);

                if (vacation.imageUrl) {
                    setPreviewImage(vacation.imageUrl);
                }
            } catch (error: any) {
                notifyService.error(error);
            }
        })();
    }, [])

    const update = async (vacation: VacationModel) => {
        try {
            await vacationsService.updateVacation(vacation, page, filterBy);
            notifyService.success('Vacation has been successfuly update');
            navigate('/vacations');
        } catch (error: any) {
            notifyService.error(error);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
            const fileList = new DataTransfer();
            fileList.items.add(file);
            setValue('image', fileList.files);
        }
    }
    return (
        <div className="EditVacation">
            <form onSubmit={handleSubmit(update)}>
                <h2>Edit Vacation</h2>

                <label>Destination</label>
                <input type="text" {...register('destination', VacationModel.DestinationValidation)} />
                <span>{formState.errors.destination?.message}</span>

                <label>Description</label>
                <textarea {...register('description', VacationModel.DescriptionValidation)}></textarea>
                <span>{formState.errors.description?.message}</span>

                <label>Start on</label>
                <input type="date" {...register('startDate', VacationModel.StartDateValidation)} />
                <span>{formState.errors.startDate?.message}</span>

                <label>End on</label>
                <input type="date" {...register('endDate', VacationModel.EndDateValidation)} />
                <span>{formState.errors.endDate?.message}</span>

                <label>Price</label>
                <input type="number" {...register('price', VacationModel.PriceValidation)} />
                <span>{formState.errors.price?.message}</span>

                <div>
                    <label htmlFor="file" className="file-label">Cover Image</label>
                    <span className="file-text">Please select a File</span>
                    <input
                        type="file"
                        id="file"
                        accept="image/*"
                        required
                        onChange={(e) => {
                            register('image');
                            handleImageChange(e);
                        }}
                    />
                    <span>{formState.errors.image?.message}</span>
                </div>

                <button className="form-btn">Update Vacation</button>
            </form>
            <div>
                {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
            </div>
        </div>
    );
}

export default EditVacation;