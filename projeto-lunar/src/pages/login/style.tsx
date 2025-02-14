import { styled } from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ContainerLogin = styled.div`
  display: flex;
  justify-content: right;
  align-items: left;
  width: 40vw;
  height: 100%;
  background-color: #fff;

  @media (max-width: 1024px) {
    width: 60vw;
  }
  
  @media (max-width: 768px) {
    width: 100vw;
  }
`;

export const ContainerFormLogin = styled.div`
    background-size: cover;    
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;

    h1 {
        text-align: center;
        font-size: 2rem;
    }

    span {
        text-align: center;
        font-size: 13px;
        width: 100%;
    }

    @media (max-width: 768px) {
        background-image: url("oficial-img.jpg");

        span {    
            position: absolute;
            bottom: 5vh;        
            color: #f5f5f5;
            margin-bottom: 1px;
        }

        h1 {
            position: absolute;
            top: 10vh;
            width: 100%;            
            color: #ffffff;
            font-size: 3rem;
            font-family: dancing script;
        }
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

  @media (max-width: 768px) {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;   
    padding: 2rem;
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

  @media (max-width: 768px) {
    display: none;
  }
`;

export const SpanAuthenticating = styled.span`
  font-size: 0.7rem !important;
  color: red;    
  margin-top: 10px;
`;

export const SpanLogging = styled.span`
  font-size: 0.7rem !important;
  color: green;    
  margin-top: 10px;
`;
