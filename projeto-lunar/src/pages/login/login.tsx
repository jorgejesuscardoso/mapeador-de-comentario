import { useNavigate } from "react-router-dom";
import { Container, ContainerFormLogin, ContainerLogin, FormLogin, WelcomeBox } from "./style";
import { useState } from "react";

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [p, setP] = useState('');

    const fakelogin = (e) => {
        const fakeUser = 'AnnaFr4nca';
        const fakePassword = 'vizinha';

        if (user === fakeUser && p === fakePassword) {
            
            navigate('/home');
        }  else {
            alert('Usuário ou senha incorretos!');
        }
    }
    return (
        <Container>
            <WelcomeBox>
                <div>
                <h1>Seja bem-vindo ao projeto Lunar!</h1>
                <h2>Onde a lua ilumina os livros.</h2>
                </div>
                
            </WelcomeBox>
            <ContainerLogin>
                <ContainerFormLogin>
                    <h1>Login</h1>
                    <FormLogin>
                        <input 
                            type="text"
                            placeholder="Usuário"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Senha"
                            value={p}
                            onChange={(e) => setP(e.target.value)}
                        />
                        <button
                            onClick={(e) => fakelogin(
                                e.preventDefault()
                            )}
                        >
                            Entrar
                        </button>
                    </FormLogin>
                    <span>
                        Aréa reservada à administradores. <br/> Caso não seja um, por favor, retorne a página inicial.
                    </span>
                </ContainerFormLogin>
            </ContainerLogin>
        </Container>
    );
};

export default Login;