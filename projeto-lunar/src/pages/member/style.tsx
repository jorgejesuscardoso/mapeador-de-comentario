import styled from "styled-components";

export const Container = styled.div`
  background-image: url('lua-fantasia.webp');
  background-size: cover;
  display: flex;
  align-items: flex-start;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
`;

export const ContainerD = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    min-height: 100vh;
    background-color: #0009;
    z-index: 111;
    position: relative;
    top: 0;
    left: 0;

    h1 {
        color: white;
        font-size: 2rem;
        margin: 20px 0;
    }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
    overflow: hidden;
    margin-top: 12vh;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.tr`
    background: #3b3c53;
    color: #ccc;
    font-weight: bold;
    text-align: center;
    
    th {
        font-size: 0.8rem;
        padding: 12px;
        overflow: hidden;
    }
`;

export const TableRow = styled.tr`
    color: #010042;
    &:nth-child(even) {
        background: #d6d6d6;
    }

    &:hover {
    }

    td {
        text-align: center;
        font-size: 0.8rem;
        padding: 12px;
        overflow: hidden;

        li {
            list-style: none;
            margin: 1px 0;
            font-size: 0.8rem;
            overflow: hidden;
        }
    }  
`;

export const StyledEmptyRow = styled.tr`
    td {
        text-align: center;
        color: #632f2f;
        overflow: hidden;
    }
`;

export const SpanTotal = styled.span`
    position: absolute;
    top: 5%;
    left: 0;
    color: white;
    font-size: 1rem;
    margin: 20px 0;
`;

export const SpanTotalpoints = styled.span`
    text-align: end;
    position: absolute;
    font-weight: bold;
    top: 5%;
    left: 0;
    color: #ccc;
    width: 98%;
    font-size: 1rem;
    margin: 20px 0;
`;

export const ModalContainer = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
    z-index: 1000;

    h2 {
        text-align: center;
        margin-bottom: 20px;
        color: #777;
    }

    span {
        font-size: 0.8rem;
        color: #777;
        margin-bottom: 20px;
    }
    div {
        display: flex;
        justify-content: space-between;        
        width: 100%;
    }
`;

export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
`;

export const Button = styled.button`
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 40%;
  font-size: 16px;
  transition: background-color 0.3s;

  &:first-child {
    background-color: #f44336; /* Red */
    color: white;
  }

  &:last-child {
    background-color: #4caf50; /* Green */
    color: white;
  }

  &:hover {
    opacity: 0.8;
  }
`

export const ButtonAdd = styled.button`
    padding: 10px 15px;
    border: none;
    border-radius: 4px;
    opacity: 0.9;
    cursor: pointer;
    width: 100%;
    font-size: 0.6rem;
    font-weight: bold;

    transition: background-color 0.3s;
    
    background-color: #0b6d0f; /* Green */
    color: white;
    
    &:hover {
        opacity: 1;
        background-color: #07ac0d; /* Green */
    }
    `

export const ModalEditContainer = styled.div`
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    display: flex;
    justify-content: center !important;
    align-items: center !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;

    div {
        text-align: center;
        color: #777;
        background-color: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        width: 30%;   
    }
`;

export const TdEdit = styled.td`
    cursor: pointer;

    &:hover {
        background-color: #a4c8fa;
        overflow: hidden;
    }
`;