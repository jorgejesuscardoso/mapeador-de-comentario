import { styled } from 'styled-components';

export const ContainerFindComments = styled.div`
  background-image: url('fav1000px.png');
  background-size: cover;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  border: 1px solid #000;
  padding: 5vh 1vw
`;

export const DivBtn = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 5px;
  border: none;
  border-radius: 5px;
  width: 15%;
  cursor: pointer;
  font-size: 0.75rem;
  transition: background 0.3s;

  &.comentario {
    background-color: #086830;
  }
   &.comentario:hover {
    background-color: #01491f;
  }

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const QtdeComments = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #f5f5f5;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;

  span {
    width: 100%;
    font-size: 0.8rem;
  }

  div#comments {
    background-color: #f696ff45;
    font-size: 0.75rem;
    padding: 10px;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 22%;
  }
`;

export const Message = styled.p`
  background-color: rgba(255, 255, 255, 0.5); 
  text-align: center; 
  color: #e20e0e;
  font-size: 1.2rem;
  padding: 10px;
  font-weight: 700;
  border-radius: 5px;
`;

export const CommentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  img {
    width: 30%;
  }
`;

export const CommentCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  height: 150px;
  gap: 10px;
  max-width: 400px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);

  div {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
    height: 100%;
    max-height: 100px;
    width: 100%;
    overflow: hidden;
  }
`;

export const CommentUser = styled.p`
  color: #333;
  width: 100%;
  font-size: 0.9rem;

  b {    
    font-size: 0.9rem;
  }
`;

export const CommentText = styled.p`
  color: #555;
  width: 100%;
  font-size: 0.9rem;
  
  
  b {    
    font-size: 0.8rem;
  }
`;

export const CommentDate = styled.p`
  position: relative;
  bottom: 0%;
  font-size: 12px;
  color: #777;
  font-weight: 700;
  width: 100%;
`;

export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 10px;
  padding: 10px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
`;

export const DivInputs = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 10px;

`;

export const Inputs = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 0.75rem;
  width: 100%;  
  
  &[type='number']::-webkit-outer-spin-button,
  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  &#select {
  height: 30px;
  line-height: 30px;
  padding: 0 10px; 
  font-size: 0.8rem;
  color: #555;
}
`;

export const Labels = styled.label`
  font-size: 0.75rem;
  font-weight: bold;
  color: #f5f5f5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;



  input {
    height: 30px;
  }

  input#co {
    height: 12px;
    width: 40px;
    text-align: center;
  }
`;

export const Question = styled.img`
  margin-left: 2.5%;
  width: 15px;
  cursor: pointer;
`;

export const Image = styled.img`
  width: 50%;
`;

export const ImageRobo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  img {
    width: 20%;
  }
`;
