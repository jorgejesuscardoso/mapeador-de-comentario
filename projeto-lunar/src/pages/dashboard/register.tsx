import { Container, Inputs, Labels } from "./style";

const RegisterMember = () => {
    
    
    return (
        <Container>
            <form>
                <Labels htmlFor="">
                    Name:
                    <input type="text"/>
                </Labels>
                <Labels htmlFor="">
                    User:
                    <input type="text"/>
                </Labels>
                <Labels htmlFor="">
                    Idade:
                    <input type="number"/>
                </Labels>
                <Labels htmlFor="">
                    Senha:
                    <input type="password"/>
                </Labels>
                <Labels htmlFor="">
                    User do Wattpad:
                    <input type="text"/>
                </Labels>
                <Labels htmlFor="">
                    Telephone:
                    <input type="text"/>
                </Labels>
                <Labels>
                    Escolha uma funlçao:
                    <Inputs as="select"
                    >
                        <option value="admin">Admin</option>
                        <option value="member">Membro</option>                        
                    </Inputs>
                </Labels>
                <Labels>
                    Obra:
                    <input type="text"/>
                </Labels>
                <Labels htmlFor="">
                    Link da Obra:
                    <input type="text"/>
                </Labels>
                <Labels htmlFor="">
                    Subgrupo:
                    <Inputs as="select">
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
                    </Inputs>
                </Labels>
                <button type="submit">Register</button>
            </form>
        </Container>
    );
}

export default RegisterMember;