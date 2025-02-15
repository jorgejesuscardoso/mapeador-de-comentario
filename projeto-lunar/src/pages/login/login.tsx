
import { Container, ContainerFormLogin, ContainerLogin, FormLogin, SpanAuthenticating, SpanLogging, WelcomeBox } from "./style";
import { useState } from "react";
import AnimatedLogin from "../../component/animate/login/modal_login";
import { SetTolocalStorage } from "../../utils/localstorage";
import { LoginApi } from "../../API/APIRobozinho";
import Swal from "sweetalert2";

const Login = () => {
    const [user, setUser] = useState('');
    const [p, setP] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [authentic, setAuthentic] = useState(false);
    const [logging, setLogging] = useState(false);

    const login = async (e: React.FormEvent<HTMLFormElement> ) => {
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
        const data = await LoginApi(user, p);
        if(!data.user || data.user.name === "") {
            Swal.fire({
                icon: 'error',
                title: 'Erro!',
                text: 'Ocorreu um erro ao tentar logar, tente novamente em alguns instantes.',
            });
            setAuthentic(false);
            return;
        }
        if(data.error === 'Usuário não encontrado!') {
            Swal.fire({
                icon: 'error',
                title: 'Usuário não encontrado!',
                text: 'Verifique se o usuário e senha estão corretos.',
            });
            return;
        }

        if(data.error === 'Dados Inválidos!') {
            Swal.fire({
                icon: 'error',
                title: 'Dados Inválidos!',
                text: 'Verifique se o usuário e senha estão corretos.',
            });
            return;
        }
        setAuthentic(false);
        setLogging(true);
        console.log(data);
        SetTolocalStorage('user', data);
        setInterval(() => {
            setAuthentic(false);
            setShowModal(true);
        }, 2000);
    }
    return (
        <Container>
            {showModal && <AnimatedLogin />}
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