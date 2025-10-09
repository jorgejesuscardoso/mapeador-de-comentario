<script setup>
import { ref, onMounted } from 'vue'

const show = ref(false)

onMounted(() => {
  const accepted = localStorage.getItem('cookiesAccepted')
  if (!accepted) {
    setTimeout(() => (show.value = true), 1500)
  }
})

function acceptCookies() {
  localStorage.setItem('cookiesAccepted', 'true')
  show.value = false
}
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="cookie-modal">
      <div class="cookie-box">
        <p>
          Usamos cookies para melhorar sua experiência e analisar o uso do site.  
          Ao continuar navegando, você concorda com nossa
          <router-link to="/politica-de-privacidade">Política de Privacidade</router-link>,
          <router-link to="/termos-de-uso">Termos de Uso</router-link> e
          <router-link to="/cookies">Política de Cookies</router-link>.
        </p>
        <button @click="acceptCookies" class="bg-white px-2 py-1 rounded-md text-black/85 font-bold">Aceitar</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.cookie-modal {
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(15, 15, 20);
  color: #f1f1f1;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.6);
  z-index: 9999;
  max-width: 600px;
  margin: 0 auto;
}

.cookie-box p {
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.accept-btn {
  background: linear-gradient(90deg, #a682ff, #6c47ff);
  color: #fff;
  border: none;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.accept-btn:hover {
  background: linear-gradient(90deg, #b99bff, #7e59ff);
}

a {
  color: #a682ff;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
