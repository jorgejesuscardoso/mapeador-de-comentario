// composables/toast.ts
import { ref } from 'vue'

interface Toast {
  id: number
  type: 'success' | 'error' | 'warning'
  message: string
}

const toasts = ref<Toast[]>([])

const createToast = (type: 'success' | 'error' | 'warning', message: string) => {
  const id = Date.now()
  toasts.value.push({ id, type, message })

  setTimeout(() => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }, 5000)
}

export const toast = {
  success: (msg: string) => createToast('success', msg),
  error: (msg: string) => createToast('error', msg),
  warning: (msg: string) => createToast('warning', msg),
}

export const useToasts = () => toasts
