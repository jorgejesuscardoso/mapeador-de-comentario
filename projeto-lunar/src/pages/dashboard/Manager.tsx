/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { GetFromLocalStorage } from "../../utils/localstorage";
import { useEffect } from "react";

const ManagerMember = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            navigate('/');
            return;
        }
    }, []);
    
    return (
        <div>
            <h1>Em construção.</h1>
        </div>
    );
}

export default ManagerMember;