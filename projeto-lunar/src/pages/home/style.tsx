import {styled} from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100vw;
  background-color: #f0f0f0;
  margin-top: 16vh;
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  padding: 20px;
  margin: 10px;
  border: 1px solid #000;
  border-radius: 10px;
  background-color: #fff;
`;