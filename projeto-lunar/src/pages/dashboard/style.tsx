import styled from "styled-components";

export const Container = styled.div`
  background-image: url("oficial-img.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  backdrop-filter: blur(5px);

  @media (max-width: 768px) {
    backdrop-filter: blur(3px);
    padding: 10px;
  }
`;


export const Form = styled.form`
  margin: 5%;
  background: rgba(0, 0, 0, 0.9);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 15px rgba(0, 162, 255, 0.7);
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  animation: fadeIn 0.8s ease-in-out;
  z-index: 999;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  div {
    width: 100%;
    display: flex;
    gap: 15px;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
    }
  }

  @media (max-width: 768px) {
    width: 99%;
    padding: 15px;
    gap: 10px;
  }
`;

export const Inputs = styled.input`
  padding: 10px;
  border: 1px solid #00a2ff;
  border-radius: 5px;
  font-size: 0.85rem;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
  outline: none;
  transition: 0.3s;
  
  &:focus {
    border-color: #ff00ff;
    box-shadow: 0px 0px 10px rgba(255, 0, 255, 0.8);
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 8px;
  }
`;

export const Select = styled.select`
  padding: 10px;
  border: 1px solid #00a2ff;
  border-radius: 5px;
  font-size: 0.85rem;
  width: 100%;
  background-color: rgb(245, 245, 245);
  color: #6d6d6d;
  outline: none;
  transition: 0.3s;
  
  &:focus {
    border-color: #ff00ff;
    box-shadow: 0px 0px 10px rgba(255, 0, 255, 0.8);
  }
`;

export const Labels = styled.label`
  font-size: 0.85rem;
  font-weight: bold;
  color: #d7f0ff;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const Button = styled.button`
  background: linear-gradient(45deg, #007bff, #ff00ff);
  color: white;
  padding: 12px;
  border: none;
  border-radius: 5px;
  width: 100%;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.3s;

  &:hover {
    background: linear-gradient(45deg, #ff00ff, #007bff);
    box-shadow: 0px 0px 10px rgba(255, 0, 255, 0.8);
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 10px;
    width: 50%;
  }
`;

export const ViewPassword = styled.img`
  background-color: rgb(255, 255, 255);
  width: 20px;
  height: 20px;
  position: relative;
  top: -37%;
  left: 92%;
  cursor: pointer;
  border-radius: 50%;
  z-index: 999;
`;

export const ViewConfirmPassword = styled.img`
  background-color: rgb(255, 255, 255);
  width: 20px;
  height: 20px;
  position: absolute;
  top: 44.5%;
  left: 72%;
  cursor: pointer;
  border-radius: 50%;
  z-index: 999;

  @media (max-width: 768px) {
      top: 54%;
      left: 87%;
    }
`;

export const Fade = styled.div`
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  //animation: fadeIn 0.8s ease-in-out;
  z-index: 1;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
export const Button2 = styled.button`
  background: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  width: 10%;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: 0.3s;
  z-index: 999;

  &:hover {
    background: #1ea5ff;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 47%;
    font-size: 0.8rem;
    padding: 8px;
  }
`;

export const Section = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  width: 100%;
  margin-top: 15px;
  z-index: 999;

  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 15px;
  }

  @media (max-width: 768px) {
      flex-direction: column;
      gap: 10px;
    }
`;


export const ContainerM = styled.div`
    width: 100%;
    margin: auto;
    padding: 20px;
    text-align: center;
`;

export const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
    color: #6cb6ff;

    @media (max-width: 768px) {
        font-size: 1rem;
    }    
`;

export const SearchContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        gap: 5px;

        label {
            font-size: 0.8rem;
        }
    }
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;

    @media (max-width: 768px) {
        padding: 7px;
        font-size: 0.6rem;
    }
`;

export const SelectM = styled.select`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 1rem;

    @media (max-width: 768px) {
        padding: 7px;
        font-size: 0.6rem;
    }
`;

export const ButtonM = styled.button`
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
        background-color: #2980b9;
    }

    &:disabled {
        background-color: #bdc3c7;
        cursor: not-allowed;
    }

    @media (max-width: 768px) {
        padding: 7px 15px;
        font-size: 0.6rem;
    }
`;

export const PaginationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 10vh;

    button {
      width: 100%;
      background-color: #3498db !important;
    }

    input {
      width: 40px;
      text-align: center;
    }
    @media (max-width: 768px) {
        flex-direction: column;
        gap: 5px;

        .paginationBtn {      
          display: flex;
          gap: 10px;
          align-items: center;
          justify-content: center;
          width: 100%;
          gap: 10px;
      }

      .paginationInfo {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        background-color: #cccccc25;
        width: 100%;
        top: 56vh;        
        left: 0;
        padding: 5px;

        span {
          font-size: 0.8rem;
        }
      }

      .paginationInfo-2 {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #cccccc25;
        width: 100%;
        padding: 5px;

        span {
          font-size: 0.8rem;
        }
      }
      
    }

    
`;

export const CardContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 10px;
    margin-top: 20px;

    div {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
`;

export const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
`;

export const LoadingMessage = styled.p`
    color: #3498db;
    font-weight: bold;
`;