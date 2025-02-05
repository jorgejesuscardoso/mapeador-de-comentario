import { styled } from 'styled-components';

export const HeaderContainer = styled.header`
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    width: 100%;

    img {
        width: 9vw;
        height: 15.9vh;
    }

    nav {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 15vh;
    color: #fff;

    ul {
        display: flex;
        justify-content: space-around;
        width: 100%;
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
        background-color: #000;
        border-radius: 10px;
        cursor: pointer;

        a {
            color: #fff;
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