import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetFromLocalStorage } from "../../utils/localstorage";

const Shop = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            navigate('/');
            return;
        }
    }, []);
    
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
           
            <h1 style={{  color: "blue" }}>Em Construção</h1>
        </div>
    );
};

export default Shop;