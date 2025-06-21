import { chromium } from 'playwright';
import axios from 'axios';
import { parse } from 'php-array-parser';
import { title } from 'process';

export const RobozinhoV3 = async (wUser: string, wId: string) => {
  async function Robot() {
    try {
      // Monta a URL base da API de comentários
      const baseUrl = `https://www.wattpad.com/v5/comments/namespaces/parts/resources/${wId}/comments`;

      let comentarios: any[] = [];
      let hasAfter = true;
      let after: string | null = null;
      const commentsByUser: any = []

      while (hasAfter) {
        // Monta a URL da requisição, adicionando `after` se existir
        const url = after ? `${baseUrl}?limit=100&after=${after}` : `${baseUrl}?limit=100`;
        const response = await axios.get(url);

        const dados = response.data;

        if (dados?.comments?.length) {
          comentarios.push(...dados.comments);
        }

        // Atualiza o `after` para próxima página, ou finaliza o loop
        if (dados?.pagination?.after?.resourceId) {
          after = dados.pagination.after.resourceId;
        } else {
          hasAfter = false;
        }
      }

      if (comentarios.length > 0) {
        for (const comment of comentarios) {
          if (comment?.user?.name?.toLowerCase() === wUser.toLowerCase()) {
            commentsByUser.push(comment);
          }
        }
      }

      return commentsByUser;
    } catch (error) {
      console.error('Erro ao buscar comentários:', error);
      return null;
    }
  }

  return Robot();
};


export const FindBook = async (id: any) => {
    const response = await axios.get(`https://www.wattpad.com/api/v3/stories/${id}`).then(response => {
      return response.data
    }).catch(error => {
      console.error('Erro na requisição:', error.response?.status, error.message);
    });

    const raw = parse(response)
    const tagsArray = Object.values(raw.tags);
    const capsArray = Object.values(raw.parts)
    const capsFormated = capsArray.map((s: any) => {
      return {
        title: s.title,
        url: s.url,
        createdAt: s.createDate,
        length: s.length,
        comments: s.commentCount,
        votes: s.voteCount,
        reads: s.readCount,
        thumb: s.photoUrl,
      }
    })
    const data = {
      id: raw.id,
      title: raw.title,
      createdAt: raw.createDate,
      votes: raw.voteCount,
      comments: raw.commentCount,
      user: {
        userName: raw.user.name,
        avatar: raw.user.avatar,
        name: raw.user.fullname
      },
      describe: raw.description,
      cover: raw.cover,
      completed: raw.completed,
      tags: tagsArray,
      mature: raw.mature,
      url: raw.url,
      numCaps: raw.numParts,
      caps: capsFormated,
      readTotal: raw.readCount
    }
    return data
};
