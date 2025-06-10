// import { useEffect, useState } from "react";
import { AsideLeft, Container, ContainerD } from "./style";
// import { GetFromLocalStorage } from "../../utils/localstorage";
// import { useNavigate } from "react-router-dom";

// type PersonalData = {
//     name: string;
//     phone: string;
//     points: number;
//     role: string;
//     user: string;
//     userWtp: string;
// };

const Home = () => {
    // const navigate = useNavigate();
    // const [personalData, setPersonalData] = useState<PersonalData>({
    //     name: "",
    //     phone: "",
    //     points: 0,
    //     role: "",
    //     user: "",
    //     userWtp: "",
    // });

    // useEffect(() => {
    //     const getLocalStorage = GetFromLocalStorage('user');
    //     if (getLocalStorage === null) {
    //         navigate('/');
    //         return;
    //     }
    //     if (getLocalStorage) {
    //         const parsedPerson = getLocalStorage;
    //         setPersonalData(parsedPerson.user);
    //     }
    // }, []);
    
    return (
        <Container>
            <ContainerD>
                <AsideLeft>
                    <h1>Perfil</h1>
                    <h2>Olá,</h2>
                    <h3>Seja bem-vindo ao Projeto Lunar</h3>
                    <p>Você possui <b  id='points'>1.000.000.000</b> pontos</p>               

                </AsideLeft>

                <div>                    
                </div>
            </ContainerD>
        </Container>
    );
};

export default Home;