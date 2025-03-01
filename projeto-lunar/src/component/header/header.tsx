/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from "react-router-dom";
import { HeaderContainer } from "./styke";
import { RemoveFromLocalStorage } from "../../utils/localstorage";
import { useEffect, useRef, useState } from "react";

const HeaderLunar = () => {
    const ref = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();
    const [floatMenu, setFloatMenu] = useState(false);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (!user) {
            navigate("/");
        }
    }, []);

    // Fecha o menu flutuante ao clicar fora dele
    useEffect(() => {
        if (!floatMenu) return; // Só adiciona o evento se o menu estiver aberto

        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setFloatMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [floatMenu]); // Esse efeito só roda quando floatMenu muda
        

    return (
        <HeaderContainer>
            <img
                className="logo"
                src="oficial-img.jpg"
                alt=""
            />
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

            {/* button para menu hamburguer */}
            <button
                className="menu-button"
                onClick={() => setFloatMenu(!floatMenu)}
            >
                <img src="menu5.png" alt="" />
            </button>

            {/* button para logout */}

            <button
                className="logout-button"
                onClick={() => RemoveFromLocalStorage("user")}
            >
                <Link to="/">
                    <img src="sair.png" alt="Logout" />
                </Link>
            </button>

            {
                floatMenu && (
                    <nav 
                        className={floatMenu ? "active" : ""}
                        ref={ref}
                    >
                        <ul>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/bot">Robozinho</Link></li>
                            <li><Link to="/member">Lista de membros</Link></li>
                            <li><Link to="/subs">Subs</Link></li>
                            <li><Link to="/shop">Lojinha Lunar</Link></li>
                            <li><Link to="/dash">Painel de Controle</Link></li>
                        </ul>
                    </nav>
                )
            }



        </HeaderContainer>
    )
};

export default HeaderLunar;