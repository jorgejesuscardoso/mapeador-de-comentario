/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, ButtonAdd, Container, ContainerD, DescriptionContainer, InputField, ModalContainer, ModalEditContainer, SpanTotal, SpanTotalpoints, StyledEmptyRow, Table, TableHeader, TableRow, TdEdit, Labels, ContainerE, ContainerResumo, SectionContainer, Title, InfoText, ButtonContainer, ActionButton, MainSection, DivToScrollTable } from "./style";
import { GetUsers, UpdateUser } from "../../API/APIRobozinho";
import { useNavigate } from "react-router-dom";
import { GetFromLocalStorage, SetTolocalStorage } from "../../utils/localstorage";

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

    const [contadora, setContadora] = useState(false);
    const [addSubs, setAddSubs] = useState(false);
    const [membersSubs, setMembersSubs] = useState('Luna A-1');
    const [membersBooks, setMembersBooks] = useState({
        title: '',
        wUrl: '',
    });
    const [changeBook, setChangeBook] = useState(false);
    const [changeRole, setChangeRole] = useState(false);
    const [role, setRole] = useState('member');

    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage.user.subRole === 'superadm') {
            setContadora(true);
        }
     getMembers();
    }, []);

    useEffect(() => {
        if (loadEdit) {
            const intervalId = setInterval(() => {
                setLoadEdit(false);
                setComfirmEdit(false);
                setEditPoints(false);
            }, 5000);
            
            return () => {
              clearInterval(intervalId);
            }
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

    const getMembers = async () => {
        const members = await GetUsers();

        SetTolocalStorage('members', members);
    
        if (members.length > 0) {
            setMembers(members);
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
    }
        

    return (
        <Container>
            <ContainerD>
                <ContainerE>
                <ContainerResumo>
                        <SpanTotal>👥 Total de membros: <strong>{members.length}</strong></SpanTotal>
                        
                        {members.length > 0 && (
                            <>
                                <SpanTotalpoints>🏆 Pontos não utilizados: <strong>{members.reduce((total, s) => total + s.points, 0).toLocaleString('pt-BR')}</strong></SpanTotalpoints>

                                <SpanTotalpoints>📊 Média de pontos por membro: <strong>{(members.reduce((total, s) => total + s.points, 0) / members.length).toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}</strong></SpanTotalpoints>

                                <SpanTotalpoints>🥇 Membro com mais pontos: <strong>{members.reduce((top, s) => (s.points > top.points ? s : top), members[0]).name}</strong></SpanTotalpoints>

                                <SpanTotalpoints>🥈 Membro com menos pontos: <strong>{members.reduce((top, s) => (s.points < top.points ? s : top), members[0]).name}</strong></SpanTotalpoints >

                                <SpanTotalpoints>📚 Total de obras cadastradas: <strong>{members.reduce((total, s) => total + s.books.length, 0)}</strong></SpanTotalpoints >

                                <SpanTotalpoints>👑 🛠️   Total de Administradores: <strong>{members.filter((s) => s.role === 'adm').length}</strong></SpanTotalpoints>
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
                                Aqui você pode cadastrar novos usuários ou gerenciar os existentes.
                            </InfoText>
                            <ButtonContainer>
                                <ActionButton onClick={() => navigate('/register')}>➕ Cadastrar Novo Membro</ActionButton>
                                <ActionButton onClick={() => navigate('/manager')}>⚙️ Gerenciar Membros</ActionButton>
                            </ButtonContainer>
                        </div>
                    </SectionContainer>
                    <DivToScrollTable>
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
                                    <th>Telefone</th>
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
                                                    if(!contadora) return;
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
                                                    if(!contadora) return;
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
                                                    if(!contadora) return;
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
                                                    if(!contadora) return;
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
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    if(!contadora) return;
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
                                                    if(!contadora) return;
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
                                                    if(!contadora) return;
                                                    setMembersBooks({
                                                        title: member.books[0].title,
                                                        wUrl: member.books[0].wUrl,
                                                    });
                                                    setChangeBook(true);
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
                                                        if(!contadora) return;
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
                                                    if(!contadora) return;
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
                                <option value="superadm">Super Administrador</option>
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
