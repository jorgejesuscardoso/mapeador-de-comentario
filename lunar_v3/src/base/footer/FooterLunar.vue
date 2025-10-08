
<script setup>
// Nenhum script necessário no momento
</script>
<template>
  <footer class="bg-zinc-950 text-zinc-300 py-10 px-6 border-t border-zinc-800">
    <div class="mx-auto grid md:grid-cols-3 gap-8">
      <!-- Logo e descrição -->
      <div>
        <h2 class="text-2xl font-bold text-white mb-2">Projeto Lunar</h2>
        <p class="text-sm text-zinc-400 leading-relaxed">
          Onde a Lua ilumina os livros. Um portal para leitores, escritores e sonhadores.
        </p>
      </div>

      <!-- Links rápidos -->
      <div>
        <h3 class="text-lg font-semibold text-white mb-3">Links</h3>
        <ul class="space-y-2">
          <li><RouterLink to="/politica-de-privacidade" class="hover:text-violet-400 transition">Política de Privacidade</RouterLink></li>
          <li><RouterLink to="/termos-de-uso" class="hover:text-violet-400 transition">Termos de Uso</RouterLink></li>
          <li><RouterLink to="/politica-de-cookies" class="hover:text-violet-400 transition">Política de Cookies</RouterLink></li>
        </ul>
      </div>

      <!-- Redes sociais -->
      <div>
        <h3 class="text-lg font-semibold text-white mb-3">Conecte-se</h3>
        <div class="flex space-x-4">
          <a href="https://twitter.com" target="_blank" class="hover:text-violet-400 transition">
            <i class="fab fa-twitter text-xl"></i>
          </a>
          <a href="https://instagram.com" target="_blank" class="hover:text-violet-400 transition">
            <i class="fab fa-instagram text-xl"></i>
          </a>
          <a href="https://github.com" target="_blank" class="hover:text-violet-400 transition">
            <i class="fab fa-github text-xl"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Linha final -->
    <div class="mt-10 border-t border-zinc-800 pt-4 text-sm text-zinc-500 text-center">
      <p>&copy; {{ new Date().getFullYear() }} Projeto Lunar. Todos os direitos reservados.</p>
      <p class="text-xs mt-1">Desenvolvido com ☕ e 🌙 por <span class="text-violet-400 font-medium">Bushido</span></p>
    </div>
  </footer>
</template>

