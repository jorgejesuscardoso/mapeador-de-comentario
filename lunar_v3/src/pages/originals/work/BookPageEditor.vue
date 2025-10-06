<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { toast } from '@/base/utils/toast'
import Lucide from '@/base/lucide/Lucide.vue'
import { getBookLunarById, getChapterLunarById, updateChapterLunarById } from '@/API/OriginalLunarApi'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = ref('')
const content = ref('')

const lastSaved = ref<number | null>(null)
const saving = ref(false)
const editor = ref<HTMLElement | null>(null)
const editorText = ref('')
const bookData = ref(null)

let holdPrevSave = 0

const bookId = route.params.bookId as string

const chapterId = route.params.chapterId as string

let inactivityTimer: ReturnType<typeof setTimeout> | null = null

// contadores
// contadores reativos
const wordCount = computed(() =>
  editorText.value.trim().split(/\s+/).filter(Boolean).length
)
const charCount = computed(() => editorText.value.length)

// ids
let paragraphIdCounter = 0
function generateId() {
  paragraphIdCounter++
  return `coment-paragraph-${Date.now()}-${paragraphIdCounter}`
}

// ========================
// Utils DOM / caret
// ========================
function setCaretToStart(node: Node) {
  const r = document.createRange()
  r.setStart(node, 0)
  r.collapse(true)
  const s = window.getSelection()
  s?.removeAllRanges()
  s?.addRange(r)
}

function setCaretAfter(node: Node) {
  const r = document.createRange()
  r.setStartAfter(node)
  r.collapse(true)
  const s = window.getSelection()
  s?.removeAllRanges()
  s?.addRange(r)
}

function isCaretAtEnd(el: HTMLElement, range: Range | null): boolean {
  if (!range) return false
  const temp = range.cloneRange()
  const endRange = document.createRange()
  endRange.selectNodeContents(el)
  endRange.collapse(false) // end
  return temp.compareBoundaryPoints(Range.START_TO_END, endRange) === 0
}

// ========================
// Normalização / inicialização
// ========================
function ensureInitialParagraph() {
  if (!editor.value) return
  const text = editor.value.innerText || ''
  if (!text.trim()) {
    // placeholder br tem attribute data-placeholder="true"
    editor.value.innerHTML = '<p><br data-placeholder="true"></p>'
    return
  }
  normalizeEditor()
}

function normalizeEditor() {
  if (!editor.value) return

  // transformar nós soltos em <p>
  let i = 0
  while (i < editor.value.childNodes.length) {
    const node = editor.value.childNodes[i] as ChildNode
    if (node.nodeType === Node.ELEMENT_NODE && (node as Element).nodeName === 'P') {
      i++
      continue
    }
    // cria um <p> e agrupa nós não-P contíguos
    const p = document.createElement('p')
    while (i < editor.value.childNodes.length) {
      const current = editor.value.childNodes[i] as ChildNode
      if (current.nodeType === Node.ELEMENT_NODE && (current as Element).nodeName === 'P') break
      p.appendChild(current) // move o nó para dentro do p
    }
    // garantir placeholder se vazio
    if (!p.textContent?.trim()) p.innerHTML = '<br data-placeholder="true">'
    editor.value.insertBefore(p, editor.value.childNodes[i] || null)
    i++
  }

  // remove p vazios redundantes e assegura que cada p seja só p
  const ps = Array.from(editor.value.querySelectorAll('p'))
  ps.forEach(p => {
    // se p está vazio (apenas whitespace) e não tem br placeholder, transforma em placeholder
    if (!(p.textContent || '').trim()) {
      // limpar filhos e colocar placeholder
      p.innerHTML = '<br data-placeholder="true">'
      delete p.dataset.hadBr
      // não atribuir id a parágrafo vazio
      if (p.id) p.removeAttribute('id')
    } else {
      // Se tem texto, garante id (se ainda não tiver)
      if (!p.id) p.id = generateId()
    }
  })
}

// ========================
// Seleção / parágrafo atual
// ========================
function getCurrentParagraph(): HTMLElement | null {
  if (!editor.value) return null
  const sel = window.getSelection()
  if (!sel?.focusNode) return null
  let node: Node | null = sel.focusNode
  while (node && node !== editor.value) {
    if ((node as HTMLElement).nodeName === 'P') return node as HTMLElement
    node = node.parentNode
  }
  return null
}

// Se não houver P no foco, tenta criar/garantir um P ao redor do foco
function ensureParagraphAtSelection(): HTMLElement | null {
  if (!editor.value) return null
  const sel = window.getSelection()
  if (!sel || !sel.focusNode) return null

  let p = getCurrentParagraph()
  if (p) return p

  // Se o focusNode for a própria editor div, cria um novo p
  if (sel.focusNode === editor.value) {
    const newP = document.createElement('p')
    newP.innerHTML = '<br data-placeholder="true">'
    editor.value.appendChild(newP)
    setCaretToStart(newP)
    return newP
  }

  // se for um textNode solto, wrap no topo
  // achar o filho top-level do editor que contém o foco
  let top: Node | null = sel.focusNode
  while (top && top.parentNode && top.parentNode !== editor.value) top = top.parentNode
  if (!top) return null

  const wrapper = document.createElement('p')
  wrapper.appendChild(top.cloneNode(true))
  editor.value.replaceChild(wrapper, top)
  setCaretToStart(wrapper)
  return wrapper
}

// ========================
// Enter handling (correção)
// ========================
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault()
    // chama tua função aqui
    handleShiftEnter()
  } else if (e.key === 'Enter') {
    handleEnter()
    scheduleSave()
  }
}
function handleShiftEnter() {
  if (!editor.value) return
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return
  const range = sel.getRangeAt(0)

  let currentP = getCurrentParagraph()
  if (!currentP) currentP = ensureParagraphAtSelection()
  if (!currentP) return

  // Caso: apenas quebra de linha dentro do P
  const br1 = document.createElement('br')
  const br2 = document.createElement('br')
  range.insertNode(br1)
  range.insertNode(br2)
  range.setStartAfter(br1)
  range.setEndAfter(br1)
  sel.removeAllRanges()
  sel.addRange(range)
}

function handleEnter() {
  if (!editor.value) return
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount) return
  const range = sel.getRangeAt(0)

  let currentP = getCurrentParagraph()
  if (!currentP) currentP = ensureParagraphAtSelection()
  if (!currentP) return

  const html = currentP.innerHTML

  // Detecta se já terminou com <br> => significa que é o segundo Enter
  if (html.endsWith('<br><br>')) {
    // aplica id se necessário
    if (!currentP.id && (currentP.textContent || '').trim()) {
      currentP.id = generateId()
    }

    // cria novo P
    const newP = document.createElement('p')
    currentP.insertAdjacentElement('afterend', newP)

    setCaretToStart(newP)
    return
  }

  // Caso: apenas quebra de linha dentro do P
  const br1 = document.createElement('br')
  const br2 = document.createElement('br')
  range.insertNode(br1)
  range.insertNode(br2)
  range.setStartAfter(br1)
  range.setEndAfter(br1)
  sel.removeAllRanges()
  sel.addRange(range)

  // garante id se houver texto
  if (!currentP.id && (currentP.textContent || '').trim()) {
    currentP.id = generateId()
  }
}

// ========================
// Salvamento & autosave
// ========================
function onInput() {
  normalizeEditor()

  if (editor.value) {
    editorText.value = editor.value.innerText  // <-- atualiza aqui
    Array.from(editor.value.querySelectorAll('p')).forEach(p => {
      if ((p.textContent || '').trim() && !p.id) p.id = generateId()
      if (!(p.textContent || '').trim()) {
        p.innerHTML = '<br data-placeholder="true">'
        if (p.id) p.removeAttribute('id')
        delete p.dataset.hadBr
      }
    })
  }

  scheduleSave()
}

async function save() {
  if (!editor.value) return
  normalizeEditor() // garante IDs e estrutura antes de salvar

  // pega todos os <p> e salva o elemento completo (outerHTML)
  const ps = Array.from(editor.value.querySelectorAll('p'))
  const fullHtml = ps.map(p => p.outerHTML).join('')

  const payload = {
    title: title.value,
    wordsCount: wordCount.value,
    paragraphs: fullHtml,
  }

  await updateChapterLunarById(bookId, chapterId, payload)
  
  saving.value = true
  setTimeout(() => { saving.value = false }, 1000)
}

function scheduleSave() {
  if (inactivityTimer) clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(() => {
    save()
    inactivityTimer = null
  }, 3000)
}

const cancelEdit = () => router.back()

// ========================
// lifecycle
// ========================
onMounted(async () => {
  const response = await getChapterLunarById(bookId,chapterId) 

  if(response.status === 200){
    bookData.value = response.data
    title.value = response.data.title
    normalizeEditor()
    editor.value.innerHTML = response.data.paragraphs
  }
  
  if (editor.value && !editor.value.innerHTML.trim()) {
    editor.value.innerHTML = '<p><br></p>'
  }
  setTimeout(() => ensureInitialParagraph(), 0)
})

watch(title, () =>{
  if(holdPrevSave > 0) return  scheduleSave()
  holdPrevSave++
})

onUnmounted(() => {
  if (inactivityTimer) clearTimeout(inactivityTimer)
})
</script>

<template>
  <div class="w-full min-h-screen flex flex-col bg-white">
    <header class="w-full sticky top-0 z-20 bg-white border-b shadow-sm px-6 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="relative w-10 h-14">
          <img :src="bookData ? bookData?.cover : ''" alt="Capa do livro" class="w-full h-full object-cover rounded-md border"/>
        </div>
        <div>
          <div class="font-bold text-gray-800 text-lg">{{ bookData?.bookName }}</div>
          <div class="font-semibold text-gray-800 text-sm">{{ title || 'Capítulo: ??' }}</div>
          <div class="text-xs text-gray-500">{{ wordCount }} palavras • {{ charCount }} caracteres</div>
        </div>
        <div v-if="saving" class="flex items-center justify-center text-green-500 gap-1">
          <p class="text-sm">Salvando...</p>
          <Lucide icon="RefreshCw" class="h-5 w-5 animate-spin" :stroke-width="1" />
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="save" class="px-4 py-2 rounded-md bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold shadow-sm">Salvar</button>
        <button @click="cancelEdit" class="px-4 py-2 rounded-md border text-sm text-gray-600 hover:bg-gray-50">Cancelar</button>
      </div>
    </header>

    <section class="w-full px-6 py-6 flex justify-center bg-white">
      <input v-model="title" type="text" placeholder="Título do capítulo..." class="w-full bg-transparent border-b border-gray-300 focus:outline-none py-2 text-3xl font-bold text-center placeholder-gray-400"/>
    </section>

    <main class="flex-1 px-6 pb-12 flex justify-center bg-white">
      <div
        ref="editor"
        contenteditable="true"
        class="w-full max-w-xl min-h-[80vh] bg-white p-6 text-base leading-relaxed font-serif focus:outline-none outline-none pb-96"
        @keydown="onKeyDown"
        @input="onInput"
      >
      </div>
    </main>
  </div>
</template>

