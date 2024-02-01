import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/Store";
import { useEffect } from "react";

function useVerifyLoggedIn(): boolean {
    const navigate = useNavigate();
    const isLoggedIn = useSelector((state: RootState) => !!state.auth.token);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return isLoggedIn;
}

export default useVerifyLoggedIn;
