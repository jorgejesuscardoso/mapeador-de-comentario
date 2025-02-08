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
    background: #ffffffd5;
    overflow: hidden;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
`;

export const TableHeader = styled.tr`
    background: #862b77;
    color: #ccc;
    font-weight: bold;    
    text-align: center;
    
    th {
        border-left: 1px solid #ccc;
        padding: 12px;
    }
`;

export const TableRow = styled.tr`
    color: #3b1535;
    &:nth-child(even) {
        background: #bbb;
    }

    &:hover {
        background: #e9ecef;
    }

    td {
        border-left: 1px solid #6d2b5d;
        text-align: center;
        padding: 12px;
        border-bottom: 1px solid #ddd;

        li {
            list-style: none;
            margin: 1px 0;
            border-bottom: 1px solid #6d6d6d;
        }
    }  
`;

export const StyledEmptyRow = styled.tr`
    td {
        text-align: center;
        color: #572249;
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