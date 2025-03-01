/* eslint-disable @typescript-eslint/no-explicit-any */
//import { useState } from "react";
import { Card, Info, Name, Points, Role, SubItem, SubRole, SubsList } from "./styles";

const UserCard = ({ user }: { user: any }) => {
    return (
        <Card>
            <Name>{user.name}</Name>
            <Role role={user.role} className="role">
                {user.role === 'adm' ? 'Adm' : user.role === 'member' ? 'Membro' : 'SuperAdmin'}
            </Role>
            <Info>ID: <b>{user.id}</b></Info>
            <SubRole>SubRole: <b>{user.subRole || 'Nenhum'}</b></SubRole>
            <Info className="wtpd">User Wattpad: <b>{user.userWtp}</b></Info>
            <Info>User(app): <b>{user.user}</b></Info>
            <Info>Telefone: <b>{user.phone}</b></Info>
            <Info>Idade: <b>{user.age} anos</b></Info>

            <p>Pontos: <Points>{user.points.toLocaleString('pt-br')}</Points></p>

            {user.subs.length > 0 && (
                <>
                    <h4>Subs:</h4>
                    <SubsList>
                        {user.subs.map((sub: string, index: number) => (
                            <SubItem key={index}>{sub}</SubItem>
                        ))}
                    </SubsList>
                </>
            )}
        </Card>
    );
};

export default UserCard;