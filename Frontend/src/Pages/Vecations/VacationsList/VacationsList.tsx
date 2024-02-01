import { useCallback, useEffect, useState } from "react";
import "./VacationsList.css";
import vacationsService from "../../../Services/VacationsService";
import notifyService from "../../../Services/NotifyService";
import VacationCard from "../../../Components/UI/VecationCard/VacationCard";
import VacationModel from "../../../Models/VacationModel";
import ReactPaginate from "react-paginate";
import { useSelector } from "react-redux";
import { RootState, store } from "../../../Redux/Store";
import { saveCurrentPage, savefilterBy } from "../../../Redux/VacationsSlice";
import { VacationsFilterModel } from "../../../Models/VacationsFilterModel";
import useVerifyLoggedIn from "../../../Hooks/useVerifyLoggedIn";
import useTitle from "../../../Hooks/useTitle";
import RoleModel from "../../../Models/RoleModel";
import { useNavigate } from "react-router-dom";
import ItemsCountDrop from "../../../Components/Common/ItemsCountDrop/ItemsCountDrop";
import Loader from "../../../Components/Common/Loader/Loader";

function VacationsList(): JSX.Element {
    useTitle('Vacations');
    const navigate = useNavigate();
    const isLoggedIn = useVerifyLoggedIn();

    const initalPage = useSelector((state: RootState) => state.vacations.currentPage);
    const initalFilterBy = useSelector((state: RootState) => state.vacations.filterBy);
    const userId = useSelector((state: RootState) => state.auth.user?.id) ?? 0;
    const roleId = useSelector((state: RootState) => state.auth.user?.roleId) ?? RoleModel.User;
    const itemsPerPage = useSelector((state: RootState) => state.vacations.itemsPerPage);
    const prevItemsPerPage = useSelector((state: RootState) => state.vacations.prevItemsPerPage);

    const [page, setPage] = useState(initalPage);
    const [vacations, setVacations] = useState<VacationModel[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [filterBy, setFilterBy] = useState(initalFilterBy);
    const [showDialog, setShowDialog] = useState(false);
    const [description, setDescription] = useState('');


    useEffect(() => {
        if (!isLoggedIn) return;
        (async () => {
            try {
                const vacations = await vacationsService.getVacations(page, itemsPerPage, prevItemsPerPage, userId, filterBy);
                setVacations(vacations)

                const clacTotalPages = Math.ceil(vacations[0]?.vacationsCount / itemsPerPage);
                setTotalPages(clacTotalPages);

                store.dispatch(saveCurrentPage(page));
                store.dispatch(savefilterBy(filterBy));
            } catch (error: any) {
                notifyService.error(error);
            }
        })()
    }, [page, itemsPerPage, userId, filterBy])

    const handleAddClick = () => {
        navigate('/vacations/add', { state: { page, filterBy } });
    }
    const handleFilterChange = (newFilterBy: number) => {
        setFilterBy(newFilterBy);
        setPage(1);
    }

    const handlePageClick = (page: { selected: number }) => {
        setPage(page.selected + 1);
    };

    const onReadMore = useCallback((description: string) => {
        setDescription(description)
        setShowDialog(true);
    }, [])

    if( !vacations.length ) return <Loader />

    return (
        <div className="VacationsList">
            <div className="header-list">
                <fieldset className="filters">
                    <label className="filter-item">
                        <span>All</span>
                        <input type="radio" name="filter" checked={filterBy === VacationsFilterModel.AllVacations} onChange={() => handleFilterChange(VacationsFilterModel.AllVacations)} />
                    </label>
                    {roleId === RoleModel.User &&
                        <label className="filter-item">
                            <span>Followed</span>
                            <input type="radio" name="filter" checked={filterBy === VacationsFilterModel.FollowedVacations} onChange={() => handleFilterChange(VacationsFilterModel.FollowedVacations)} />
                        </label>
                    }
                    <label className="filter-item">
                        <span>Future</span>
                        <input type="radio" name="filter" checked={filterBy === VacationsFilterModel.FutureVacations} onChange={() => handleFilterChange(VacationsFilterModel.FutureVacations)} />
                    </label>
                    <label className="filter-item">
                        <span>Active</span>
                        <input type="radio" name="filter" checked={filterBy === VacationsFilterModel.ActiveVacations} onChange={() => handleFilterChange(VacationsFilterModel.ActiveVacations)} />
                    </label>
                </fieldset>
                <ItemsCountDrop options={[6, 9, 12]} />
                {roleId === RoleModel.Admin &&
                    <div className="add">
                        <button className="cool" onClick={handleAddClick}>Add Vacation</button>
                    </div>}
            </div>
            <div className="container">
                {vacations.map(v => <VacationCard key={v.id} vacation={v} filteredPages={{ page, filterBy }} onReadMoreClick={onReadMore} />)}
            </div>

            {vacations[0]?.vacationsCount > itemsPerPage && <div>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="next >"
                    previousLabel="< previous"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={3}
                    pageCount={totalPages}
                    forcePage={page - 1}
                    renderOnZeroPageCount={null}
                    containerClassName="pagenation"
                    pageLinkClassName="page-num"
                    previousLinkClassName="page-num prev"
                    nextLinkClassName="page-num next"
                    activeLinkClassName="active"
                    disabledClassName="disabled"
                />
            </div>}

            <dialog open={showDialog} className="popup">
                <div className="popup-content">
                    <button onClick={() => setShowDialog(false)}>+</button>
                    <p>{description}</p>
                </div>
            </dialog>
        </div>
    );
}

export default VacationsList;
