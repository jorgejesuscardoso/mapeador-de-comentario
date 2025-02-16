import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomPoints() {
  return Math.floor(Math.random() * (4000000 - 10000 + 1)) + 10000;
}

async function main() {
  // Criando Membros (Admins e Usuários)
  const members = await prisma.member.createMany({
    data: [
      { name: 'Anna França', user: 'Anna', password: '123', userWtp: '@Anna_Fransa', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'adm', subs: ['Luna-A1'] },
      { name: 'Gleyce Messias', user: 'Gley', password: '123', userWtp: '@GleyMessias', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'adm', subs: ['Luna-A2'] },
      { name: 'Leticia', user: 'Leticia', password: '123', userWtp: '@LehCorreia25', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'adm', subRole: 'counter', subs: ['Luna-A3', 'Luna-A5', 'Luna-A6'] },
      { name: 'Katley', user: 'Yu', password: '123', userWtp: '@Yu_Suki', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'adm', subs: ['Luna-A4', 'Luna-A7'] },
      { name: 'João Pedro', user: 'Joao', password: '123', userWtp: '@JoaoPedroh19', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'adm', subs: ['Luna-A5'] },
      { name: 'Jorge', user: 'JcBushido', password: '123', userWtp: '@JcBushido', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'adm', subRole: 'counter', subs: ['Luna-A6'] },
      { name: 'DVRodry', user: 'DVRodry', password: '123', userWtp: '@DVRodry', phone: '5585999999999', age: 99, points: getRandomPoints(), role: 'member', subs: ['Luna-A2', 'Luna-A3'] },
    ],
  });

  // Buscando os membros criados
  const allMembers = await prisma.member.findMany();

  // Criando Livros
  await prisma.book.createMany({
    data: [
      { title: '𝑨 𝒗𝒆𝒓𝒅𝒂𝒅𝒆𝒊𝒓𝒂 𝒇𝒂𝒄𝒆 𝒅𝒐 𝒄𝒐𝒓𝒂𝒄̧𝒂̃𝒐', wUrl: 'https://www.wattpad.com/story/389352188', memberId: allMembers[0].id },
      { title: 'Darkbonds', wUrl: 'https://www.wattpad.com/story/386224532', memberId: allMembers[5].id },
      { title: 'Darkbonds 2 - O julgamento do homem corvo', wUrl: 'https://www.wattpad.com/story/387855056', memberId: allMembers[5].id },
    ],
  });

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
