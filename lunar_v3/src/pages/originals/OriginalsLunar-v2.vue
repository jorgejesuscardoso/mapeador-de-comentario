<script setup lang="ts">
import { ref } from "vue"

interface Obra {
  id: number
  titulo: string
  autor: string
  capa: string
  descricao: string
  genero: string
  tags: string[]
  comentarios: number
  votos: number
  views: number
  adulto: boolean
  ranking: number
}

const obras = ref<Obra[]>([
  {
    id: 1,
    titulo: "A Canção da Lua",
    autor: "Maria Silva",
    capa: "https://placehold.co/300x420",
    descricao: "Uma jornada mágica sob a luz de Lunara.",
    genero: "Fantasia",
    tags: ["Magia", "Romance", "Aventura"],
    comentarios: 124,
    votos: 980,
    views: 13400,
    adulto: false,
    ranking: 1
  },
  {
    id: 2,
    titulo: "Sombras de Aelorian",
    autor: "João Cardoso",
    capa: "https://placehold.co/300x420",
    descricao: "Segredos antigos despertam no reino perdido.",
    genero: "Dark Fantasy",
    tags: ["Mistério", "Guerras", "Traição"],
    comentarios: 89,
    votos: 770,
    views: 9400,
    adulto: true,
    ranking: 2
  },
  {
    id: 3,
    titulo: "O Último Feiticeiro",
    autor: "Ana Costa",
    capa: "https://placehold.co/300x420",
    descricao: "Entre batalhas e maldições, nasce uma lenda.",
    genero: "Aventura",
    tags: ["Feitiçaria", "Heroísmo", "Viagem"],
    comentarios: 203,
    votos: 1560,
    views: 22400,
    adulto: false,
    ranking: 3
  },
  {
    id: 4,
    titulo: "Corações em Cinzas",
    autor: "Lívia Torres",
    capa: "https://placehold.co/300x420",
    descricao: "Amor e dor se encontram em um mundo em ruínas.",
    genero: "Romance",
    tags: ["Drama", "Apocalipse", "Amor"],
    comentarios: 42,
    votos: 320,
    views: 4200,
    adulto: true,
    ranking: 5
  },
  {
    id: 4,
    titulo: "Corações em Cinzas",
    autor: "Lívia Torres",
    capa: "https://placehold.co/300x420",
    descricao: "Amor e dor se encontram em um mundo em ruínas.",
    genero: "Romance",
    tags: ["Drama", "Apocalipse", "Amor"],
    comentarios: 42,
    votos: 320,
    views: 4200,
    adulto: true,
    ranking: 5
  },
  {
    id: 4,
    titulo: "Corações em Cinzas",
    autor: "Lívia Torres",
    capa: "https://placehold.co/300x420",
    descricao: "Amor e dor se encontram em um mundo em ruínas.",
    genero: "Romance",
    tags: ["Drama", "Apocalipse", "Amor"],
    comentarios: 42,
    votos: 320,
    views: 4200,
    adulto: true,
    ranking: 5
  },
  {
    id: 4,
    titulo: "Corações em Cinzas",
    autor: "Lívia Torres",
    capa: "https://placehold.co/300x420",
    descricao: "Amor e dor se encontram em um mundo em ruínas.",
    genero: "Romance",
    tags: ["Drama", "Apocalipse", "Amor"],
    comentarios: 42,
    votos: 320,
    views: 4200,
    adulto: true,
    ranking: 5
  },
  {
    id: 4,
    titulo: "Corações em Cinzas",
    autor: "Lívia Torres",
    capa: "https://placehold.co/300x420",
    descricao: "Amor e dor se encontram em um mundo em ruínas.",
    genero: "Romance",
    tags: ["Drama", "Apocalipse", "Amor"],
    comentarios: 42,
    votos: 320,
    views: 4200,
    adulto: true,
    ranking: 5
  }
])
</script>

<template>
  <div
    class="w-full bg-white absolute left-0 top-10 z-0 flex items-start justify-end px-6"
  >
    <div class="w-full lg:w-[83vw]">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4 text-center text-indigo-500">
        Obras Originais Lunar <span class="text-sm text-indigo-400/80">(Em breve)</span>
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        <div
          v-for="obra in obras"
          :key="obra.id"
          class="bg-white rounded-lg shadow hover:shadow-xl transition overflow-hidden flex flex-col border border-gray-300"
        >
          <!-- CAPA -->
          <div class="relative">
            <img
              :src="obra.capa"
              :alt="obra.titulo"
              class="w-full h-40 object-cover"
            />
            <!-- Selo +18 -->
            <span
              v-if="obra.adulto"
              class="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
            >
              +18
            </span>
            <!-- Ranking -->
            <span
              class="absolute top-2 right-2 bg-indigo-700 text-white text-xs font-bold px-2 py-1 rounded"
            >
              #{{ obra.ranking }}
            </span>
          </div>

          <!-- INFO -->
          <div class="p-2 flex flex-col flex-grow">
            <h3 class="font-semibold text-gray-800 text-base truncate">
              {{ obra.titulo }}
            </h3>
            <p class="text-xs text-gray-500 mb-1">por {{ obra.autor }}</p>
            <p class="text-[11px] text-indigo-600 font-medium mb-2">{{ obra.genero }}</p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="tag in obra.tags"
                :key="tag"
                class="bg-gray-200 text-gray-600 text-[10px] px-2 py-0.5 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Stats -->
            <div class="flex items-center justify-between text-[10px] text-gray-600 mt-auto">
              <span>💬 {{ obra.comentarios }}</span>
              <span>👍 {{ obra.votos }}</span>
              <span>👁️ {{ obra.views }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
