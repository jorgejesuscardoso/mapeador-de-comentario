
import { Container, ContainerFormLogin, ContainerLogin, FormLogin, SpanAuthenticating, SpanLogging, WelcomeBox } from "./style";
import { useState } from "react";
import { SetTolocalStorage } from "../../utils/localstorage";
import { LoginApi } from "../../API/APIRobozinho";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [p, setP] = useState('');
    const [authentic, setAuthentic] = useState(false);
    const [logging, setLogging] = useState(false);

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (user === '' || p === '') {
            Swal.fire({
                icon: 'error',
                title: 'Campos vazios!',
                text: 'Por favor, preencha todos os campos.',
            });
            return;
        }
    
        setAuthentic(true);
    
        try {
            const data = await LoginApi(user, p);
            console.log(data);
            if (!data.user || data.user.name === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: 'Ocorreu um erro ao tentar logar, tente novamente em alguns instantes.',
                });
                setAuthentic(false);
                return;
            }
    
            if (data.error === 'Usuário não encontrado!' || data.error === 'Dados Inválidos!') {
                Swal.fire({
                    icon: 'error',
                    title: data.error,
                    text: 'Verifique se o usuário e senha estão corretos.',
                });
                setAuthentic(false);
                return;
            }
    
            setLogging(true);
            SetTolocalStorage('user', data);
            setAuthentic(false);
    
            // Redirecionamento usando setTimeout ao invés de setInterval
            const redirectTimeout = setTimeout(() => {
                navigate('/home');
                setLogging(false);
            }, 2000);
    
            // Limpeza para evitar múltiplas execuções inesperadas
            return () => clearTimeout(redirectTimeout);
    
        } catch {
            Swal.fire({
                icon: 'error',
                title: 'Erro inesperado',
                text: 'Ocorreu um erro ao tentar logar. Tente novamente mais tarde.',
            });
            setAuthentic(false);
        }
    };
    
    
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
                    <FormLogin onSubmit={(e) => login(e)}>
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
                            type="submit"
                        >
                            Entrar
                        </button>

                        {authentic && <SpanAuthenticating>Autenticando... pode levar até 1min.</SpanAuthenticating>}
                        {logging && <SpanLogging>Logando...</SpanLogging>}
                    </FormLogin>
                    <span>
                        Aréa reservada à administradores. <br/> Caso não seja um, por favor, saia do aplicativo.
                    </span>
                </ContainerFormLogin>
            </ContainerLogin>
        </Container>
    );
};

export default Login;