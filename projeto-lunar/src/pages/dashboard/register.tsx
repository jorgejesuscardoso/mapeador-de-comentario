import { useNavigate } from "react-router-dom";
import { Container, Form, Inputs, Labels, Button, Select, Fade, Button2, Section, ViewPassword, ViewConfirmPassword } from "./style";
import { useState } from "react";
import Swal from "sweetalert2";

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
    const [subgroup, setSubgroup] = useState("A1");
    const [viewPassword, setViewPassword] = useState(false);
    const [viewConfirmPassword, setViewConfirmPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log({
            name,
            username,
            age,
            password,
            confirmPassword,
            wattpadUsername,
            phone,
            role,
            work,
            workLink,
            subgroup
        });

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "error",
                title: "Erro",
                text: "As senhas não coincidem"
            });        
            return;
        }

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
        setSubgroup("A1");

    }


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
                        inicio
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
                            <option value="admin">Admin</option>
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
                <Labels>
                    Link da Obra:
                    <Inputs
                        type="text"
                        placeholder="Link da obra"
                        value={workLink}
                        onChange={(e) => setWorkLink(e.target.value)}
                    />
                </Labels>
                <Labels>
                    Subgrupo:
                    <Select
                        value={subgroup}
                        onChange={(e) => setSubgroup(e.target.value)}
                    >
                        <option value="A1">A-1</option>
                        <option value="A2">A-2</option>
                        <option value="A3">A-3</option>
                        <option value="A4">A-4</option>
                        <option value="A5">A-5</option>
                        <option value="A6">A-6</option>
                        <option value="A7">A-7</option>
                        <option value="A8">A-8</option>
                        <option value="A9">A-9</option>
                        <option value="A10">A-10</option>
                    </Select>
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
