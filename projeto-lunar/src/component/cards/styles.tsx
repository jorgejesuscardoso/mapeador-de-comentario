import styled from "styled-components";

export const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    background: #fff;
    border-radius: 10px;
    padding: 10px;
    width: 90% !important;
    text-align: center;

    b {
        font-size: 0.7rem;
        color: #34495e;
    }

    p {
        font-size: 0.7rem;
        margin: 3px 0;
        color: #34495e;
        width: 100%;
        text-align: start;        
    }

    p.role {
        text-align: center;
    }

    h4 {
        font-size: 0.8rem;
        color: #34495e;
        width: 100%;
        margin: 15px 0 0 0;
    }

`;

export const Name = styled.h2`
    font-size: 1rem;
    color: #2c3e50;
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
`;

export const Role = styled.p`
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: ${(props) => (props.role === "adm" ? "#008622" : "#535353")};
    width: 100%;
    text-align: center;
`;

export const SubRole = styled.p`
    font-size: 0.8rem !important;
    color: #007c1f !important;
    font-weight: bold;
    width: 100%;
    text-align: start;
`;

export const Info = styled.p`
    text-align: left;
    font-size: 0.7rem;
    color: #34495e;
    margin: 5px 0;
    width: 100%;    
`;

export const Points = styled.span`
    font-size: 0.8rem;
    font-weight: bold;
    color: #00a529;
    margin-left: 10px;
`;

export const SubsList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 10px 0;
    width: 100%;
    text-align: center;    
`;

export const SubItem = styled.li`
    background: #dbdbdb;
    padding: 5px;
    border-radius: 5px;
    margin: 3px 0;
    font-size: 0.7rem;
    width: 100%;
    padding: 7px;
    text-align: center;
    color: #34495e;
    font-weight: bold;
`;