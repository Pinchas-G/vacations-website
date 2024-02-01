import { useCallback, useEffect, useRef, useState } from "react";
import FollowerCheckbox from "../../Common/FollowerCheckbox/FollowerCheckbox";
import VacationModel from "../../../Models/VacationModel";
import "./VacationCard.css";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../Redux/Store";
import followersService from "../../../Services/FollowersService";
import { updateFollower } from "../../../Redux/VacationsSlice";
import { socket } from "../../..";
import RoleModel from "../../../Models/RoleModel";
import notifyService from "../../../Services/NotifyService";
import vacationsService from "../../../Services/VacationsService";
import { useNavigate } from "react-router-dom";

interface CardProps {
    vacation: VacationModel;
    filteredPages: { page: number, filterBy: number };
    onReadMoreClick: (description: string) => void;
}

function VacationCard({ vacation, filteredPages, onReadMoreClick }: CardProps): JSX.Element {
    const navigate = useNavigate();

    const userId = useSelector((state: RootState) => state.auth.user?.id) ?? 0;
    const roleId = useSelector((state: RootState) => state.auth.user?.roleId) ?? RoleModel.User;

    const [isFollower, setIsFollower] = useState(!!vacation.isFollower);
    const [isClicked, setIsClicked] = useState<boolean>();
    const [followerId, setFollowerId] = useState(vacation.followerId);
    const [followersCount, setFollowersCount] = useState(vacation.followersCount);
    const [deleteClass, setDeleteClass] = useState('');

    const cardElement = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            if (isClicked === undefined) return;
            if (isFollower) {
                const newFollower = await followersService.addFollower({ userId, vacationId: vacation.id });
                setFollowerId(newFollower.id);
            }
            else {
                await followersService.deleteFollower(followerId);
                setFollowerId(null);
            }
            const followerDeatails = {
                vacationId: vacation.id,
                isFollower: isFollower ? 1 : 0,
                page: filteredPages.page,
                filterBy: filteredPages.filterBy
            }
            socket.emit('followers-count', { vacationId: vacation.id, followersCount, isFollower });
            store.dispatch(updateFollower(followerDeatails));
        })()
    }, [isClicked])

    const onFollower = useCallback((follower: boolean) => {
        setIsFollower(follower);
        setIsClicked(isClicked => !isClicked);
    }, [])

    const handleEdit = () => {
        navigate(`/vacations/edit/${vacation.id}`, { state: { page: filteredPages.page, filterBy: filteredPages.filterBy } });
    }

    const handleDelete = async () => {
        const shouldDelete = window.confirm("Are you sure you want to delete this vacation?");
        if (!shouldDelete) return;
        try {
            const vacationDeatails = {
                vacationId: vacation.id,
                page: filteredPages.page,
                filterBy: filteredPages.filterBy
            }
            await vacationsService.deleteVacation(vacationDeatails);
            notifyService.success('Deleted!');
            cardElement && cardElement.current.classList.add('delete');
            setDeleteClass('delete');

        } catch (error: any) {
            notifyService.error(error);
        }
    }

    const handleReadMoreClick = useCallback((description: string) => {
        onReadMoreClick(description);
    }, [])


    const startDate = new Date(vacation.startDate).toLocaleDateString();
    const endDate = new Date(vacation.endDate).toLocaleDateString();

    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(vacation.price);

    socket.on('followers-count-updated', ({ vacationId, followersCount }) => {
        if (vacationId === vacation.id)
            setFollowersCount(followersCount);
    })

    return (
        <div className={"VacationCard " + deleteClass} ref={cardElement}>
            <div className="header">
                {roleId === RoleModel.Admin &&
                    <div className="edit-card">
                        <span onClick={() => handleEdit()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="16" width="16" viewBox="0 0 512 512"><path d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152V424c0 48.6 39.4 88 88 88H360c48.6 0 88-39.4 88-88V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V424c0 22.1-17.9 40-40 40H88c-22.1 0-40-17.9-40-40V152c0-22.1 17.9-40 40-40H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H88z" /></svg>
                        </span>
                        <span onClick={() => handleDelete()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="14" width="12" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                        </span>
                    </div>
                }
                {roleId === RoleModel.User &&
                    <FollowerCheckbox follower={{ isFollower, onFollower, followersCount }} />
                }
                <span className="date">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="14" width="12" viewBox="0 0 448 512"><path d="M128 0c17.7 0 32 14.3 32 32V64H288V32c0-17.7 14.3-32 32-32s32 14.3 32 32V64h48c26.5 0 48 21.5 48 48v48H0V112C0 85.5 21.5 64 48 64H96V32c0-17.7 14.3-32 32-32zM0 192H448V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V192zm64 80v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm128 0v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H208c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V272c0-8.8-7.2-16-16-16H336zM64 400v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H80c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H208zm112 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V400c0-8.8-7.2-16-16-16H336c-8.8 0-16 7.2-16 16z" /></svg>
                    {startDate} - {endDate}
                </span>
                <span className="price">{formattedPrice}</span>
            </div>
            <article className="card">
                <img
                    className="card__background"
                    src={vacation.imageUrl}
                    alt="Photo of vacation"
                />
                <div className="card__content | flow">
                    <div className="card__content--container | flow">
                        <h2 className="card__title">{vacation.destination}</h2>
                        <p className="card__description">
                            {vacation.description}
                        </p>
                    </div>
                    <button className="card__button" onClick={() => handleReadMoreClick(vacation.description)}>Read more</button>
                </div>
            </article>
        </div>
    );
}

export default VacationCard;
