import { styled } from 'styled-components';

export const HeaderContainer = styled.header`
    background-image: url('oficial-img.jpg');
    background-size: cover;
    position: relative;
    display: flex;
    top: 0;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    width: 100%;

    img {
        width: 9vw;
        height: 15.9vh;
        z-index: 10;
    }

    nav {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 16vh;
    color: #fff;

    ul {
        display: flex;
        justify-content: space-around;
        width: 70%;
        list-style: none;
        padding: 0;
        gap: 1rem;

        li {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;

            a {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                height: 100%;
                font-size: 0.9rem;
                font-weight: 900;
                font-family: montserrat;
                color: #fff;
                text-decoration: none;
              }

                a:hover {
                    color: pink;
                }
                
             }
            
        }
    }

    
    button {
        background: linear-gradient(45deg, #007bff, #ff00ff);
        color: white;
        padding: 12px;
        border: none;
        border-radius: 5px;
        width: 10vw;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        transition: 0.3s;
        z-index: 10;

        &:hover {
            background: linear-gradient(45deg, #ff00ff, #007bff);
            box-shadow: 0px 0px 10px rgba(255, 0, 255, 0.8);
        }

        &:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        a {
            display: inline-block;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-content: center;
            color: #fff;
            font-size: 0.7rem;
            text-decoration: none;
        }
    }
`;