import { Link } from "react-router-dom";
import { HeaderContainer } from "./styke";

const HeaderLunar = () => {
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
                </ul>
            </nav>

            <button>
                <a href="/">SAIR</a>
            </button>

        </HeaderContainer>
    )
};

export default HeaderLunar;