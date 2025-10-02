<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

// props
const props = defineProps<{
  bookId?: string
  pageId?: string
  autosaveDelay?: number
}>()

const autosaveDelay = props.autosaveDelay ?? 10000

// chave storage
const key = computed(() => {
  const b = props.bookId ?? 'draft'
  const p = props.pageId ?? 'page'
  return `lunar:book:${b}:page:${p}`
})

const title = ref('')
const content = ref('')
const isSaving = ref(false)
const lastSaved = ref<number | null>(null)
const saveIndicator = ref('')
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const caret = ref<number | null>(null)

let inactivityTimer: ReturnType<typeof setTimeout> | null = null
let pendingSavePromise: Promise<void> | null = null

const charCount = computed(() => content.value.length)
const wordCount = computed(() => {
  const s = content.value.trim()
  if (!s) return 0
  const matches = s.match(/\b[\w']+\b/g)
  return matches ? matches.length : 0
})

async function performSave() {
  try {
    isSaving.value = true
    saveIndicator.value = 'Salvando...'
    const payload = {
      title: title.value,
      content: content.value,
      savedAt: Date.now(),
      caret: caret.value
    }
    await new Promise(r => setTimeout(r, 150))
    localStorage.setItem(key.value, JSON.stringify(payload))
    lastSaved.value = payload.savedAt
    saveIndicator.value = 'Salvo'
    setTimeout(() => {
      if (saveIndicator.value === 'Salvo') saveIndicator.value = ''
    }, 2500)
  } catch (err) {
    console.error('Erro ao salvar', err)
    saveIndicator.value = 'Erro ao salvar'
  } finally {
    isSaving.value = false
  }
}

async function saveNow() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
  }
  pendingSavePromise = performSave()
  await pendingSavePromise
  pendingSavePromise = null
}

function scheduleAutoSave() {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(async () => {
    await performSave()
    inactivityTimer = null
  }, autosaveDelay)
}

function restore() {
  try {
    const raw = localStorage.getItem(key.value)
    if (!raw) return
    const parsed = JSON.parse(raw)
    title.value = parsed.title ?? title.value
    content.value = parsed.content ?? content.value
    lastSaved.value = parsed.savedAt ?? lastSaved.value
    caret.value = typeof parsed.caret === 'number' ? parsed.caret : null
    nextTick(() => {
      if (textareaRef.value && caret.value !== null) {
        try {
          textareaRef.value.selectionStart = textareaRef.value.selectionEnd = caret.value
          textareaRef.value.focus()
        } catch {}
      }
    })
  } catch (err) {
    console.error('Erro ao restaurar rascunho', err)
  }
}

function onInputText(e: Event) {
  const el = e.target as HTMLTextAreaElement
  caret.value = el.selectionStart
  scheduleAutoSave()
}

async function onBlurSave() {
  const isEqual = JSON.parse(localStorage.getItem(key.value))

  if(isEqual && (isEqual.title === title.value && isEqual.content === content.value)) return
  await saveNow()
}

function handleBeforeUnload() {
  if (inactivityTimer) {
    try {
      const payload = {
        title: title.value,
        content: content.value,
        savedAt: Date.now(),
        caret: caret.value
      }
      localStorage.setItem(key.value, JSON.stringify(payload))
      lastSaved.value = payload.savedAt
    } catch (err) {
      console.error('Erro ao salvar antes de unload', err)
    }
  }
}

onMounted(() => {
  restore()
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onUnmounted(() => {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer)
    inactivityTimer = null
    try {
      const payload = {
        title: title.value,
        content: content.value,
        savedAt: Date.now(),
        caret: caret.value
      }
      localStorage.setItem(key.value, JSON.stringify(payload))
      lastSaved.value = payload.savedAt
    } catch (err) {
      console.error('Erro ao salvar no unmount', err)
    }
  }
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

function formatTimestamp(ts: number | null) {
  if (!ts) return '-'
  const d = new Date(ts)
  return d.toLocaleString()
}
</script>

<template>
  <div class="h-screen w-screen flex flex-col bg-gray-50">
    <!-- Top Bar -->
    <header class="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 mt-10 lg:mt-12 bg-white shadow-md border-b gap-3">
      <div class="flex-1 w-full">
        <input
          v-model="title"
          type="text"          
          @blur="onBlurSave"
          placeholder="Título da página / capítulo"
          class="w-full bg-transparent border-b border-gray-300 focus:outline-none py-2 text-xl font-semibold placeholder-gray-400"
        />
        <div class="text-xs text-gray-500 mt-1">
          LocalStorage: <span class="font-mono">{{ key }}</span>
        </div>
      </div>

      <div class="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
        <div class="text-xs text-gray-600">
          <div>Palavras: <span class="font-semibold">{{ wordCount }}</span></div>
          <div>Caracteres: <span class="font-semibold">{{ charCount }}</span></div>
        </div>

        <div class="flex flex-col items-end">
          <button
            @click="saveNow"
            :disabled="isSaving"
            class="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-sm transition-colors"
          >
            {{ isSaving ? 'Salvando...' : 'Salvar' }}
          </button>
          <div class="text-xs text-gray-400 mt-1">
            {{ saveIndicator || (lastSaved ? 'Último: ' + formatTimestamp(lastSaved) : 'Nunca salvo') }}
          </div>
        </div>
      </div>
    </header>

    <!-- Editor -->
    <main class="flex-1 overflow-hidden">
      <textarea
        ref="textareaRef"
        v-model="content"
        @input="onInputText"
        @blur="onBlurSave"
        placeholder="Escreva aqui sua página... (autosave após 10s de inatividade)"
        class="w-full h-full resize-none p-6 bg-white focus:outline-none focus:ring-0 text-base leading-relaxed font-serif"
      ></textarea>
    </main>

    <!-- Footer -->
    <footer class="flex items-center justify-between px-6 py-3 text-xs text-gray-500 bg-gray-100 border-t">
      <div>Dica: alterações são salvas automaticamente após {{ autosaveDelay/1000 }}s de inatividade.</div>
      <button @click="() => { content = ''; title = ''; }" class="text-red-500 hover:underline">
        Limpar rascunho
      </button>
    </footer>
  </div>
</template>
