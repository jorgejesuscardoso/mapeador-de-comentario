import { Button, CommentCard, CommentDate, CommentsContainer, CommentText, CommentUser, ContainerFindComments, DivInputs, Inputs, Labels, Message, QtdeComments, Question, SearchContainer } from "./style";
import { Robozinho } from "../../API/APIRobozinho";
import { useState } from "react";

type Commentss = {
    usuario: string;
    comentario: string;
    dataFormatada: string;
};

const FindComments = () => {
    const [comments, setComments] = useState([]);  // Estado dos comentários
    const [loading, setLoading] = useState(false); // Estado de carregamento
    const [error, setError] = useState("");        // Estado para erros
    const [user, setUser] = useState("");          // Estado do usuário
    const [obra, setObra] = useState("");          // Estado da obra
    const [click, setClick] = useState(0);         // Estado do clique

    const getComments = async () => {
        if (loading) return; // Impede chamadas simultâneas

        setLoading(true);
        setError(""); // Reseta erro antes de uma nova tentativa

        try {
            const data = await Robozinho(user, obra, click);
            console.log(data.status);
            if (data.status === 404) {
                throw new Error("Usuário ou obra não encontrados.")
                
            };
            if (!data || data.length === 0) {
                throw new Error("Nenhum comentário encontrado.");
            }
            setComments(data);
        } catch (error) {
            setError("Erro ao buscar comentários.");
            return error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContainerFindComments>
            <SearchContainer>
                <DivInputs>
                    <Labels>
                        Insira um usuário:
                        <Inputs type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="Usuário Wattpad"
                        />
                    </Labels> 
                    <Labels>
                        Insira uma obra:
                        <Inputs type="text"
                            value={obra}
                            onChange={(e) => setObra(e.target.value)}
                            placeholder="URL da Obra Wattpad + Capítulo"
                        />
                    </Labels>
                </DivInputs>
                <QtdeComments>
                   <div id="comments">
                        

                        <span>
                            QTD de Comentários encontrados: <strong>{comments.length || 0 }</strong>
                        </span>
                        <br />
                        <Labels id="click">
                         
                        Insira a quantidade de cliques para carregar mais comentários:   
                        <Question 
                            src="question.png"
                            alt="Pergunta"
                            title="Aqui você pode definir quantos cliques o robô fará para carregar mais comentários. Ajuste conforme necessário. Por padrão, o robô fará 15 cliques. Então, se você deixar em branco ou 0, ele fará 15 cliques."
                        />
                        <Inputs type="number"
                            value={click}
                            onChange={(e) => setClick(Number(e.target.value))}
                            placeholder="Número de cliques"
                        />
                        </Labels>
                   </div>                    
                        
                    <Button onClick={getComments} disabled={loading}>
                        {loading ? "Carregando..." : "Buscar Comentários"}
                    </Button>
                </QtdeComments>

                <div>
                    {loading && <Message>Isso pode demorar um pouco.</Message>}
                    {error && <Message>{error}</Message>}
                </div>
            </SearchContainer>

            <CommentsContainer>
                {comments.length > 0 ? (
                comments.map((comment: Commentss, index: number) => (
                    <CommentCard key={index}>
                    <CommentUser><b>Usuário:</b> {comment.usuario}</CommentUser>
                    <CommentText><b>Comentário:</b> {comment.comentario}</CommentText>
                    <CommentDate>Hora: {comment.dataFormatada}</CommentDate>
                    </CommentCard>
                ))
                ) : !loading && !error ? (
                <div>
                    <Message>Robozinho econtrou um livro tão incrível que crashou.</Message>
                    <img src="robozin-crasado-P.png" alt="" />
                </div>
                ) : null}
            </CommentsContainer>
            </ContainerFindComments>
    );
};

export default FindComments;
