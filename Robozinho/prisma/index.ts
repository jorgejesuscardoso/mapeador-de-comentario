import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criando Subs
  const subs = await prisma.sub.createMany({
    data: [
      { name: 'Luna-A1' },
      { name: 'Luna-A2' },
      { name: 'Luna-A3' },
      { name: 'Luna-A4' },
      { name: 'Luna-A5' },
      { name: 'Luna-A6' },
      { name: 'Luna-A7' },
    ],
  });

  // Buscando Subs
  const allSubs = await prisma.sub.findMany();

  // Criando Membros (Admins e Usuários)
  const members = await prisma.member.createMany({
    data: [
      { name: 'Anna França', user: 'Anna', password: '123', userWtp: '@Anna_Fransa', phone: '5585999999999', age: 99, points: 120, role: 'admin' },
      { name: 'Gleyce Messias', user: 'Gley', password: '123', userWtp: '@GleyMessias', phone: '5585999999999', age: 99, points: 250, role: 'admin' },
      { name: 'Leticia', user: 'Leticia', password: '123', userWtp: '@LehCorreia25', phone: '5585999999999', age: 99, points: 310, role: 'admin', subRole: 'counter' },
      { name: 'Katley', user: 'Yu', password: '123', userWtp: '@Yu_Suki', phone: '5585999999999', age: 99, points: 95, role: 'admin' },
      { name: 'João Pedro', user: 'Joao', password: '123', userWtp: '@JoaoPedroh19', phone: '5585999999999', age: 99, points: 180, role: 'admin' },
      { name: 'Jorge', user: 'JcBushido', password: '123', userWtp: '@JcBushido', phone: '5585999999999', age: 99, points: 210, role: 'admin', subRole: 'counter' },
      { name: 'DVRodry', user: 'DVRodry', password: '123', userWtp: '@DVRodry', phone: '5585999999999', age: 99, points: 45, role: 'user' },
    ],
  });

  // Buscando os membros criados
  const allMembers = await prisma.member.findMany();

  // Associando membros a Subs
  await prisma.memberSub.createMany({
    data: [
      { memberId: allMembers[0].id, subId: allSubs[0].id },
      { memberId: allMembers[1].id, subId: allSubs[1].id },
      { memberId: allMembers[2].id, subId: allSubs[2].id },
      { memberId: allMembers[2].id, subId: allSubs[4].id },
      { memberId: allMembers[2].id, subId: allSubs[5].id },
      { memberId: allMembers[3].id, subId: allSubs[3].id },
      { memberId: allMembers[3].id, subId: allSubs[6].id },
      { memberId: allMembers[4].id, subId: allSubs[4].id },
      { memberId: allMembers[5].id, subId: allSubs[5].id },
      { memberId: allMembers[6].id, subId: allSubs[1].id },
      { memberId: allMembers[6].id, subId: allSubs[2].id },
    ],
  });

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
