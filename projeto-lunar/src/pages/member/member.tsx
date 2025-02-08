import { useEffect, useState } from "react";
import { Container, ContainerD, SpanTotal, SpanTotalpoints, Table, TableHeader, TableRow } from "./style";
import { GetAdms } from "../../API/APIRobozinho";

type PersonalData = {
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

    useEffect(() => {
        const getMembers = async () => {
            const members = await GetAdms();
            if (members) {
                setMembers(members);
            }
        };
        
        getMembers();
    }, []);

    return (
        <Container>
            <ContainerD>
                <SpanTotal>Total de membros: {members.length}</SpanTotal>
                {members.length > 0 && (
                    <SpanTotalpoints>
                        Total de Pontos não utilizados: {members.reduce((total, s) => total + s.points, 0)}
                    </SpanTotalpoints>
                )}
                <h1>MEMBROS DO PROJETO</h1>
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
                            members.map((member, index) => (
                                <TableRow key={index}>
                                    <td>{member.name}</td>
                                    <td>{member.user}</td>
                                    <td>{member.role.toUpperCase()}</td>
                                    <td>{member.age}</td>
                                    <td>{member.phone}</td>
                                    <td>{member.userWtp}</td>
                                    <td>{member.books.map((s) => (<li>{s.title}</li>))}</td>
                                    <td>{member.points}</td>
                                    <td>{member.subs.map((s) => (<li>{s.sub.name}</li>))}</td>
                                </TableRow>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>Nenhum membro encontrado</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </ContainerD>
        </Container>
    );
};

export default Members;
