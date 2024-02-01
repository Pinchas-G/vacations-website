import { Navigate, Route, Routes } from "react-router-dom";
import "./AppRoutes.css";
import PageNotFound from "../Pages/PageNotFound/PageNotFound";
import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import EditUser from "../Pages/Users/EditUser/EditUser";
import AddVacation from "../Pages/Vecations/AddVacation/AddVacation";
import VacationsList from "../Pages/Vecations/VacationsList/VacationsList";
import EditVacation from "../Pages/Vecations/EditVacation/EditVacation";
import About from "../Pages/About/About";
import VacationsReport from "../Pages/Vecations/VacationsReport/VacationsReport"

function AppRoutes(): JSX.Element {
    return (
        <div className="AppRoutes">
            <Routes>
                <Route path="/" element={<Navigate to="/vacations" />} />
                <Route path="/vacations" element={<VacationsList/>} />
                <Route path="/vacations/add" element={<AddVacation />} />
                <Route path="/vacations/edit/:id" element={<EditVacation />} />
                <Route path="/vacations/report" element={<VacationsReport />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                <Route path="/edit-user" element={<EditUser />} />

                <Route path="/about" element={<About />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
}

export default AppRoutes;
