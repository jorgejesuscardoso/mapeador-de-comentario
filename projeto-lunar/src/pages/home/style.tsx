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
  align-items: flex-start;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #0009;
  z-index: 111;
  position: relative;
  top: 0;
  left: 0;
`;

export const AsideLeft = styled.aside`
  background-color: #14141499;
  position: absolute;
  left: 0;
  top: 0;
  border-right: 2px solid #141414;
  border-bottom: 2px solid #141414;
  padding: 20px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 22%;
  min-height: 450px;
  height: 100%;
  max-height: 100vh;
  text-align: left;

  h1 {
      text-align: center;
      font-size: 1.3rem;
      font-weight: bold;
      color: #ccc;
      width: 100%;
      margin-bottom: 15px;
  }

  h2 {
      font-size: 1rem;
      color: #ccc;
      margin-bottom: 10px;
  }

  h3 {
      font-size: 0.9rem;
      color: #ccc;
      margin-bottom: 30px;
  }

  b {
      color: #ccc;
      font-size: 0.75rem;
  }

  b#points {
      color: #ff0;
      font-size: 1.1rem;
  }

  p {
      font-size: 0.8rem;
      color: #ccc;
      margin-bottom: 8px;
      line-height: 1.5;
  }

  p:last-child {
      margin-top: 100px;
      font-size: 1.2rem;
      font-weight: bold;
      color: #ccc;
  }

  @media (max-width: 768px) {
      display: none;
  }
`;
