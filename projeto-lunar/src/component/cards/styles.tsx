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

export const InfoBtn = styled.button`
    font-size: 0.7rem;
    color: #ffffff;
    margin: 5px 0;
    width: 100%;
    text-align: left;
    cursor: pointer;
    background: linear-gradient(135deg, #8a4c9d, #6b5bb1, #435bb3);
    border: none;
    text-align: center;
    padding: 5px;
    border-radius: 6px;
`;

export const InfoBtnContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    
    li {
        font-size: 0.7rem;
        color: #34495e;
        list-style: none;
        margin: 3px 0;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #dbdbdb;
        border-top: 1px solid #dbdbdb;
    }
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

export const ModalEditBookContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #00000099;
    border-radius: 5px;
    padding: 10px;
    width: 100%;
    min-height: 100%;
    text-align: center;

    button {
        font-size: 0.7rem;
        color: #ffffff;
        margin: 5px 0;
        width: 30%;
        text-align: center;
        cursor: pointer;
        background: linear-gradient(135deg, #8a4c9d, #6b5bb1, #435bb3);
        border: none;
        text-align: center;
        padding: 5px;
        border-radius: 6px;
    }

    button.closeBookModal {
        position: absolute;
        top: 10px;
        right: 10px;
        width: 30px;
        height: 30px;
        color: #ffffff;
        border: none;
        border-radius: 50%;
        cursor: pointer;
    }

    span {
        font-size: 1rem;
        color: #ffffff;
        width: 100%;
        text-align: center;
        background: radial-gradient(circle, rgba(60, 30, 90, 0.8) 10%, rgba(10, 10, 40, 1) 90%);
        border-radius: 5px 5px 0 0;
        padding: 5px;
    }

    div {
        display: flex;
        align-items: center;
        justify-content: space-around;
        width: 100%;
        background: #00000099;
        border-radius: 0 0 5px 5px;
        padding: 10px;
    }

    select {
        font-size: 0.7rem;
        color: #ffffff;
        background: #00000099;
        border: none;
        border-radius: 5px;
        padding: 5px;
        width: 100%;

        option {
            font-size: 0.7rem;
            color: #ffffff;
            background: #00000099;
            border: none;
            border-radius: 5px;
            padding: 5px;
        }
    }

    div.createBookContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        background: #00000099;
        border-radius: 0 0 5px 5px;
        padding: 10px;

        label {
            font-size: 0.7rem;
            color: #ffffff;
            width: 100%;
            text-align: start;
        }

        input {
            font-size: 0.7rem;
            color: #ffffff !important;
            background: #000000;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 10px;
            width: 100%;
        }

        button {
            font-size: 0.7rem;
            color: #ffffff;
            margin: 5px 0;
            width: 30%;
            text-align: center;
            cursor: pointer;
            background: linear-gradient(135deg, #8a4c9d, #6b5bb1, #435bb3);
            border: none;
            text-align: center;
            padding: 5px;
            border-radius: 6px;
        }

        div.inputCreateContent {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 100%;
            background: none;
            border-radius: 5px;
            padding: 10px;
            gap: 10px;
        }
    }
`;

export const WorkSelectedContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
    min-width: 100%;
    background: #00000099;
    border-radius: 0 0 5px 5px;
    padding: 0 !important;

    div.selectedWorkContent {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        background: #fff;
        border-radius: 5px;
        padding: 0 !important;

        div {
            display: flex;
            flex-direction: column; 
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            background: #ffffff;
        }

        p {
            font-size: 0.8rem;
            color: #2e2580;
            width: 100%;
            text-align: center;
        }
        span {
            font-size: 0.8rem;
            color: #8b09ac;
            width: 100%;
            text-align: center;
            background: none;
        }
    }
    
    
`;

export const SelectedWorkContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%; 
    padding: 0 !important;

    div.inputContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 30vh;
        background: #fff;
        padding: 0.5rem 0 !important;

        label {
            font-size: 0.8rem;
            color: #3b3952;
            width: 100%;
            text-align: start;
            padding: 5px;

            &:first-child {
                margin-top: 30px;
            }
        }

        input {
            background: #ddd;
            font-size: 0.8rem;
            color: #292a3b;
            width: 100%;
            text-align: center;
            padding: 5px;
            border-radius: 5px;
            border: none;
        }
    }
`;