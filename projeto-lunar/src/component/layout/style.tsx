import { styled } from 'styled-components';

export const LayOutContainer = styled.header`
    position: absolute;
    top: 0;
    width: 100%;
    height: 16vh;
    color: #fff;
`;

export const ButtonToTop = styled.button`
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: none;
    border: none;
    z-index: 9999;

    img {
        width: 100%;
        height: 100%;
    }
`;  