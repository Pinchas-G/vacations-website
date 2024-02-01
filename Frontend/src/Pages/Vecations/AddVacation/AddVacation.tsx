import { useLocation, useNavigate } from "react-router-dom";
import "./AddVacation.css";
import useTitle from "../../../Hooks/useTitle";
import { useForm } from "react-hook-form";
import VacationModel from "../../../Models/VacationModel";
import vacationsService from "../../../Services/VacationsService";
import notifyService from "../../../Services/NotifyService";
import { useState } from "react";

function AddVacation(): JSX.Element {
    useTitle('Add Vacation');
    const navigate = useNavigate();
    const location = useLocation();
    const { page, filterBy } = location.state ?? {};

    const { register, handleSubmit, formState, setValue } = useForm<VacationModel>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const add = async (vacation: VacationModel) => {
        try {
            await vacationsService.addVacation(vacation, page, filterBy);
            notifyService.success('Vacation has been successfuly added');
            navigate('/vacations');
        } catch (error: any) {
            notifyService.error(error);
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const fileList = new DataTransfer();
            fileList.items.add(file);

            setValue('image', fileList.files);

            const previewURL = URL.createObjectURL(file);
            setImagePreview(previewURL);
        }
    };
    return (
        <div className="AddVacation">
            <form onSubmit={handleSubmit(add)}>
                <h2>Add Vacation</h2>

                <label>Destination</label>
                <input type="text" {...register('destination', VacationModel.DestinationValidation)} />
                <span>{formState.errors.destination?.message}</span>

                <label>Description</label>
                <input type="text" {...register('description', VacationModel.DescriptionValidation)} />
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
                    <input type="file" id="file" accept="image/*" required onChange={handleImageChange} />
                    <span>{formState.errors.image?.message}</span>
                </div>

                <button className="form-btn">Add Vacation</button>
            </form>
            <div className="container-image">
                <div className="selected-image">
                    {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px' }} />}
                </div>
            </div>
        </div>
    );
}

export default AddVacation;
