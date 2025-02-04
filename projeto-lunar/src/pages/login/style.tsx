import { styled } from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
`;

export const ContainerLogin = styled.div`
  display: flex;
  justify-content: right;
  align-items: left;
  width: 40vw;
  height: 100%;
  background-color: #fff;
`;

export const ContainerFormLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;

    h1 {
        font-size: 2rem;
        margin-bottom: 10px;
    }
  
    span {
        text-align: center;
        font-size: 13px;
        width: 100%;
    }
`;

export const FormLogin = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 50%;
    background-color: #f5f5f5;
    gap: 10px;

    input {
        font-size: 0.8rem;
        padding: 10px;
        width: 100%;
        height: 40px;
        border: 1px solid #000;
        border-radius: 7px;
    }
    
    button {
        width: 100%;
        height: 40px;
        background-color: #000;
        color: #fff;
        border: none;
        border-radius: 7px;
        cursor: pointer;
    }

`;

export const WelcomeBox = styled.div`
    background-image: url("oficial-img.jpg");
    background-size: cover;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70vw;
    height: 100%;
    background-color: #fff;
    font-size: 1.5rem;
    gap: 10px;

    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }

    h1 {
        font-size: 2rem;
        color: #fff;
    }

    h2 {
        font-size: 1.5rem;
        margin-top: -10px;
        color: #fff;
    }

    span {
        text-align: center;
        font-size: 13px;
        width: 100%;
    }
`;
