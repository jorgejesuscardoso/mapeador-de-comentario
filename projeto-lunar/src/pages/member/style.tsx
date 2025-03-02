import styled from "styled-components";

export const Container = styled.div`
  background-image: url('lua-fantasia.webp');
  background-size: cover;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  background-color: #000;
`;

export const ContainerD = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: #0007;
    z-index: 1111;
    position: relative;
    top: 0;

    h1 {
        color: white;
        font-size: 2rem;
        margin: 20px 0;
    }
`;

export const ContainerE = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    width: 100%;
    min-height: 45vh;
    background-color: #00000077;
    top: 0;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
        min-height: 25vh;
        padding: 0.5rem;
    }
`;

export const ContainerResumo = styled.div`
    background: #1e1e2f;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem;
    width: 40%;
    height: 34vh;
    margin-bottom: 1rem;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);

    strong {
        font-size: 0.8rem;
        color: #ffd700;
    }

    @media (max-width: 768px) {
        width: 100%;
        height: 100%;
        margin: 0;
    }
`;

export const SpanTotal = styled.span`
    font-size: 0.8rem;
    font-weight: bold;
    color: #f5f5f5;

    @media (max-width: 768px) {
        font-size: 0.65rem;

        strong {
            font-size: 0.60rem;
        }
    }
`;

export const SpanTotalpoints = styled.span`
    font-size: 0.8rem;
    color: #f5f5f5;
    
    @media (max-width: 768px) {
        font-size: 0.65rem;

        strong {
            font-size: 0.60rem;
        }
    }
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background: #ffffff;
    overflow: hidden;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.tr`
    background: #3b3c53;
    color: #ccc;
    font-weight: bold;
    text-align: center;
    
    th {
        font-size: 0.7rem;
        padding: 12px;
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        th {
            font-size: 0.5rem;
            padding: 6px;
            overflow: hidden;
         }
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
        font-size: 0.7rem;
        padding: 12px;
        overflow: hidden;

        li {
            list-style: none;
            margin: 1px 0;
            font-size: 0.7rem;
            overflow: hidden;
        }
    }  

    @media (max-width: 768px) {
       td {
            font-size: 0.5rem;
            padding: 6px;
            overflow: scroll;

            li {
                font-size: 0.5rem;
            }
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
    z-index: 100000;

    h2 {
        font-size: 0.8rem;
        text-align: center;
        color: #07801b;
    }

    h3 {
        font-size: 0.8rem;
        text-align: center;
        color: #967f01;
    }

    span {
        font-size: 0.8rem;
        color: #777;
        margin-bottom: 10px;
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
  margin-bottom: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.7rem !important;
  box-sizing: border-box;
`;

export const Button = styled.button`
  padding: 8px 10px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.6rem !important;
  width: 50%;
  transition: background-color 0.3s;

  &:first-child {
    background-color: #4caf50; /* Red */
    color: white;
  }

  &:last-child {
    background-color: #f44336; /* Green */
    color: white;
  }

  &:hover {
    opacity: 0.8;
  }

  &.download-pdf {
    background-color: #4caf50 !important;
    color: white;
    margin-bottom: 1rem;
  }
`;

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

    @media (max-width: 768px) {
        font-size: 0.5rem;
        width: 100%;
        padding: 5px;
        max-width: 40px;
    }
`;

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
        overflow-x: scroll;
    }

    @media (max-width: 768px) {
        font-size: 0.45rem !important;
    }
`;

export const DescriptionContainer = styled.div`
background-color: #1e1e2f;
color: #f5f5f5;
padding: 20px;
border-radius: 10px;
box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
max-width: 800px;
margin: 20px;
text-align: center;
font-family: "Arial", sans-serif;

h2 {
  font-size: 24px;
  margin-bottom: 10px;
}

p {
  font-size: 16px;
  line-height: 1.6;
}

.highlight {
  font-weight: bold;
  color: #ffd700; /* Dourado para destaque */
}


    @media (max-width: 768px) {
            display: none;
        }
`;

export const Labels = styled.label`
  font-size: 16px;
  font-weight: bold;
  color: #f5f5f5;
  width: 45%;

    select {
      padding: 3px;
      border: 1px solid #ccc;
      border-radius: 5px;
      font-size: 0.7rem;
      width: 100%;
      margin-bottom: 5px;

      option {
        padding: 5px;
        font-size: 0.7rem;
      }
    }
`;

export const SectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #ffffffbe;
    padding: 0.5rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 2.5rem;
    width: 22%;

    div {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        p {
            font-size: 0.7rem !important;
            color: #333;
        }

        h2, h3 {
            margin-bottom: 0.5rem;
            color: #333;
        }        
    }

    @media (max-width: 768px) {
        width: 100%;
        margin-bottom: 0.5rem;

        div {
            gap: 0.5rem;
        }

        h2 {
            font-size: 0.8rem !important;
        }

        h3 {
            font-size: 0.7rem !important;
        }

        p {
            font-size: 0.6rem !important;
        }

        button {
            font-size: 0.6rem !important;
            height: 1.6rem;
        }

    }
`;

export const Title = styled.h3`
    margin-bottom: 0.3rem !important;
    color: #333;
`;

export const InfoText = styled.p`
    color: #555;
    margin-bottom: 0.1rem;
`;

export const ButtonContainer = styled.div`
    display: flex;
    flex-direction: row !important;
    gap: 0.1rem !important;
    justify-content: center;
    width: 100%;
`;

export const ActionButton = styled.button`
    background: #007bff;
    color: white;
    border: none;
    padding: 0.2rem !important;
    border-radius: 5px;
    cursor: pointer;
    width: 50%;
    font-size: 0.7rem;
    transition: 0.3s ease;
    
    &:hover {
        background: #0056b3;
    }
`;

export const ResumoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 1rem;
    margin-bottom: 1rem;

    div {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;        
    }

    p {
        display: block;
        width: 100%;
        text-align: justify;
        font-size: 0.8rem !important;
        color: #333;
    }

    h3, h2 {
        color: #333;
        margin:0 !important;
    }
`;

export const ImgDivisoria = styled.img`
    width: 5%;
    margin: 1rem;
`;

export const MainSection = styled.section`
    display: flex;
    justify-content: space-evenly;
    align-items: start;
    padding: 0.2rem;
    width: 100%;
    gap: 0.5rem;
    margin-bottom: 1rem;


    @media (max-width: 768px) {
        flex-direction: column;
        align-items: center;
    }
`;

export const DivToScrollTable = styled.div`
    overflow-x: auto;
    width: 100%;
`;

export const PaginationContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-top: 1rem;

    .paginationContent {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
        border-radius: 5px;
    }

    .paginationInfo {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        margin: 0.3rem 0 0 0;
        

        label {
            font-size: 0.8rem;
            color: #ccc;
        }

        input {
            color: #fff;
            background: none;
            width: 30px;
            padding: 0.1rem;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.8rem;
            margin-bottom: 0.2rem;
        }

        span {
            font-size: 0.8rem;
            color: #ccc;
        }
    }

    .paginationBtn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.5rem;
        width: 80%;     
        margin: 1rem 0 0 0;   

        button {
            background: none;
            border: none;
            width: 20px;
            height: 20px;


            img {
                width: 100%;
                height: 100%;
                opacity: 0.7;
            }
        }
    }

    .paginationInput {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.8rem;
        
        input, b {
            color: #fff;
            background: none;
            width: 30px;
            padding: 0.1rem;
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 0.8rem;
        }
    }
`;
