import data from "../../data/comentarios.json";
import { Card, Container } from "./style";

const Home = () => {

    return (
        <Container>
        <div>
            {data.map((c) => {
                return (
                    <Card>
                        <h2>User: {c.usuario}</h2>
                        <p>Comentário: {c.comentario}</p>
                        <span>Horário: {c.dataFormatada}</span>
                    </Card>
                );
            })}
        </div>
        </Container>
    );
};

export default Home;