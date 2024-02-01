import useTitle from "../../Hooks/useTitle";
import "./PageNotFound.css";
import pageNotFound from '../../Assets/page-not-found.gif';

function PageNotFound(): JSX.Element {

    useTitle('Page Not Found');
    
    return (
        <div className="PageNotFound">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <img src={pageNotFound} />
        </div>
    );
}

export default PageNotFound;
