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
`;

export const DivBtn = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  width: 30%;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const QtdeComments = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  width: 22%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1.5%;
  width: 60%;

  div#comments {
    background-color: #f696ff45;
    padding: 10px;
    border-radius: 5px;
    width: 50%;
  }

  label {
    color: #f8f0f0;
    font-size: 0.7rem;
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
  justify-content: center;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  gap: 5px;
  max-width: 400px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
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
    font-size: 0.9rem;
  }
`;

export const CommentDate = styled.p`
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
  font-size: 16px;
  width: 100%;
`;

export const Labels = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #f5f5f5;
  width: 45%;
`;

export const Question = styled.img`
  margin-left: 2.5%;
  width: 15px;
  cursor: pointer;
`;
