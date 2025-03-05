/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Button, ButtonAdd, Container, ContainerD, DescriptionContainer, InputField, ModalContainer, ModalEditContainer, SpanTotal, SpanTotalpoints, StyledEmptyRow, Table, TableHeader, TableRow, TdEdit, Labels, ContainerE, ContainerResumo, SectionContainer, Title, InfoText, ButtonContainer, ActionButton, MainSection, DivToScrollTable, PaginationContainer } from "./style";
import { GetALlUsersNoPagination, GetUsers, UpdateUser } from "../../API/APIRobozinho";
import { useNavigate } from "react-router-dom";
import { GetFromLocalStorage, SetTolocalStorage } from "../../utils/localstorage";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Swal from "sweetalert2";


type PersonalData = {
    id: number;
    name: string;
    phone: string;
    points: number;
    age: number;
    role: string;
    user: string;
    books: [{ title: string, wUrl: string }];
    userWtp: string;
    subs: [];
    subRole?: string;
};

const Members = () => {
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [members, setMembers] = useState<PersonalData[]>([]);
    const [editPoints, setEditPoints] = useState(false);
    const [operation, setOperation] = useState("add"); // Adicionar ou remover pontos
    const [clientToEdit, setClientToEdit] = useState({
        id: 0,
        name: '',
        role: '',
        phone: '',
        age: 0,
        userWtp: '',
        user: '',
        points: 0,
    });
    const [points, setPoints] = useState<string | null>(null);
    const [comfirmEdit, setComfirmEdit] = useState(false);
    const [loadEdit, setLoadEdit] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [editAge, setEditAge] = useState(false);
    const [editWtpd, setEditWtpd] = useState(false);
    const [editUser, setEditUser] = useState(false);
    const [dataToEdit, setDataToEdit] = useState({
        name: '',
        phone: '',
        age: 0,
        userWtp: '',
        user: '',
    } as any);

    const [superAdm, setSuperAdm] = useState(false);
    const [addSubs, setAddSubs] = useState(false);
    const [membersSubs, setMembersSubs] = useState('Sem Sub');
    const [membersBooks, setMembersBooks] = useState({
        title: '',
        wUrl: '',
    });
    const [changeBook, setChangeBook] = useState(false);
    const [changeRole, setChangeRole] = useState(false);
    const [role, setRole] = useState('member');
    const [pagination, setPagination] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [itens, setItens] = useState(10);
    const [allMembers, setAllMembers] = useState<PersonalData[]>([]);

    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            navigate('/');
            return;
        }
        if (getLocalStorage.user.role === 'superadm') {
            setSuperAdm(true);
        }

        
        AllUsers();
        getMembers();
    }, []);

    useEffect(() => {
        if (loadEdit) {            
            setLoadEdit(false);
            setComfirmEdit(false);
            setEditPoints(false);
            
            Swal.fire({
                icon: 'warning',
                title: 'Aguarde!',
                text: 'Salvando as alterações...',
                showConfirmButton: false,
                timer: 1500,
            });
        }

        
        
    }, [loadEdit]);

    useEffect(() => {
        if (comfirmEdit) {   
                     
            if (points !== null) {
                const operate = operation === "add" ? parseInt(points) : -parseInt(points);
                const pushPoints = async () => {
                const newPoints = {
                    points: clientToEdit.points + operate,
                }
                
                await UpdateUser(clientToEdit.id, newPoints);
                getMembers();
                    
                };

                pushPoints();                
                setEditPoints(false);
            }
        }
    }, [editPoints]);

    useEffect(() => {
        if (pagination < totalPages) {
            getMembers();
        }
    }, [pagination, itens]);
        
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setAddSubs(false);
                setChangeRole(false);
                setChangeBook(false);
                setEditAge(false);
                setEditName(false);
                setEditPhone(false);
                setEditPoints(false);
                setEditUser(false);
                setEditWtpd(false);
                setLoadEdit(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const getMembers = async () => {
        const members = await GetUsers(itens, pagination);

        SetTolocalStorage('members', members.users);
        if (members.users.length > 0) {
            setMembers(members.users);
            setTotalPages(members.totalPages);
        }
    }; 

    const AllUsers = async () => {
        try {
            const users = await GetALlUsersNoPagination();
            if (users.status === 401) {
                Swal.fire({
                    icon: 'error',
                    title: 'ops...',
                    text: 'Suas credenciais expiraram! Faça login novamente.',
                });
                navigate('/');
                return;
            }
            if (users.length === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Ops...',
                    text: 'Nenhum usuário encontrado!',
                });
                return;
            }
            setAllMembers(users);
            return users;
        } catch (error) {
            console.log(error);
        }
    };
    
    const handleEditName = async () => {
        const data = {
            name: dataToEdit.name,
        }
        
        await UpdateUser(clientToEdit.id, data);
        getMembers();
        
    }

    const handleEditPhone = async () => {
        const data = {
            phone: dataToEdit.phone,
        }
        await UpdateUser(clientToEdit.id, data);
        getMembers();
    }

    const handleEditAge = async () => {
        const data = {
            age: dataToEdit.age,
        }
        
        await UpdateUser(clientToEdit.id, data);
        getMembers();
    }

    const handleEditWtpd = async () => {
        const data = {
            userWtp: dataToEdit.userWtp,
        }
        await UpdateUser(clientToEdit.id, data);
        getMembers();
    }

    const handleEditUser = async () => {
        const data = {
            user: dataToEdit.user,
        }
        await UpdateUser(clientToEdit.id, data);
        getMembers();
    }

    const handleEditSubs = async () => {
        const data = {
            subs: [membersSubs],
        };
    
        await UpdateUser(clientToEdit.id, data);
        getMembers();
    };

    const hanbleChangeRole = async () => {
        const data = {
            role
        };
    
        await UpdateUser(clientToEdit.id, data);
        getMembers();
    };

    const generatePDF = (members: any[]) => {
        const doc = new jsPDF();
    
        // Centraliza o título
        const title = "Lista de Membros";
        const pageWidth = doc.internal.pageSize.getWidth();
        const titleX = pageWidth / 2;

        doc.setFontSize(16);
        doc.text(title, titleX, 10, { align: "center" });
    
        const tableColumn = ["ID", "Nome", "Wattpad", "Pontos", "Subs"];
        const tableRows: any[] = [];
    
        members.forEach(member => {
            const memberData = [
                member.id,
                member.name,
                member.userWtp,
                member.points,
                member.subs.join(', ')
            ];
            tableRows.push(memberData);
        });
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { 
                halign: 'center', // Centraliza todas as células
                valign: 'middle', // Centraliza verticalmente
            },
            headStyles: {
                halign: 'center', // Centraliza os cabeçalhos
                fillColor: [0, 102, 204], // Azul escuro para o cabeçalho
                textColor: [255, 255, 255], // Texto branco
                fontStyle: 'bold'
            },
            columnStyles: {
                0: { halign: 'center' }, // ID centralizado
                1: { halign: 'center' }, // Nome centralizado
                2: { halign: 'center' }, // Email centralizado
                3: { halign: 'center' }, // Cargo centralizado
            }
        });
    
        doc.save('Membros Projeto Lunar.pdf');
    };

    return (
        <Container ref={ref}>
            <ContainerD>
                <ContainerE>
                <ContainerResumo>
                        <SpanTotal>👥 Total de membros: <strong>{allMembers.length}</strong></SpanTotal>
                        
                        {allMembers.length > 0 && (
                            <>
                                <SpanTotalpoints>🏆 Pontos não utilizados: <strong>{allMembers.reduce((total, s) => total + s.points, 0).toLocaleString('pt-BR')}</strong></SpanTotalpoints>

                                <SpanTotalpoints>📊 Média de pontos por membro: <strong>{(allMembers.reduce((total, s) => total + s.points, 0) / allMembers.length).toLocaleString('pt-BR', {})}</strong></SpanTotalpoints>

                                <SpanTotalpoints>
                                🥇 Membro com mais pontos: <strong>
                                {allMembers.reduce((top, s) => (s.points > top.points ? s : top), allMembers[0]).name}
                                </strong>
                            </SpanTotalpoints>

                            <SpanTotalpoints>
                                🚫 Membro com menos pontos: <strong>
                                {allMembers.reduce((low, s) => (s.points < low.points ? s : low), allMembers[0]).name} 
                                </strong>
                            </SpanTotalpoints>

                                <SpanTotalpoints>📚 Total de obras cadastradas: <strong>{allMembers.reduce((total, s) => total + s.books.length, 0)}</strong></SpanTotalpoints >

                                <SpanTotalpoints>👑 🛠️   Total de Administradores: <strong>{allMembers.filter((s) => s.role === 'adm' || s.role === 'superadm').length}</strong></SpanTotalpoints>
                            </>
                        )}
                    </ContainerResumo>
                    <DescriptionContainer>
                        <h2>🚀 Painel de Membros do Projeto Lunar 🌙</h2>
                        <p>
                            A tabela abaixo mostra todos os membros do <span className="highlight">Projeto Lunar</span>.  
                            Aqui você pode visualizar diversas informações e até mesmo editar alguns campos! 📝✨  
                        </p>
                            <p>
                                ✅ Você pode alterar: <span className="highlight">Nome</span>,  
                                <span className="highlight"> Nome de Usuário (Sistema)</span>,  
                                <span className="highlight"> Nome de Usuário (Wattpad)</span>,  
                                <span className="highlight"> Idade</span>,  
                                <span className="highlight"> Telefone</span> e  
                                <span className="highlight"> Pontos</span>,
                                <span className="highlight"> ETC...</span>  ⭐.  
                            </p>
                            <p>
                                🔒 <span className="highlight">Atenção:</span> Apenas administradores com permissão especial, podem usar esse painel!  
                            </p>
                            <p>🖱️ Para editar, basta clicar no campo desejado e um popup será aberto! 🎯</p>
                    </DescriptionContainer>
                    </ContainerE> 
                <MainSection>              
                    <SectionContainer>                    
                        
                        <div>
                            <Title>👥 Gerenciamento de Membros</Title>
                            
                            <InfoText>
                                Para editar um membro, clique no campo desejado na tabela abaixo. </InfoText>
                            <InfoText>
                                Para deletar um membro, clique no botão 'Gerenciar Membros'. Lá você poderá pesquiar e deletar.
                            </InfoText>
                            <ButtonContainer>
                                <ActionButton onClick={() => navigate('/register')}>➕ Cadastrar Novo Membro</ActionButton>
                                <ActionButton onClick={() => navigate('/manager')}>⚙️ Gerenciar Membros</ActionButton>
                            </ButtonContainer>
                        </div>
                    </SectionContainer>
                    <DivToScrollTable>
                       
                        <PaginationContainer>
                            <div
                                className="paginationContent"
                            > 
                                <Button
                                    className="download-pdf"
                                    onClick={() => generatePDF(allMembers)}
                                >
                                    Baixar PDF
                                </Button>  
                                
                            </div>
                            <div
                                className="paginationInfo"
                            >
                                <div>
                                    <label htmlFor="itens">Itens por tabela:</label>
                                    <input
                                        type="number"
                                        id="itens"
                                        min="1"
                                        value={itens}
                                        onChange={(e) => setItens(+e.target.value)}
                                    />
                                </div>
                                <span>Tabela {pagination} de {totalPages}</span>
                            </div>
                        </PaginationContainer>
                        <Table>
                            <thead>
                                <TableHeader>
                                    <th>Nome</th>
                                    <th
                                        className="hide-on-mobile"
                                    >
                                        Usuário
                                    </th>
                                    <th
                                        className="hide-on-mobile"
                                    >
                                        Função
                                    </th>
                                    <th
                                        className="hide-on-mobile"
                                    >
                                        Idade
                                    </th>
                                    <th
                                        className="hide-on-mobile"
                                    >
                                        Telefone
                                    </th>
                                    <th>Wattpad</th>
                                    <th>Obras</th>
                                    <th>Pontos</th>
                                    <th>Sub</th>
                                </TableHeader>
                            </thead>
                            <tbody>
                                {members.length > 0 ? (
                                    members
                                    .slice() // Cria uma cópia do array para evitar mutação
                                    .sort((a, b) => a.name.localeCompare(b.name)) // Ordena alfabeticamente pela coluna name
                                    .map((member, index) => (
                                        <TableRow key={index}>
                                            <TdEdit                                       
                                                
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setEditName(!editName);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                
                                                        points: member.points,
                                                    });
                                                    // fechar todas as abas de edição
                                                    setEditAge(false);
                                                    setEditPhone(false);
                                                    setEditWtpd(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setAddSubs(false);
                                                    setChangeRole(false);
                                                    setChangeBook(false);
                                                }}                                    
                                            >
                                                {member.name}
                                            </TdEdit>
                                            <TdEdit
                                                className="hide-on-mobile"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setEditUser(!editUser);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                
                                                        points: member.points,
                                                    });
                                                    setEditName(false);
                                                    setEditAge(false);
                                                    setEditPhone(false);
                                                    setEditWtpd(false);
                                                    setEditPoints(false);
                                                    setAddSubs(false);
                                                    setChangeRole(false);
                                                    setChangeBook(false);
                                                }}
                                            >
                                                {member.user}
                                            </TdEdit>
                                            <td
                                                className="hide-on-mobile"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setChangeRole(!changeRole);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                
                                                        points: member.points,
                                                    });
                                                    setEditName(false);
                                                    setEditAge(false);
                                                    setEditPhone(false);
                                                    setEditWtpd(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setAddSubs(false);
                                                    setChangeBook(false);
                                                }}
                                            >
                                                {member.role.toUpperCase()}
                                            </td>
                                            <TdEdit
                                                className="hide-on-mobile"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setEditAge(!editAge);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                
                                                        points: member.points,
                                                    });
                                                    setEditName(false);
                                                    setEditPhone(false);
                                                    setEditWtpd(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setAddSubs(false);
                                                    setChangeRole(false);
                                                    setChangeBook(false);
                                                }}
                                            >
                                                {member.age}
                                            </TdEdit>
                                            <TdEdit                 
                                                className="hide-on-mobile"                               
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setEditPhone(!editPhone);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                
                                                        points: member.points,
                                                    });
                                                    setEditName(false);
                                                    setEditAge(false);
                                                    setEditWtpd(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setAddSubs(false);
                                                    setChangeRole(false);
                                                    setChangeBook(false);
                                                }}
                                            >
                                                {member.phone}
                                            </TdEdit>
                                            <TdEdit      
                                                                                          
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setEditWtpd(!editWtpd);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                
                                                        points: member.points,
                                                    });
                                                    setEditName(false);
                                                    setEditAge(false);
                                                    setEditPhone(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setAddSubs(false);
                                                    setChangeRole(false);
                                                    setChangeBook(false);
                                                }}
                                            >                            
                                                {member.userWtp}
                                            </TdEdit>
                                            <td                                                
                                                className="column-scroll"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setEditName(false);
                                                    setEditAge(false);
                                                    setEditPhone(false);
                                                    setEditWtpd(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setChangeRole(false);
                                                    setAddSubs(false);
                                                }}
                                            >{
                                                member.books
                                                    .slice() // Cria uma cópia do array para evitar mutação
                                                    .sort((a, b) => a.title.localeCompare(b.title)) // Ordena alfabeticamente
                                                    .map((s, index) => (<li key={index}>{s.title}</li>))
                                                }
                                            </td>
                                            <td>
                                                <ButtonAdd                                            
                                                    onClick={() => {
                                                        if(!superAdm) return;
                                                        setEditPoints(!editPoints);
                                                        setClientToEdit({
                                                            id: member.id,
                                                            role: member.role,
                                                            name: member.name,
                                                            age: member.age,
                                                            phone: member.phone,
                                                            userWtp: member.userWtp,
                                                            user: member.user,                                                    
                                                            points: member.points,
                                                        });
                                                        setEditName(false);
                                                        setEditAge(false);
                                                        setEditPhone(false);
                                                        setEditWtpd(false);
                                                        setEditUser(false);
                                                        setChangeRole(false);
                                                        setAddSubs(false);
                                                        setChangeBook(false);
                                                    }}
                                                >
                                                {member.points.toLocaleString('pt-BR')}
                                                </ButtonAdd>
                                            </td>

                                            <td
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!superAdm) return;
                                                    setAddSubs(!addSubs);
                                                    setClientToEdit({
                                                        id: member.id,
                                                        role: member.role,
                                                        name: member.name,
                                                        age: member.age,
                                                        phone: member.phone,
                                                        userWtp: member.userWtp,
                                                        user: member.user,                                                    
                                                        points: member.points,
                                                    });
                                                    setEditName(false);
                                                    setEditAge(false);
                                                    setEditPhone(false);
                                                    setEditWtpd(false);
                                                    setEditUser(false);
                                                    setEditPoints(false);
                                                    setChangeRole(false);
                                                    setChangeBook(false);
                                                }}                                        
                                            >{
                                                member.subs
                                                .slice() // Cria uma cópia do array para evitar mutação
                                                .sort((a, b) => a + b) // Ordena alfabeticamente
                                                .map((s, index) => (<li key={index}>{s}</li>))
                                            }</td>
                                        </TableRow>
                                    ))
                                ) : (
                                    <StyledEmptyRow>
                                        <td colSpan={6} className='colspan'>Nenhum membro encontrado</td>
                                    </StyledEmptyRow>
                                )}
                            </tbody>
                        </Table>
                        <PaginationContainer>
                            <div
                                className="paginationContent"
                            > 
                               
                                <div
                                    className="paginationBtn"
                                >
                                    <button
                                        onClick={() => {
                                            if (pagination > 1) {
                                                setPagination(pagination - 1);
                                            }
                                        }}
                                        disabled={pagination <= 1}
                                    >
                                        <img src="prev.png" alt="Tabela anterior" />
                                    </button>

                                    <div                                    
                                        className="paginationInput"
                                    >
                                        Tabela <input 
                                            type="text"
                                            value={pagination}
                                            onChange={(e) => setPagination(+e.target.value)}
                                         /> 
                                        de <b>{totalPages}</b>
                                        
                                    </div>


                                    <button
                                        onClick={() => {
                                            if (pagination < totalPages) {
                                                setPagination(pagination + 1);
                                            }
                                        }}
                                        disabled={pagination >= totalPages}
                                    >
                                        <img src="next.png" alt="Própxima tabela" />
                                    </button>
                                </div>
                            </div>
                            <div
                                className="paginationInfo"
                            >
                            </div>
                        </PaginationContainer>
                    </DivToScrollTable>
                </MainSection>    
                    {editPoints && (
                    <ModalContainer>
                        <h2>{clientToEdit.name}</h2>
                        <Labels>
                            Escolha a operação:
                            <select value={operation} onChange={(e) => setOperation(e.target.value)}>
                                <option value="add">➕ Adicionar</option>
                                <option value="remove">➖ Remover</option>
                            </select>
                        </Labels>
                        <InputField
                            type="number"
                            placeholder="Pontos"
                            onChange={(e) => setPoints(e.target.value)}
                        />
                        <span>🔄 Esses pontos serão {operation === "remove" ? "removidos de" : "adicionados aos"} pontos existentes.</span>
                        <span>🔒 Essa ação é totalmente REVERSÍVEL! Tem certeza que deseja continuar?</span>

                        <div>
                            <Button                             
                                type="submit"
                                onClick={() => {
                                setComfirmEdit(true);
                                setEditPoints(false);
                                setLoadEdit(true);
                            }}> Salvar</Button>                        
                            <Button onClick={() => setEditPoints(false)}>Cancelar</Button>
                        </div>                    
                    </ModalContainer>
                    )}

                    {editName && (
                        <ModalContainer>
                            <h2>Editando o nome de: </h2>
                            <h3>{clientToEdit.name}</h3>
                            <InputField
                                type="text"
                                placeholder="Nome"
                                onChange={(e) => setDataToEdit({ name: e.target.value })}
                            />
                            <div>
                                <Button onClick={
                                    () => {
                                        handleEditName();
                                        setEditName(false);
                                        setLoadEdit(true);
                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setEditName(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {editPhone && (
                        <ModalContainer>
                            <h2>Editando o telefone de :</h2>
                            <h3>{clientToEdit.name}</h3>
                            <h3>{clientToEdit.phone}</h3>
                            <InputField
                                type="text"
                                placeholder="Telefone"
                                onChange={(e) => setDataToEdit({ phone: e.target.value })}
                            />
                            <div>
                                <Button onClick={
                                    () => {
                                        handleEditPhone();
                                        setEditPhone(false);
                                        setLoadEdit(true);
                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setEditPhone(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {editAge && (
                        <ModalContainer>
                            <h2>Editando a idade de:</h2>
                            <h3>{clientToEdit.name}</h3>
                            <InputField
                                type="number"
                                placeholder="Idade"
                                onChange={(e) => setDataToEdit({ age: e.target.value })}
                            />
                            <div>
                                <Button onClick={
                                    () => {
                                        handleEditAge();
                                        setEditAge(false);
                                        setLoadEdit(true);
                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setEditAge(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {editWtpd && (
                        <ModalContainer>
                            <h2>Editando o usuário do Wattpad de:</h2>
                            <h3>{clientToEdit.name}</h3>
                            <h2>Usuário atual é:</h2>
                            <h3>{clientToEdit.userWtp}</h3>
                            <InputField
                                type="text"
                                placeholder="Wattpad"
                                onChange={(e) => setDataToEdit({ userWtp: e.target.value })}
                            />
                            <div>
                                <Button onClick={
                                    () => {
                                        handleEditWtpd();
                                        setEditWtpd(false);
                                        setLoadEdit(true);
                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setEditWtpd(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {editUser && (
                        <ModalContainer>
                            <h2>Editando o usuário de:</h2>
                            <h3>{clientToEdit.name}</h3>
                            <h2>Usuário atual é:</h2>
                            <h3>{clientToEdit.user}</h3>
                            <InputField
                                type="text"
                                placeholder="Usuário"
                                onChange={(e) => setDataToEdit({ user: e.target.value })}
                            />
                            <div>
                                <Button onClick={
                                    () => {
                                        handleEditUser();
                                        setEditUser(false);
                                        setLoadEdit(true);
                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setEditUser(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {loadEdit && (
                        <ModalEditContainer>
                            <div>
                                <h2>Salvando! Aguarde um momento.</h2>
                            </div>
                        </ModalEditContainer>
                    )}

                    {addSubs && (
                        <ModalContainer>
                            <h2>Adicionando Subs para:</h2>
                            <h3>{clientToEdit.name}</h3>
                            <InputField
                                as='select'
                                placeholder="Sub"
                                onChange={(e) => setMembersSubs(e.target.value)}
                            >
                                <option value="Sem Sub">Sem sub</option>
                                <option value="Luna A-1">Luna A-1</option>
                                <option value="Luna A-2">Luna A-2</option>
                                <option value="Luna A-3">Luna A-3</option>
                                <option value="Luna A-4">Luna A-4</option>
                                <option value="Luna A-5">Luna A-5</option>
                                <option value="Luna A-6">Luna A-6</option>
                                <option value="Luna A-7">Luna A-7</option>
                                <option value="Luna A-8">Luna A-8</option>
                                <option value="Luna A-9">Luna A-9</option>
                                <option value="Luna A-10">Luna A-10</option>
                            </InputField>
                            <div>
                                <Button onClick={
                                    () => {
                                        handleEditSubs();
                                        setAddSubs(false);
                                        setLoadEdit(true);

                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setAddSubs(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {changeRole && (
                        <ModalContainer>
                            <h2>Alterando a função de:</h2>
                            <h3>{clientToEdit.name}</h3>
                            <InputField
                                as='select'
                                placeholder="Função"
                                onChange={(e) => setRole(e.target.value)}
                            >
                                <option value="member">Membro</option>
                                <option value="adm">Administrador</option>
                                <option value="superAdm">Super Administrador</option>
                            </InputField>
                            <div>
                                <Button onClick={
                                    () => {
                                        hanbleChangeRole();
                                        setChangeRole(false);
                                        setLoadEdit(true);

                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setChangeRole(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}

                    {changeBook && (
                        <ModalContainer>
                            <h2>Alterando a obra de:</h2>
                            <h3>{clientToEdit.name}</h3>
                            <h2>Obra atual é:</h2>
                            <h3>{membersBooks.title}</h3>
                            <InputField
                                type="text"
                                placeholder="Alterar o nome da obra"
                                onChange={(e) => setMembersBooks({ title: e.target.value, wUrl: membersBooks.wUrl })}
                            />
                            <InputField
                                type="text"
                                placeholder="Alterar o link da obra"
                                onChange={(e) => setMembersBooks({ title: membersBooks.title, wUrl: e.target.value })}
                            />
                            <span>
                                Se desejar adicionar uma obra diferente, preencha os campos acima e clique em salvar. A obra será alterada.
                            </span>
                            <div>
                                <Button onClick={
                                    () => {
                                        setChangeBook(false);
                                    }
                                }>Salvar</Button>
                                <Button onClick={() => setChangeBook(false)}>Cancelar</Button>
                            </div>
                        </ModalContainer>
                    )}                    
                    
            </ContainerD>
        </Container>
    );
};

export default Members;
