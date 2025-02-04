import { Container, ContainerFormLogin, ContainerLogin, FormLogin, WelcomeBox } from "./style";

const Login = () => {
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
                        <input type="text" placeholder="Usuário" />
                        <input type="password" placeholder="Senha" />
                        <button>Entrar</button>
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