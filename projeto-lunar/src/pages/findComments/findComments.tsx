/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, CommentCard, CommentDate, CommentsContainer, CommentText, CommentUser, ContainerFindComments, DivInputs, ImageRobo, Inputs, Labels, Message, QtdeComments, SearchContainer } from "./style";
import { FindBooks, Robozinho } from "../../API/APIRobozinho";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";
// import { GetFromLocalStorage } from "../../utils/localstorage";

type Chapter = {
    href: string;
    title: string;
};

const FindComments = () => {
    //const navigate = useNavigate();
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState("");
    const [obra, setObra] = useState("");
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
            const data = await Robozinho(user.trim(), selectedChapter.trim());
            if (!data || data.length === 0) {
                throw new Error("Nenhum comentário encontrado.");
            }
            
            setComments(data);
            console.log(comments)
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

    function formatarDataComentario(dataISO: string): string {
        const dataComentario = new Date(dataISO);
        const agora = new Date();

        const diffMs = agora.getTime() - dataComentario.getTime(); // <- getTime() retorna number
        const diffHoras = diffMs / (1000 * 60 * 60);

        const hora = String(dataComentario.getHours()).padStart(2, '0');
        const minuto = String(dataComentario.getMinutes()).padStart(2, '0');

        if (diffHoras < 24) {
            return `Hoje às ${hora}:${minuto}`;
        } else if (diffHoras < 48 && agora.getDate() !== dataComentario.getDate()) {
            return `Ontem às ${hora}:${minuto}`;
        } else {
            const dia = String(dataComentario.getDate()).padStart(2, '0');
            const mes = String(dataComentario.getMonth() + 1).padStart(2, '0');
            const ano = dataComentario.getFullYear();
            return `${dia}/${mes}/${ano} às ${hora}:${minuto}`;
        }
    }

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
                            {chapters.length > 0 ? chapters.map((chapter, index) => (
                                <option key={index} value={chapter.href}>{chapter.title}</option>
                            )): ''}
                        </Inputs>
                    </Labels>
                </DivInputs>

                <QtdeComments>
                    <div id="comments">
                        <span>QTD de Comentários encontrados: <strong>{comments.length}</strong></span>
                        <br />
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
                    
                    comments.map((comment) => (
                        <CommentCard key={comment.resourceId}>
                            <div>
                                <CommentUser><b>Usuário:</b> {comment.user.name}</CommentUser>
                                <CommentText><b>Comentário:</b> {comment.text}</CommentText>
                            </div>
                            <CommentDate>{formatarDataComentario(comment.created)}</CommentDate>
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
