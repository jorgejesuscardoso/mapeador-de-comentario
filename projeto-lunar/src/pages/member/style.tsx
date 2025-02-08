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
    }
`;

export const TableRow = styled.tr`
    color: #010042;
    &:nth-child(even) {
        background: #e9e9e9;
    }

    &:hover {
        background: #ffffff;
    }

    td {
        text-align: center;
        font-size: 0.85rem;
        padding: 12px;

        li {
            list-style: none;
            margin: 1px 0;
            font-size: 0.85rem;

            &:nth-child(even) {
                background: #83828255
            }
        }
    }  
`;

export const StyledEmptyRow = styled.tr`
    td {
        text-align: center;
        color: #c7c7c7;
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
    top: 5%;
    color: white;
    width: 98%;
    font-size: 1rem;
    margin: 20px 0;
`;