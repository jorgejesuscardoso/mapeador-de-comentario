import { Button, CommentCard, CommentDate, CommentsContainer, CommentText, CommentUser, ContainerFindComments, Message } from "./style";
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

    const getComments = async () => {
        if (loading) return; // Impede chamadas simultâneas

        setLoading(true);
        setError(""); // Reseta erro antes de uma nova tentativa

        try {
            const data = await Robozinho();
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
            <Button onClick={getComments} disabled={loading}>
                {loading ? "Carregando..." : "Buscar Comentários"}
            </Button>
            {loading && <Message>Isso pode demorar um pouco.</Message>}
            {error && <Message>{error}</Message>}

            <CommentsContainer>
                {comments.length > 0 ? (
                comments.map((comment: Commentss, index: number) => (
                    <CommentCard key={index}>
                    <CommentUser>Usuário: <strong>{comment.usuario}</strong></CommentUser>
                    <CommentText>Comentário: {comment.comentario}</CommentText>
                    <CommentDate>Hora: {comment.dataFormatada}</CommentDate>
                    </CommentCard>
                ))
                ) : !loading && !error ? (
                <Message>Nenhum comentário disponível.</Message>
                ) : null}
            </CommentsContainer>
            </ContainerFindComments>
    );
};

export default FindComments;
