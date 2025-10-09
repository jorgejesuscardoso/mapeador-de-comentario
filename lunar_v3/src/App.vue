<script setup lang="ts">
import Layout from './base/layout/Layout.vue'
import CookiesWarning from './base/modals/CookiesWarning.vue';
import ToastContainer from './base/utils/toastContainer.vue';
</script>

<template>
    <router-view />
    <ToastContainer />
    <CookiesWarning />
</template>
