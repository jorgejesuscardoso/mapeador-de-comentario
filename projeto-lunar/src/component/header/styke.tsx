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
    padding-right: 1rem;

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

    button.logout-button {
        z-index: 10;
        background: none;
        border: none;
        cursor: pointer;
        width: 40px;
        margin: 0 10px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    /* Botão de menu hamburger */
    .menu-button {
        display: none;
        background: none;
        border: none;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        z-index: 100;
        width: 50px;
        height: 50px;

        img {
            width: 100%;
            height: 100%;
        }
    }

    /* Media Query para dispositivos móveis */
    @media (max-width: 768px) {
        //background: linear-gradient(135deg, #151a61, #490e75);        
        background-image: url('bg-star.webp');
        background-size: cover;        
        background-position: center;
        padding: 0;
        color: #fff;
        box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5);

        .menu-button {
            display: block; 
            
            img {
                width: 25px;
                height: 25px;
            }
        }

        button.logout-button {
            margin: 0 10px;                 
            opacity: 0.7;
            transition: 0.3s;

            img {
                width: 25px;
                height: 25px;
            }
        }

        button {
            background: none;
            border: none;
            cursor: pointer;
        }   

        img.logo {
            display: none;
        }

        nav {
            display: none;
            flex-direction: column;
            position: absolute;
            top: 60px;
            left: 0;
            width: 100%;
            height: auto;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99;
        }

        nav.active {            
            background: rgba(0, 0, 0, 0.9);
            display: flex;            
            box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.5);
            margin: -10px 0;
            padding: 10px;
            z-index: 9999;

            ul {
                flex-direction: column;
                width: 100%;
                gap: 0;
            }

            li {
                width: 100%;
                height: 45px !important;

                a {
                    height: 100%;
                    width: 100%;
                    color: #e7e7e7;
                    font-size: 0.8rem;
                }
            }
        }

        ul {
            flex-direction: column;
            width: 100%;
            gap: 10px;
        }

        li {
            width: 100%;
            text-align: center;
        }
    }
`;
