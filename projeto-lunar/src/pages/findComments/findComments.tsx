import { Button, CommentCard, CommentDate, CommentsContainer, CommentText, CommentUser, ContainerFindComments, DivInputs, ImageRobo, Inputs, Labels, Message, QtdeComments, SearchContainer } from "./style";
import { FindBooks, Robozinho } from "../../API/APIRobozinho";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { GetFromLocalStorage } from "../../utils/localstorage";

type Comment = {
    usuario: string;
    comentario: string;
    dataFormatada: string;
};

type Chapter = {
    href: string;
    title: string;
};

const FindComments = () => {
    //const navigate = useNavigate();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState("");
    const [obra, setObra] = useState("");
    const [clicks, setClicks] = useState(5);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [selectedChapter, setSelectedChapter] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const getBook = async () => {
        if (loading) return;

        setLoading(true);
        setError(null);
        setChapters([]);
        setComments([]);
        setSuccessMessage(null);

        if (!obra) {
            Swal.fire({ icon: "error", title: "Erro", text: "Insira uma URL de uma obra do Wattpad." });
            setLoading(false);
            return;
        }

        if (!obra.includes("https://www.wattpad.com")) {
            Swal.fire({ icon: "error", title: "Erro", text: "Insira uma URL válida do Wattpad." });
            setLoading(false);
            return;
        }

        Swal.fire({ icon: "info", title: "Aguarde", text: "Estamos buscando a obra. Isso pode demorar um pouco." });

        try {            
            const data = await FindBooks(obra.trim());
            if (!data || data.length === 0) {
                setError("Nenhuma obra encontrada.");
                return;
            }
            setChapters(data);
            setSuccessMessage("Livro encontrado com sucesso.");
        } catch (error) {
            setError("Erro ao buscar obra.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        if (loading) return;

        setLoading(true);
        setError(null);
        setComments([])

        if (!selectedChapter) {
            Swal.fire({ icon: "error", title: "Erro", text: "Selecione um capítulo." });
            setLoading(false);
            return;
        }

        if (!user) {
            Swal.fire({ icon: "error", title: "Erro", text: "Insira um usuário do Wattpad." });
            setLoading(false);
            return;
        }

        getComments();
    };

    const getComments = async () => {
        setSuccessMessage(null);
        try {
            const data = await Robozinho(user.trim(), selectedChapter.trim(), clicks);
            if (!data || data.length === 0) {
                throw new Error("Nenhum comentário encontrado.");
            }
            setComments(data);
        } catch (error) {
            console.error(error);
            setError("Erro ao buscar comentários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        //const getLocalStorage = GetFromLocalStorage('user');
        // if (getLocalStorage === null) {
        //     navigate('/');
        //     return;
        // }
    }, []);

    return (
        <ContainerFindComments>
            <SearchContainer>
                <DivInputs>
                    <Labels>
                        Insira um usuário:
                        <Inputs 
                            type="text"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            placeholder="Usuário Wattpad"
                        />
                    </Labels> 
                    <Labels>
                        Insira uma obra:
                        <Inputs 
                            type="text"
                            value={obra}
                            onChange={(e) => setObra(e.target.value)}
                            placeholder="URL da Obra no Wattpad"
                        />
                    </Labels>
                    <Labels>
                        Escolha um capítulo:
                        <Inputs 
                            id="select"
                            as="select"
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                        >
                            <option value="">Selecione um capítulo ({chapters.length})</option>
                            {chapters.map((chapter, index) => (
                                <option key={index} value={chapter.href}>{chapter.title}</option>
                            ))}
                        </Inputs>
                    </Labels>
                </DivInputs>

                <QtdeComments>
                    <div id="comments">
                        <span>QTD de Comentários encontrados: <strong>{comments.length}</strong></span>
                        <br />
                        <Labels id="click">
                            Insira a quantidade de tentativas:
                            <Inputs 
                                type="number"
                                value={clicks}
                                onChange={(e) => setClicks(Number(e.target.value))}
                                placeholder="Número de cliques"
                                min={1}
                                id="co"
                            />
                        </Labels>
                        <Button className='comentario' onClick={handleSearch} disabled={loading}>
                            {loading ? "Carregando..." : "Buscar Comentários"}
                        </Button>
                    </div> 
                    
                    <Button onClick={getBook} disabled={loading}>
                        {loading ? "Carregando..." : "Buscar Obra"}
                    </Button>  
                </QtdeComments>

                <ImageRobo>
                    {loading && <Message>Isso pode demorar um pouco.</Message>}
                    {error && <Message>{error}</Message>}          
                </ImageRobo>
            </SearchContainer>

            <CommentsContainer>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <CommentCard key={index}>
                            <div>
                                <CommentUser><b>Usuário:</b> {comment.usuario}</CommentUser>
                                <CommentText><b>Comentário:</b> {comment.comentario}</CommentText>
                            </div>
                            <CommentDate>Hora: {comment.dataFormatada}</CommentDate>
                        </CommentCard>
                    ))
                ) : successMessage ? (
                    <Message>{successMessage}</Message>
                ) : !loading && !error ? (
                    <div>
                        <br />
                        {/* <Message style={{color: 'green'}}>EM MANUNTENÇÂO</Message> */}
                        <br />
                        {/* <Message>Robozinho encontrou um livro tão incrível que crashou. </Message> */}
                        <img src="robozin-crasado-P.png" alt="Robo crashado" />
                    </div>
                ) : null}
            </CommentsContainer>
        </ContainerFindComments>
    );
};

export default FindComments;
