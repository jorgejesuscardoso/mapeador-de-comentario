import { styled } from 'styled-components';

export const ContainerFindComments = styled.div`
  background-image: url('fav1000px.png');
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 16vh;
  width: 100%;
  height: 100vh;
  border: 1px solid #000;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
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

export const Message = styled.p`
  color: #ff0000;
  font-weight: bold;
`;

export const CommentsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
`;

export const CommentCard = styled.div`
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 100%;
  max-width: 400px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const CommentUser = styled.p`
  font-weight: bold;
  color: #333;
`;

export const CommentText = styled.p`
  color: #555;
`;

export const CommentDate = styled.p`
  font-size: 12px;
  color: #777;
`;