/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Button, ButtonAdd, Container, ContainerD, InputField, ModalContainer, ModalEditContainer, SpanTotal, SpanTotalpoints, StyledEmptyRow, Table, TableHeader, TableRow, TdEdit } from "./style";
import { GetAdms, GetUsers, UpdateAdm, UpdateUser, } from "../../API/APIRobozinho";

type PersonalData = {
    id: number;
    name: string;
    phone: string;
    points: number;
    age: number;
    role: string;
    user: string;
    books: [{ title: string }];
    userWtp: string;
    subs: [{ sub: { name: string } }];
};

const Members = () => {
    const [members, setMembers] = useState<PersonalData[]>([]);
    const [editPoints, setEditPoints] = useState(false);
    const [clientToEdit, setClientToEdit] = useState({
        id: 0,
        name: '',
        role: '',
        phone: '',
        age: 0,
        userWtp: '',
        user: '',
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



    useEffect(() => {        
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
                const pushPoints = async () => {
                const newPoints = {
                    points: parseInt(points),
                }
                if (clientToEdit.role === 'adm') {
                    await UpdateAdm(clientToEdit.id, newPoints);
                    getMembers();
                } else {
                    await UpdateUser(clientToEdit.id, newPoints);
                    getMembers();
                }
                    
                };

                pushPoints();                
                setEditPoints(false);
            }
        }
    }, [editPoints]);

    const getMembers = async () => {
        const membersAdm = await GetAdms();
        const membersUser = await GetUsers();
        
        const members = membersAdm.concat(membersUser);
        if (members.length > 0) {
            setMembers(members);
        }
    };   
    
    const handleEditName = async () => {
        const data = {
            name: dataToEdit.name,
        }
        
        if (clientToEdit.role === 'adm') {
            await UpdateAdm(clientToEdit.id, data);
            getMembers();
        } else {
            await UpdateUser(clientToEdit.id, data);
            getMembers();
        }
    }

    const handleEditPhone = async () => {
        const data = {
            phone: dataToEdit.phone,
        }
        if (clientToEdit.role === 'adm') {
            await UpdateAdm(clientToEdit.id, data);
            getMembers();
        } else {
            await UpdateUser(clientToEdit.id, data);
            getMembers();
        }
    }

    const handleEditAge = async () => {
        const data = {
            age: dataToEdit.age,
        }
        if (clientToEdit.role === 'adm') {
            await UpdateAdm(clientToEdit.id, data);
            getMembers();
        } else {
            await UpdateUser(clientToEdit.id, data);
            getMembers();
        }
    }

    const handleEditWtpd = async () => {
        const data = {
            userWtp: dataToEdit.userWtp,
        }
        if (clientToEdit.role === 'adm') {
            await UpdateAdm(clientToEdit.id, data);
            getMembers();
        } else {
            await UpdateUser(clientToEdit.id, data);
            getMembers();
        }
    }

    const handleEditUser = async () => {
        const data = {
            user: dataToEdit.user,
        }
        if (clientToEdit.role === 'adm') {
            await UpdateAdm(clientToEdit.id, data);
            getMembers();
        } else {
            await UpdateUser(clientToEdit.id, data);
            getMembers();
        }
    }

    return (
        <Container>
            <ContainerD>

                <SpanTotal>Total de membros: {members.length}</SpanTotal>
                {members.length > 0 && (
                    <SpanTotalpoints>
                        Total de Pontos não utilizados: {members.reduce((total, s) => total + s.points, 0).toLocaleString('pt-BR')}
                    </SpanTotalpoints>
                )}
                <Table>
                    <thead>
                        <TableHeader>
                            <th>Nome</th>
                            <th>Usuário</th>
                            <th>Função</th>
                            <th>Idade</th>
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
                                            setEditName(!editName);
                                            setClientToEdit({
                                                id: member.id,
                                                role: member.role,
                                                name: member.name,
                                                age: member.age,
                                                phone: member.phone,
                                                userWtp: member.userWtp,
                                                user: member.user,
                                            });
                                        }}                                    
                                    >
                                        {member.name}
                                    </TdEdit>
                                    <TdEdit
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setEditUser(!editUser);
                                            setClientToEdit({
                                                id: member.id,
                                                role: member.role,
                                                name: member.name,
                                                age: member.age,
                                                phone: member.phone,
                                                userWtp: member.userWtp,
                                                user: member.user,
                                            });
                                        }}
                                    >
                                        {member.user}
                                    </TdEdit>
                                    <td>
                                        {member.role.toUpperCase()}
                                    </td>
                                    <TdEdit
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setEditAge(!editAge);
                                            setClientToEdit({
                                                id: member.id,
                                                role: member.role,
                                                name: member.name,
                                                age: member.age,
                                                phone: member.phone,
                                                userWtp: member.userWtp,
                                                user: member.user,
                                            });
                                        }}
                                    >
                                        {member.age}
                                    </TdEdit>
                                    <TdEdit
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setEditPhone(!editPhone);
                                            setClientToEdit({
                                                id: member.id,
                                                role: member.role,
                                                name: member.name,
                                                age: member.age,
                                                phone: member.phone,
                                                userWtp: member.userWtp,
                                                user: member.user,
                                            });
                                        }}
                                    >
                                        {member.phone}
                                    </TdEdit>
                                    <TdEdit
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setEditWtpd(!editWtpd);
                                            setClientToEdit({
                                                id: member.id,
                                                role: member.role,
                                                name: member.name,
                                                age: member.age,
                                                phone: member.phone,
                                                userWtp: member.userWtp,
                                                user: member.user,
                                            });
                                        }}
                                    >                            
                                        {member.userWtp}
                                    </TdEdit>
                                    <td>{
                                        member.books
                                            .slice() // Cria uma cópia do array para evitar mutação
                                            .sort((a, b) => a.title.localeCompare(b.title)) // Ordena alfabeticamente
                                            .map((s, index) => (<li key={index}>{s.title}</li>))
                                        }
                                    </td>
                                    <td>
                                        <ButtonAdd                                            
                                            onClick={() => {
                                                setEditPoints(!editPoints);
                                                setClientToEdit({
                                                    id: member.id,
                                                    role: member.role,
                                                    name: member.name,
                                                    age: member.age,
                                                    phone: member.phone,
                                                    userWtp: member.userWtp,
                                                    user: member.user,
                                                });
                                            }}
                                        >
                                         {member.points.toLocaleString('pt-BR')}
                                        </ButtonAdd>
                                    </td>

                                    <td>{
                                        member.subs
                                        .slice() // Cria uma cópia do array para evitar mutação
                                        .sort((a, b) => a.sub.name.localeCompare(b.sub.name)) // Ordena alfabeticamente
                                        .map((s, index) => (<li key={index}>{s.sub.name}</li>))
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
                {editPoints && (
                <ModalContainer>
                    <h2>{clientToEdit.name}</h2>
                    <InputField
                        type="number"
                        placeholder="Pontos"
                        onChange={(e) => setPoints(e.target.value)}
                    />
                    <span>Esses pontos serão somados aos pontos ja existente.</span>

                    <div>
                        <Button onClick={() => setEditPoints(false)}>Cancelar</Button>
                        <Button                             
                            type="submit"
                            onClick={() => {
                            setComfirmEdit(true);
                            setEditPoints(false);
                            setLoadEdit(true);
                        }}>Salvar</Button>
                    </div>                    
                </ModalContainer>
                )}

                {editName && (
                    <ModalContainer>
                        <h2>{clientToEdit.name}</h2>
                        <InputField
                            type="text"
                            placeholder="Nome"
                            onChange={(e) => setDataToEdit({ name: e.target.value })}
                        />
                        <div>
                            <Button onClick={() => setEditName(false)}>Cancelar</Button>
                            <Button onClick={
                                () => {
                                    handleEditName();
                                    setEditName(false);
                                    setLoadEdit(true);
                                }
                            }>Salvar</Button>
                        </div>
                    </ModalContainer>
                )}

                {editPhone && (
                    <ModalContainer>
                        <h2>{clientToEdit.phone}</h2>
                        <InputField
                            type="text"
                            placeholder="Telefone"
                            onChange={(e) => setDataToEdit({ phone: e.target.value })}
                        />
                        <div>
                            <Button onClick={() => setEditPhone(false)}>Cancelar</Button>
                            <Button onClick={
                                () => {
                                    handleEditPhone();
                                    setEditPhone(false);
                                    setLoadEdit(true);
                                }
                            }>Salvar</Button>
                        </div>
                    </ModalContainer>
                )}

                {editAge && (
                    <ModalContainer>
                        <h2>{clientToEdit.age}</h2>
                        <InputField
                            type="number"
                            placeholder="Idade"
                            onChange={(e) => setDataToEdit({ age: e.target.value })}
                        />
                        <div>
                            <Button onClick={() => setEditAge(false)}>Cancelar</Button>
                            <Button onClick={
                                () => {
                                    handleEditAge();
                                    setEditAge(false);
                                    setLoadEdit(true);
                                }
                            }>Salvar</Button>
                        </div>
                    </ModalContainer>
                )}

                {editWtpd && (
                    <ModalContainer>
                        <h2>{clientToEdit.userWtp}</h2>
                        <InputField
                            type="text"
                            placeholder="Wattpad"
                            onChange={(e) => setDataToEdit({ userWtp: e.target.value })}
                        />
                        <div>
                            <Button onClick={() => setEditWtpd(false)}>Cancelar</Button>
                            <Button onClick={
                                () => {
                                    handleEditWtpd();
                                    setEditWtpd(false);
                                    setLoadEdit(true);
                                }
                            }>Salvar</Button>
                        </div>
                    </ModalContainer>
                )}

                {editUser && (
                    <ModalContainer>
                        <h2>{clientToEdit.user}</h2>
                        <InputField
                            type="text"
                            placeholder="Usuário"
                            onChange={(e) => setDataToEdit({ user: e.target.value })}
                        />
                        <div>
                            <Button onClick={() => setEditUser(false)}>Cancelar</Button>
                            <Button onClick={
                                () => {
                                    handleEditUser();
                                    setEditUser(false);
                                    setLoadEdit(true);
                                }
                            }>Salvar</Button>
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
            </ContainerD>
        </Container>
    );
};

export default Members;
