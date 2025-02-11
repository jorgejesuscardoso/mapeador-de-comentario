import styled from "styled-components";

export const Container = styled.div`
  background-image: url("oficial-img.jpg");
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
`;

export const Inputs = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.75rem;
  width: 100%;  
`;

export const Labels = styled.label`
  font-size: 0.75rem;
  font-weight: bold;
  color: #f5f5f5;
  width: 45%;
`;