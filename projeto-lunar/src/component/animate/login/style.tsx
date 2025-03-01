import styled from "styled-components";

export const ContainerAnimated = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    color: #fff;
    font-size: 2rem;

    video {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
    }

    @media (max-width: 768px) {
        width: 100vw;
    }
`;