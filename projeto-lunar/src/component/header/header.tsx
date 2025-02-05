import { HeaderContainer } from "./styke";

const HeaderLunar = () => {
    return (
        <HeaderContainer>
            <img src="oficial-img.jpg" alt="" />
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/bot">Robozinho Lunar</a></li>
                    <li><a href="/member">Lista de membros</a></li>
                    <li><a href="/subs">Subs</a></li>
                    <li><a href="/shop">Lojinha Lunar</a></li>
                </ul>
            </nav>

            <button>
                <a href="/">SAIR</a>
            </button>

        </HeaderContainer>
    )
};

export default HeaderLunar;