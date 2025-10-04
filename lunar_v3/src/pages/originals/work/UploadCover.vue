<script setup lang="ts">
import { upLoadCover } from '@/API/OriginalLunarApi'
import { toast } from '@/base/utils/toast'
import { ref } from 'vue'

const file = ref<File | null>(null)
const preview = ref<string | null>(null)
const uploading = ref(false)
const uploadedUrl = ref<string | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    preview.value = URL.createObjectURL(file.value)
  }
}

async function uploadFile() {
  if (!file.value) return toast.warning('Selecione uma imagem primeiro')
  uploading.value = true

  const formData = new FormData()
  formData.append('cover', file.value)
  
  try {
    const bookName = 'Talvez Seja Amor';
    const bookId = 'b1a2c3d4-5678-90ab-cdef-1234567890ab';
    const res = await upLoadCover(formData, bookId, bookName)
    
    if (res.status === 200) {
      uploadedUrl.value = res.data.url
      toast.success('Capa enviada com sucesso!')
    } else {
      toast.error('Erro ao enviar imagem')
    }
  } catch (err) {
    console.error(err)
    toast.error('Erro na requisição')
  } finally {
    uploading.value = false
  }
}
</script>

<template>
  <div class="p-4 max-w-md mx-auto border rounded-lg shadow-md bg-white">
    <h2 class="text-xl font-bold mb-3">Enviar Capa</h2>

    <input type="file" accept="image/*" @change="onFileChange" class="mb-3" />

    <div v-if="preview" class="mb-3">
      <img :src="preview" class="w-full h-auto rounded-md border" />
    </div>

    <button
      @click="uploadFile"
      :disabled="uploading"
      class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50 mb-3"
    >
      {{ uploading ? 'Enviando...' : 'Enviar' }}
    </button>

    <div v-if="uploadedUrl" class="mt-3 text-sm">
      <p>Imagem enviada com sucesso! 👇</p>
      <a :href="uploadedUrl" target="_blank" class="text-blue-600 underline break-all">{{ uploadedUrl }}</a>
      <img :src="uploadedUrl" class="mt-2 w-32 h-auto rounded-md border" />
    </div>
  </div>
</template>
