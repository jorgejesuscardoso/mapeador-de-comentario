/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GetFromLocalStorage } from "../../utils/localstorage";
import { GetUsersById, SearchUser } from "../../API/APIRobozinho";
import UserCard from "../../component/cards/cards";
import Swal from "sweetalert2";
import { ButtonM, CardContainer, ContainerM, Input, PaginationContainer, SearchContainer, SelectM, Title } from "./style";

type UserTypes = {
    id: number;
    name: string;
    user: string;
    phone: string;
};
const ManagerMember = () => {
    const navigate = useNavigate();

    const [searchType, setSearchType] = useState("ID");
    const [searchValue, setSearchValue] = useState("");
    const [member, setMember] = useState<UserTypes[]>([]);
    const [memberById, setMemberById] = useState({} as UserTypes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [qtdCards, setQtdCards] = useState(1);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            navigate('/');
        }
    }, []);

    // 🔍 Função para buscar um membro
    const handleSearch = async () => {
        setLoading(true);
        setError('');

        try {
            let foundMember = null;

            if (searchType === "id") {
                if (typeof searchValue !== "number") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'ID inválido! Digite um número.',
                    });
                    setLoading(false);
                    return;
                }
                foundMember = await GetUsersById(+searchValue);
                if (foundMember) {
                    setMemberById(foundMember);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Membro não encontrado!',
                    });
                }                
            }
            else {
                foundMember = await SearchUser(searchValue, qtdCards, page);
                if (foundMember) {
                    setMember(foundMember.users);
                    setTotalPages(foundMember.totalPages);
                    
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Membro não encontrado!',
                    });
                }
            }
            
        } catch (err) {
            console.error("Erro ao buscar funcionário:", err);
            setError("Erro ao buscar funcionário.");
        }

        setLoading(false);
    };

    useEffect(() => {
        if (page < totalPages) {
            handleSearch();
        }
    }, [page, qtdCards]); // 🔄 Atualiza quando a página ou a quantidade de cards muda
    
    const handleToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <ContainerM className="container">
            <Title>Gerenciar Funcionário</Title>

            {/* Seletor de Tipo de Busca */}
            <SearchContainer>
                <label>Buscar:</label>
                <SelectM value={searchType} onChange={(e) => setSearchType(e.target.value)}>
                    <option value="ID">Buscar por ID</option>
                    <option value="Word">Buscar por Palavra</option>
                </SelectM>


                {/* Input de Busca */}
                <Input
                    type="text"
                    placeholder={searchType === "ID" ? "Digite um ID" : "Digite a palavra inteira ou uma parte. (Ex: 'Anna', 'An', 'nna')"}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />

                <ButtonM 
                    onClick={() => {
                        setMember([]);
                        setMemberById({} as UserTypes);
                        handleSearch();
                    }}
                    disabled={loading}
                >
                    {loading ? "Buscando..." : "Buscar"}
                </ButtonM>
            </SearchContainer>

            {/* Quantidade cards por página */}
            <PaginationContainer>
                <label htmlFor="qtdCard"> 
                    Itens por Página:
                    
                </label>
                <Input
                    type="number"
                    id="qtdCard"
                    min="1"
                    value={qtdCards}
                    onChange={(e) => setQtdCards(+e.target.value)}
                    aria-label="Itens por página"
                />

                {/* Página */}
                <div
                    className="paginationBtn"
                >
                    <ButtonM 
                        onClick={() => setPage(prevPage => Math.max(prevPage - 1, 1))} 
                        disabled={page <= 1}>
                        Anterior
                    </ButtonM>

                    <ButtonM 
                        onClick={() => setPage(prevPage => prevPage + 1)} 
                        disabled={page >= totalPages}>
                        Próxima Página
                    </ButtonM>
                </div>
                <div
                    className="paginationInfo"
                >
                    <span>Página: {page} de {totalPages}</span>
                </div>
            </PaginationContainer>

            {/* Exibir loading, se estiver carregando */}
            {loading && <p>Carregando...</p>}

            {/* Exibir membros encontrado */}

           <CardContainer>
            {member.length > 0 ? (
                member.map((user: any) => (
                    <div key={user.id} className="card">                            
                        <UserCard user={user} />
                    </div>
                ))
            ) : memberById.id ? (
                <div key={memberById.id} className="card">
                    <UserCard user={memberById} />
                </div>
            ) : (
                <span>Nenhum membro encontrado</span>
            )}


                {/* Exibir erro, se houver */}
                {error && <p className="error">{error}</p>}



                {/* Exibir funcionário encontrado */}
           </CardContainer>
           {
            member.length > 0 ? (
                <PaginationContainer>
                
                    <div
                        className="paginationBtn"
                    >
                        <ButtonM 
                            onClick={() => {
                                setPage(prevPage => Math.max(prevPage - 1, 1));
                                handleToTop();
                            }} 
                            disabled={page <= 1}>
                            Anterior
                        </ButtonM>

                        <ButtonM 
                            onClick={() => {
                                setPage(prevPage => prevPage + 1);
                                handleToTop();
                            }} 
                            disabled={page >= totalPages}>
                            Próxima Página
                        </ButtonM>
                    </div>
                    <div
                        className="paginationInfo-2"
                    >
                        <span>Página: {page} de {totalPages}</span>
                    </div>
                </PaginationContainer>
            ) : ''
           }
            
        </ContainerM>
    );
};

export default ManagerMember;
