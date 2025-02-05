import { Container } from "./style";
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
        <Container>
            <button
                className="btn btn-primary"
                onClick={getComments}
                disabled={loading} // Desabilita o botão enquanto carrega
            >
                {loading ? "Carregando..." : "Buscar Comentários"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul>
                {comments.length > 0 ? (
                    comments.map((comment: Commentss) => (
                        <li key={comment.dataFormatada}>
                            <p><strong>{comment.usuario}:</strong></p>
                            <p>{comment.comentario}</p>
                        </li>
                    ))
                ) : !loading && !error ? (
                    <p>Nenhum comentário disponível.</p>
                ) : null}
            </ul>
        </Container>
    );
};

export default FindComments;
