/* eslint-disable @typescript-eslint/no-explicit-any */
//import { useState } from "react";
import Swal from "sweetalert2";
import { ButtonConfig, ButtonDelete, ConfigContainer } from "../../pages/dashboard/style";
import { Card, Info, InfoBtn, InfoBtnContainer, ModalEditBookContainer, Name, Points, Role, SelectedWorkContainer, SubItem, SubRole, SubsList, WorkSelectedContainer } from "./styles";
import { DeleteUser, UpdateUser } from "../../API/APIRobozinho";
import { useState } from "react";
import { CreateBook, DeleteBook, UpdateBook } from "../../API/Api.Books";


const UserCard = ({ user, setResearch }: { user: any, setResearch: () => void }) => {

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
    const [updateMember, setUpdateMember] = useState(false);
    const [updateMemberData, setUpdateMemberData] = useState({
        name: user.name,
        user: user.user,
        userWtp: user.userWtp,
        phone: user.phone,
        age: user.age,
        role: user.role,
        subRole: user.subRole,
        points: user.points,
        subs: user.subs,        
    });

    

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

    const UpDateMember = async () => {
        try {
            const response = await UpdateUser(user.id, updateMemberData);
            if (!response.id) {
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

            return response;
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Erro ao atualizar!',
            });
        }
    };


    const handleAddSub = (newSub: any) => {
        // Verifica se o item já existe no array
        if (updateMemberData.subs.includes(newSub)) {
            return;
        }
        setUpdateMemberData((prevData) => ({
            ...prevData,
            subs: [...prevData.subs, newSub], // Adiciona o novo item ao array existente
        }));
    };

    const handleRemoveSub = (subToRemove: any) => {
        setUpdateMemberData((prevData) => ({
            ...prevData,
            subs: prevData.subs.filter((sub: any) => sub !== subToRemove), // Remove o item específico
        }));
    };
    

    return (
        <Card>            
            <ConfigContainer
                className="delete"
            >
                <ButtonConfig
                    onClick={() => {
                        setUpdateMember(!updateMember);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                >
                    <img src="config.png" alt="configuração" />
                </ButtonConfig>
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
            </ConfigContainer>
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
                { user.books? user.books.map((book: any) => (
                        <li key={book.id}>{book.title}</li>
                    )): <p style={{width: '100%', textAlign: 'center'}}>Nenhuma obra cadastrada ainda.</p>}
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
                        <div
                        
                            className="buttonsContainer-2"
                        >
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

                        <div
                            className="selectBookContainer"
                        >
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
                        </div>
                        

                        <button
                            onClick={() => {
                                setUpdateBook(true);
                                setIsUpdate(false);
                                setWorkSelected(false);
                            }}
                            
                            className={workSelected ? 'subActive' : ''}
                        >
                            Cancelar
                        </button>
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

                                    <button
                                        onClick={() => {
                                            setWorkSelected(false);
                                        }}
                                    >
                                        Cancelar
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
                            <div>
                                <button
                                    onClick={() => {
                                        Swal.fire({
                                            icon: 'warning',
                                            title: 'Criando...',
                                            text: 'Aguarde um momento!',
                                            showConfirmButton: false,
                                            timer: 1500,
                                        }).then(() => {
                                            if (!newBook.title || !newBook.wUrl) {
                                                Swal.fire({
                                                    icon: 'error',
                                                    title: 'Oops...',
                                                    text: 'Preencha todos os campos!',
                                                });
                                            } else {
                                                createBooks();
                                                setUpdateBook(!updateBook);
                                                setIsCreateBook(false);
                                                setResearch();
                                            }
                                        });

                                    }}
                                >
                                    Cadastrar
                                </button>

                                <button
                                    onClick={() => {
                                        setUpdateBook(!updateBook);
                                        setIsCreateBook(false);
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
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
                        <button
                            onClick={() => {
                                setUpdateBook(!updateBook);
                                setIsDelete(false);
                            }}
                            className={workSelected ? 'subActive' : ''}
                        >
                            Cancelar
                        </button>
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
                                    <button
                                        onClick={() => {
                                            setWorkSelected(false);
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </SelectedWorkContainer>
                        )}
                    </ModalEditBookContainer>
                )
            }

            {
                updateMember && (
                    <ModalEditBookContainer
                        className="updateMember"
                    >
                        <button
                            className="closeBookModal"
                            onClick={() => setUpdateMember(false)}
                        >
                            X
                        </button>
                        <span>Atualize os dados do membro</span>
                        <div
                            className="createBookContainer"
                        >
                            <div className="inputCreateContent">
                                <input 
                                    type="text"
                                    placeholder="Nome"
                                    value={updateMemberData.name}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, name: e.target.value})}
                                />
                                <input 
                                    type="text"
                                    placeholder="User"
                                    value={updateMemberData.user}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, user: e.target.value})}
                                />
                                <input 
                                    type="text"
                                    placeholder="User Wattpad"
                                    value={updateMemberData.userWtp}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, userWtp: e.target.value})}
                                />
                                <input 
                                    type="text"
                                    placeholder="Telefone"
                                    value={updateMemberData.phone}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, phone: e.target.value})}
                                />
                                <input 
                                    type="number"
                                    placeholder="Idade"
                                    value={updateMemberData.age}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, age: Number(e.target.value)})
                                    }
                                />
                                <input 
                                    type="text"
                                    placeholder="Role"
                                    value={updateMemberData.role}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, role: e.target.value})}
                                />
                                <input 
                                    type="text"
                                    placeholder="SubRole"
                                    value={updateMemberData.subRole}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, subRole: e.target.value})}
                                />
                                <input 
                                    type="number"
                                    placeholder="Pontos"
                                    value={updateMemberData.points}
                                    onChange={(e) => setUpdateMemberData({...updateMemberData, points: Number(e.target.value)})
                                    }
                                />
                            </div>

                            <div className="subsContainer">
                                <h3>Adicionar Sub:</h3>
                                <div
                                    className="subsList"
                                >
                                    {updateMemberData.subs.map((sub: string, index: number) => (
                                        <SubItem key={index}>{sub}</SubItem>
                                    ))}
                                </div>
                                <select 
                                    value={updateMemberData.subs}
                                    onChange={(e) => handleAddSub(e.target.value)}
                                >
                                    <option value="Select">Selecione</option>
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
                                </select>
                            </div>
                            <button
                                onClick={() => {
                                    UpDateMember();
                                    setUpdateMember(false);
                                }}
                            >
                                Atualizar
                            </button>
                        </div>
                        <div className="subsContainer">
                            <h3>Remover Sub</h3>

                            <div
                                className="subsList"
                            >
                                {updateMemberData.subs.map((sub: string, index: number) => (
                                    <SubItem key={index}>{sub}</SubItem>
                                ))}
                                
                            </div>

                            <select 
                                value={updateMemberData.subs}
                                onChange={(e) => handleRemoveSub(e.target.value)}
                            >
                                <option value="Select">Selecione</option>
                                {updateMemberData.subs.map((sub: string, index: number) => (
                                    <option key={index}>{sub}</option>
                                ))}
                            </select>

                        </div>
                    </ModalEditBookContainer>
                )
            }


                
        </Card>
    );
};

export default UserCard;