import { FooterContainer, FooterText, Highlight } from "./style";

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>
        <Highlight>Projeto Lunar</Highlight> - Onde a Lua Ilumina os Livros 📖🌙
      </FooterText>
      <FooterText>Desenvolvido por <Highlight>JcBushido</Highlight></FooterText>
      <FooterText>🚀 Sem localização física | Nenhuma parceria no momento</FooterText>
    </FooterContainer>
  );
};

export default Footer;
