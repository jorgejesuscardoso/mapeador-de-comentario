import { useEffect, useState } from "react";
import { AsideLeft, Container, ContainerD } from "./style";
import { GetFromLocalStorage } from "../../utils/localstorage";

type PersonalData = {
    name: string;
    phone: string;
    points: number;
    role: string;
    user: string;
    userWtp: string;
};

const Home = () => {
    const [personalData, setPersonalData] = useState<PersonalData>({
        name: "",
        phone: "",
        points: 0,
        role: "",
        user: "",
        userWtp: "",
    });

    useEffect(() => {
        const person = GetFromLocalStorage("user");
        if (person) {
            const parsedPerson = JSON.parse(person);
            setPersonalData(parsedPerson.user);
        }
    }, []);
    return (
        <Container>
            <ContainerD>
                <AsideLeft>
                    <h1>Perfil</h1>
                    <h2>Olá, {personalData.name}</h2>
                    <h3>Seja bem-vindo ao Projeto Lunar</h3>
                    <p>Seu papel é: <b>{personalData.role.toUpperCase()}</b></p>
                    <p>Seu usuário neste sistema é: <b>{personalData.user}</b></p>
                    <p>Seu número de telefone é: <b>{personalData.phone}</b></p>
                    <p>Seu usuário no Wattpad é: <b>{personalData.userWtp}</b></p>
                    <p>Você possui <b  id='points'>{personalData.points}</b> pontos</p>               

                </AsideLeft>

                <div>
                    <h1><strong>EM CONSTRUÇÂO!</strong></h1>
                </div>
            </ContainerD>
        </Container>
    );
};

export default Home;