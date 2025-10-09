<script setup>
// Nenhuma lógica complexa necessária aqui, é uma página estática.
</script>

<template>
  <section class="flex items-start justify-end px-6 w-full">
    <div class="container w-[85v] p-6 text-gray-300">
      <h1>Política de Cookies</h1>
      <p>
        Esta Política de Cookies explica como o <strong>Projeto Lunar</strong> utiliza cookies e tecnologias semelhantes para reconhecer você quando visita nosso site.
      </p>

      <h2>O que são cookies?</h2>
      <p>
        Cookies são pequenos arquivos de texto armazenados no seu dispositivo para melhorar sua experiência de navegação. Eles ajudam a lembrar suas preferências, entender como o site é utilizado e mostrar conteúdo relevante.
      </p>

      <h2>Como usamos cookies</h2>
      <ul>
        <li><strong>Cookies essenciais:</strong> necessários para o funcionamento do site.</li>
        <li><strong>Cookies de desempenho:</strong> ajudam a entender como os visitantes interagem com o site (Google Analytics, por exemplo).</li>
        <li><strong>Cookies de publicidade:</strong> utilizados por plataformas como o Google AdSense para exibir anúncios relevantes.</li>
      </ul>

      <h2>Gerenciamento de cookies</h2>
      <p>
        Você pode desativar cookies nas configurações do seu navegador, mas isso pode afetar algumas funcionalidades do site.
      </p>

      <h2>Mais informações</h2>
      <p>
        Para saber mais, consulte também nossa
        <router-link to="/politica-de-privacidade">Política de Privacidade</router-link>
        e nossos
        <router-link to="/termos-de-uso">Termos de Uso</router-link>.
      </p>
    </div>
  </section>
</template>
<style scoped>
.cookies-policy {
  background-color: #0b0b0d;
  color: #f1f1f1;
  padding: 4rem 2rem;
  line-height: 1.8;
}


h1, h2 {
  color: #a682ff;
  margin-bottom: 1rem;
}

ul {
  margin-left: 1.5rem;
  list-style: disc;
}

a {
  color: #a682ff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
