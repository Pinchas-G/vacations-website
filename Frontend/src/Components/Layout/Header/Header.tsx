import { NavLink } from "react-router-dom";
import AuthMenu from "../../Auth/AuthMenu/AuthMenu";
import "./Header.css";
import ThemeSwich from "../../Common/ThemeSwich/ThemeSwich";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Store";
import RoleModel from "../../../Models/RoleModel";

function Header(): JSX.Element {
    const roleId = useSelector((state: RootState) => state.auth.user?.roleId);
    return (
        <div className="Header">
            <div className="logo"></div>

            <div className="header-container">
                <section className="header-control">
                    <span className="theme-swich">
                        <ThemeSwich />
                    </span>
                    <AuthMenu />
                </section>
                <section>
                    <menu>
                        <li>
                            <NavLink to='/vacations' end>Vacations</NavLink>
                        </li>
                        {roleId === RoleModel.Admin &&
                            <li>
                                <NavLink to='/vacations/report'>Report</NavLink>
                            </li>}
                        <li>
                            <NavLink to='/about'>About</NavLink>
                        </li>
                    </menu>
                </section>
            </div>
        </div>
    );
}

export default Header;
