/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { GetFromLocalStorage } from "../../utils/localstorage";
import { useNavigate } from "react-router-dom";

const Subs = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            navigate('/');
            return;
        }
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", color: "blue" }}>
            <h1 style={{  color: "blue" }}>Em Construção</h1>
        </div>
    )
}

export default Subs;