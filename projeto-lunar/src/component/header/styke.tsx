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
    }

    nav {
    display: flex;
    justify-content: end;
    align-items: center;
    width: 100%;
    height: 15vh;
    color: #fff;

    ul {
        display: flex;
        justify-content: space-around;
        width: 67%;
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
        display: flex;
        justify-content: center;
        align-items: center;
        width: 10vw;
        height: 5vh;
        color: #fff;
        border: 1px solid dodgerblue;
        background-color: transparent;
        border-radius: 10px;
        cursor: pointer;

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

        
        
        &:hover {
            border: 1px solid red;
            a {
             color: red;
            }
        }
    }
`;