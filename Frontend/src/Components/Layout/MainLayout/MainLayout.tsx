import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import AppRoutes from '../../../Routes/AppRoutes';
import './MainLayout.css';
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../../Redux/Store';

function MainLayout(): JSX.Element {
    const currentTheme = useSelector((state: RootState) => state.settings.theme);

    return (
        <div className={"MainLayout " + currentTheme} >

            <header>
                <Header />
            </header>

            <main>
                <AppRoutes />
            </main>

            <footer>
                <Footer />
            </footer>

            <ReactNotifications />
        </div>
    )
}
export default MainLayout;