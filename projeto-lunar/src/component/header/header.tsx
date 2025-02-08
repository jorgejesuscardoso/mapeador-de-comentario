/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { HeaderContainer } from "./styke";
import { RemoveFromLocalStorage } from "../../utils/localstorage";
import { useEffect } from "react";

const HeaderLunar = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/");
        }
    }, []);
    return (
        <HeaderContainer>
            <img src="oficial-img.jpg" alt="" />
            <nav>
                <ul>
                    <li><Link to="/home">Home</Link></li>
                    <li><Link to="/bot">Robozinho</Link></li>
                    <li><Link to="/member">Lista de membros</Link></li>
                    <li><Link to="/subs">Subs</Link></li>
                    <li><Link to="/shop">Lojinha Lunar</Link></li>
                    <li><Link to="/dash">Painel de Controle</Link></li>
                </ul>
            </nav>

            <button
                onClick={() => RemoveFromLocalStorage("user")}
            >
                <a href="/">SAIR</a>
            </button>

        </HeaderContainer>
    )
};

export default HeaderLunar;