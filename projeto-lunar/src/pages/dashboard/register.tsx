/* eslint-disable react-hooks/exhaustive-deps */
import { useNavigate } from "react-router-dom";
import { Container, Form, Inputs, Labels, Button, Select, Fade, Button2, Section, ViewPassword, ViewConfirmPassword } from "./style";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CreateUser } from "../../API/APIRobozinho";
import { GetFromLocalStorage } from "../../utils/localstorage";
import Sublist from "../../component/subsList/subsList";

const RegisterMember = () => {
    const Navigate = useNavigate();
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState(0);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [wattpadUsername, setWattpadUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("Admin");
    const [work, setWork] = useState("");
    const [workLink, setWorkLink] = useState("");
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);
    const [sub, setSub] = useState('Selecione');
    

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        // Validação para evitar campos vazios
        const noEmpty = 
            !name.trim() || 
            !username.trim() || 
            !age || // Evita idades inválidas (0, null ou undefined)
            !password.trim() || 
            !confirmPassword.trim() || 
            !wattpadUsername.trim() || 
            !phone.trim() || 
            !sub.trim() ||
            !role.trim();
    
        if (noEmpty) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Preencha todos os campos"
            });
            return;
        }
    
        // Validação de senha
        if (password !== confirmPassword || password.length < 5) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "As senhas não coincidem ou são inválidas (menor que 5 caracteres)"
            });
            return;
        }

        const subs =[];
        subs.push(sub);
        // Preparação dos dados para o backend
        const userData = {
            name,
            user: username,
            age,
            password,
            userWtp: wattpadUsername,
            phone,
            role,
            points: 0, // Define um valor inicial de pontos
            books: work ? [{ title: work, wUrl: workLink }] : [], // Se houver obra, adiciona ao array
            subs: subs
        };
        console.log(userData);
        try {
            const response = await CreateUser(userData);

            if (response.msg === "User already exists") {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "Usuário já existe!"
                });
                return;
            }
    
            if (response.id) {
                Swal.fire({
                    icon: "success",
                    title: "Sucesso",
                    text: "Usuário registrado com sucesso!"
                });
    
                // Limpar o formulário
                setName("");
                setUsername("");
                setAge(0);
                setPassword("");
                setConfirmPassword("");
                setWattpadUsername("");
                setPhone("");
                setRole("Admin");
                setWork("");
                setWorkLink("");
    
                // Redireciona após o sucesso
                Navigate("/dash");
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erro",
                    text: "Falha ao registrar usuário!"
                });
            }
        } catch (error) {
            console.error("Erro ao registrar usuário:", error);
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "Ocorreu um erro inesperado. Tente novamente."
            });
        }
    };

    useEffect(() => {
        const getLocalStorage = GetFromLocalStorage('user');
        if (getLocalStorage === null) {
            Navigate('/');
            return;
        }
    }, []);

    return (
        <Container>
            <Fade>

            </Fade>
            <Section>
                <div>
                    <Button2
                        onClick={() => {
                            Navigate("/dash");
                        }}
                    >
                        Dashboard
                    </Button2>
                    <Button2
                        onClick={() => {
                            Navigate("/home");
                        }}
                    >
                        início
                    </Button2>
                </div>
            </Section>
            <Form>
                <p>Registre um novo membro na plataforma</p>
                <div>
                    <Labels>
                        Nome:
                        <Inputs 
                            type="text" 
                            placeholder="Digite seu nome" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Labels>
                    <Labels>
                        Usuário:
                        <Inputs 
                            type="text" 
                            placeholder="Digite seu usuário" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Labels>
                </div>
                <div>
                    <Labels>
                        Idade:
                        <Inputs
                            type="number"
                            placeholder="Digite sua idade"
                            value={age}
                            onChange={(e) => setAge(Number(e.target.value))}
                        />
                    </Labels>
                    <Labels>
                        Senha:
                        <Inputs
                            className='password'
                            type={viewPassword ? 'text' : 'password'}
                            placeholder="Digite sua senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />                        
                        <ViewPassword 
                            src="olho.png" 
                            alt=""
                            onClick={() => setViewPassword(!viewPassword)}
                        />
                    </Labels>
                </div>
                <Labels>
                    Confirme a senha:
                    <Inputs
                        type={viewConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirme sua senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                     <ViewConfirmPassword
                        src="olho.png"
                        alt=""
                        onClick={() => setViewConfirmPassword(!viewConfirmPassword)}
                    />
                </Labels>
                <div>
                    <Labels>
                        Usuário do Wattpad:
                        <Inputs
                            type="text"
                            placeholder="Seu usuário do Wattpad"
                            value={wattpadUsername}
                            onChange={(e) => setWattpadUsername(e.target.value)}
                        />
                    </Labels>
                    <Labels>
                        Telefone:
                        <Inputs 
                            type="text" 
                            placeholder="Digite seu telefone" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Labels>
                </div>
                <div>
                    <Labels>
                        Escolha uma função:
                        <Select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}                            
                        >
                            <option value="adm">Admin</option>
                            <option value="superadm">SuperAdmin</option>
                            <option value="member">Membro</option>
                        </Select>
                    </Labels>
                    <Labels>
                        Obra:
                        <Inputs
                            type="text"
                            placeholder="Nome da obra"
                            value={work}
                            onChange={(e) => setWork(e.target.value)}
                        />
                    </Labels>
                </div>

                {
                    role === 'member' &&
                    <Labels>
                        Esolha um Sub:
                        <Sublist
                            setSub={setSub}
                            sub={sub}
                        />
                    </Labels>

                }

                <Labels>
                    Link da Obra:
                    <Inputs
                        type="text"
                        placeholder="Link da obra"
                        value={workLink}
                        onChange={(e) => setWorkLink(e.target.value)}
                    />
                </Labels>                
                <Button
                    onClick={handleSubmit}
                >
                    Registrar
                </Button>
            </Form>
        </Container>
    );
}

export default RegisterMember;
