/* eslint-disable @typescript-eslint/no-explicit-any */
//import { useState } from "react";
import Swal from "sweetalert2";
import { ButtonDelete, DeleteContainer } from "../../pages/dashboard/style";
import { Card, Info, Name, Points, Role, SubItem, SubRole, SubsList } from "./styles";
import { DeleteUser } from "../../API/APIRobozinho";

const UserCard = ({ user }: { user: any }) => {

    const handleDelete = async () => {
        try {
            const deleteUser = await DeleteUser(user.id);
            if (!deleteUser) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Erro ao deletar!',
                });
            };

            Swal.fire({
                icon: 'success',
                title: 'Deletado!',
                text: 'O usuário foi deletado com sucesso!',
            });
            window.location.reload();
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao deletar!',
            });
        }
    };


    return (
        <Card>
            <DeleteContainer
                className="delete"
            >
                <ButtonDelete 
                    onClick={() => {
                        Swal.fire({
                            title: 'Você quer deletar esse usuário?',
                            text: "Está é uma ação difícil de reverter!",
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'Sim, deletar!',
                            cancelButtonText: 'Cancelar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: 'Tem certeza?',
                                    text: 'O membro será marcado como deletado!',
                                    showCancelButton: true,
                                    confirmButtonText: 'Sim, deletar!',
                                    cancelButtonText: 'Cancelar',
                                    confirmButtonColor: '#d33',
                                    cancelButtonColor: '#3085d6',
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        handleDelete();
                                    }
                                }).finally(() => {
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Deletado!',
                                        text: 'O usuário foi deletado com sucesso!',
                                    });
                                });
                            }
                        });
                    }}
                >
                    <img src="trash.png" alt="lixeira" />
                </ButtonDelete>
            </DeleteContainer>
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