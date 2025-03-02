/* eslint-disable @typescript-eslint/no-explicit-any */
//import { useState } from "react";
import Swal from "sweetalert2";
import { ButtonDelete, DeleteContainer } from "../../pages/dashboard/style";
import { Card, Info, InfoBtn, InfoBtnContainer, ModalEditBookContainer, Name, Points, Role, SelectedWorkContainer, SubItem, SubRole, SubsList, WorkSelectedContainer } from "./styles";
import { DeleteUser } from "../../API/APIRobozinho";
import { useState } from "react";
import { CreateBook, DeleteBook, UpdateBook } from "../../API/Api.Books";


const UserCard = ({ user }: { user: any }) => {

    const [newBook, setNewBook] = useState({
        id: 0,
        title: '',
        wUrl: '',
        memberId: +user.id,
    });
    const [updateBook, setUpdateBook] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [isCreateBook, setIsCreateBook] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [workList] = useState(user.books);
    const [workSelected, setWorkSelected] = useState(false);

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

    const update = async () => {
        try {
            const urlStart = newBook.wUrl.startsWith('https://www.wattpad.com/');

            if (typeof newBook.memberId !== 'number' || newBook.memberId === 0) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'ID inválido! Digite um número. Não pode ser 0.',
                });
                return;
            }

            if (!urlStart) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Link inválido! Insira um link do Wattpad.',
                });
                return;
            }

            const addBook = await UpdateBook(newBook.id, newBook);
            
            if (!addBook.id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Erro ao atualizar!',
                });
            };

            Swal.fire({
                icon: 'success',
                title: 'Atualizado!',
                text: 'O usuário foi atualizado com sucesso!',
            });

            return addBook;
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao atualizar!',
            }); 
        }
    };

    const createBooks = async () => {
        try {
            const urlStart = newBook.wUrl.startsWith('https://www.wattpad.com/');
            if (!urlStart) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Link inválido! Insira um link do Wattpad.',
                });
                return;
            }

            const data =
            {
                title: newBook.title,
                wUrl: newBook.wUrl,
                memberId: +user.id,
            };

            console.log(data);

            Swal.fire({
                icon: 'warning',
                title: 'Criando...',
                text: 'Aguarde um momento!',
                showConfirmButton: false,
                timer: 1500,                
            });

            const response = await CreateBook(data);

            if (!response.id) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Erro ao criar!',
                });
            }
            Swal.fire({
                icon: 'success',
                title: 'Criado!',
                text: 'O obra cadastrada com sucesso!',
            });

            return response;

        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao criar!',
            });
        }
    };

    const DeleteBooks = async () => {
        try {
            const deleteBook = await DeleteBook(newBook.id);
            if (!deleteBook) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Erro ao deletar!',
                });
            };

            Swal.fire({
                icon: 'success',
                title: 'Deletado!',
                text: 'O obra foi deletada com sucesso!',
            });

            return deleteBook;
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

            <InfoBtnContainer>
                <InfoBtn
                    onClick={() => setUpdateBook(!updateBook)}
                >
                    Obras:                     
                </InfoBtn>
                { user.books.map((book: any) => (
                        <li key={book.id}>{book.title}</li>
                    ))}
            </InfoBtnContainer>

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

            {
                updateBook && (
                    <ModalEditBookContainer>
                        <button
                            className="closeBookModal"
                            onClick={() => setUpdateBook(false)}
                        >
                            X
                        </button>
                        <span>Cadastrar, editar ou remover obras?</span>
                        <div>
                            <button
                                onClick={
                                    () => {
                                        setIsCreateBook(!isCreateBook);
                                        setUpdateBook(!updateBook);
                                    }
                                }
                            >
                                Cadastrar
                            </button>

                            <button
                                onClick={() => {
                                    setIsUpdate(!isUpdate);
                                    setUpdateBook(!updateBook);
                                }}
                            >
                                Editar
                            </button>

                            <button
                                onClick={() =>{
                                    setIsDelete(!isDelete);
                                    setUpdateBook(!updateBook);
                                }}
                            >
                                Remover
                            </button>
                        </div>
                    </ModalEditBookContainer>
                ) 
            }

            {
                isUpdate && (
                    <ModalEditBookContainer>
                        <button
                            className="closeBookModal"
                            onClick={() => setIsUpdate(false)}
                        >
                            X
                        </button>

                        <span> Escolha qual obra quer Editar</span>

                        <select
                            onChange={(e) => {
                                const book = workList.find((book: any) => book.title === e.target.value);
                                setNewBook({
                                    id: book.id,
                                    title: book.title,
                                    wUrl: book.wUrl,
                                    memberId: user.id,
                                });
                                setWorkSelected(true);
                            }}
                        >
                            <option value="Select">Selecione</option>
                            { workList.map((book: any) => (                               
                                <option key={book.id}>{book.title}</option>
                            ))}
                        </select>
                        {workSelected && (
                            <SelectedWorkContainer>
                                <WorkSelectedContainer>
                                    <div
                                        className="selectedWorkContent"
                                    >
                                        <div>
                                        <p> Obra selecionada: <span>{newBook.title}</span></p>
                                        
                                        <p> Link da obra: <span>{newBook.wUrl}</span></p>
                                        </div>
                                    </div>
                                </WorkSelectedContainer>

                                <div
                                    className="inputContainer"
                                >
                                    <label htmlFor="title">
                                        Insira o novo título:
                                        <input 
                                            type="text"
                                            id="title"
                                            value={newBook.title}
                                            onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                        />
                                    </label>
                                    <label htmlFor="wUrl">
                                        Insira o novo link:
                                        <input 
                                            type="text"
                                            id="wUrl"
                                            value={newBook.wUrl}
                                            onChange={(e) => setNewBook({...newBook, wUrl: e.target.value})}
                                        />
                                    </label>
                                    <label htmlFor="change">
                                        Caso queira mudar o dono da obra, insira o ID do novo dono. Caso contrário, deixe como está.
                                        <input 
                                            type="number"
                                            id="change"
                                            value={newBook.memberId}
                                            onChange={(e) => setNewBook({...newBook, memberId: Number(e.target.value)})}
                                        />
                                    </label>
                                </div>

                                <div className="buttonsContainer">
                                    <button
                                        onClick={() => {
                                            update();
                                            setUpdateBook(!updateBook);
                                        }}
                                    >
                                        Atualizar
                                    </button>
                                </div>

                            </SelectedWorkContainer>
                            
                        )}
                    </ModalEditBookContainer>
                )
            }

            {
                isCreateBook && (
                    <ModalEditBookContainer>
                        <button
                            className="closeBookModal"
                            onClick={() => setIsCreateBook(false)}
                        >
                            X
                        </button>
                        <span>Insira o nome e o link da obra</span>
                        <div
                            className="createBookContainer"
                        >
                            <div className="inputCreateContent">
                                <input 
                                    type="text"
                                    placeholder="Nome da obra"
                                    value={newBook.title}
                                    onChange={(e) => setNewBook({...newBook, title: e.target.value})}
                                />
                                <input 
                                    type="text"
                                    placeholder="Link da obra"
                                    value={newBook.wUrl}
                                    onChange={(e) => setNewBook({...newBook, wUrl: e.target.value})}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    createBooks();
                                    setUpdateBook(false);
                                    setIsCreateBook(false);
                                }}
                            >
                                Cadastrar
                            </button>
                        </div>
                    </ModalEditBookContainer>
                )
            }

            {
                isDelete && (
                    <ModalEditBookContainer>
                        <button
                            className="closeBookModal"
                            onClick={() => setIsDelete(false)}
                        >
                            X
                        </button>
                        <span>Escolha qual obra quer deletar</span>
                        <select
                            onChange={(e) => {
                                const book = workList.find((book: any) => book.title === e.target.value);
                                setNewBook({
                                    id: book.id,
                                    title: book.title,
                                    wUrl: book.wUrl,
                                    memberId: user.id,
                                });
                                setWorkSelected(true);
                            }}
                        >
                            <option value="Select">Selecione</option>
                            { workList.map((book: any) => (
                                <option key={book.id}>{book.title}</option>
                            ))}
                        </select>
                        {workSelected && (
                            <SelectedWorkContainer>
                                <WorkSelectedContainer>
                                    <div
                                        className="selectedWorkContent"
                                    >
                                        <div>
                                        <p> Obra selecionada: <span>{newBook.title}</span></p>
                                        <p> Link da obra: <span>{newBook.wUrl}</span></p>
                                        </div>
                                    </div>
                                </WorkSelectedContainer>
                                <div className="buttonsContainer">
                                    <button
                                        onClick={() => {
                                            Swal.fire({
                                                title: 'Você quer deletar essa obra?',
                                                text: "Está é uma ação sem volta!",
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
                                                        text: 'A obra será deletada permanetemente!',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Sim, deletar!',
                                                        cancelButtonText: 'Cancelar',
                                                        confirmButtonColor: '#d33',
                                                        cancelButtonColor: '#3085d6',
                                                    }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            DeleteBooks();
                                                            setUpdateBook(false);
                                                            setIsDelete(false);
                                                        }
                                                    })
                                                }
                                            });
                                        }}
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </SelectedWorkContainer>
                        )}
                    </ModalEditBookContainer>
                )
            }



                
        </Card>
    );
};

export default UserCard;