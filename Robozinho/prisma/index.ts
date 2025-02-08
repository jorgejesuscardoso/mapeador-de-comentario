import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  const sub1 = await prisma.sub.create({
    data: {
      name: 'Luna-A1',      
    },
  });

  const sub2 = await prisma.sub.create({
    data: {
      name: 'Luna-A2',      
    },
  });

  const sub3 = await prisma.sub.create({
    data: {
      name: 'Luna-A3',      
    },
  });

  const sub4 = await prisma.sub.create({
    data: {
      name: 'Luna-A4',      
    },
  });

  const sub5 = await prisma.sub.create({
    data: {
      name: 'Luna-A5',      
    },
  });

  const sub6 = await prisma.sub.create({
    data: {
      name: 'Luna-A6',      
    },
  });

  const sub7 = await prisma.sub.create({
    data: {
      name: 'Luna-A7',      
    },
  });

  // Criar um usuário
  const user = await prisma.adm.create({
    data: {
      name: 'Anna França',
      password: '123',
      user: 'Anna',
      userWtp: '@Anna_Fransa',
      phone: '5585999999999',
      age: 99,
      points: 0,
      role: 'adm',
    },
  });

  const user2 = await prisma.adm.create({
    data: {
      name: 'Gleyce Messias',
      password: 'Cruela',
      user: 'Gley',
      userWtp: '@GleyMessias',
      age: 99,
      phone: '5585999999999',
      points: 0,
      role: 'adm',      
    },
  });

  const user3 = await prisma.adm.create({
    data: {
      name: 'Leticia',
      password: '123',
      user: 'Leticia',
      userWtp: '@LehCorreia25',
      age: 99,
      phone: '5585999999999',
      points: 0,
      role: 'adm',
    },
  });

  const user4 = await prisma.adm.create({
    data: {
      name: 'Katley',
      password: '123',
      user: 'Yu',
      userWtp: '@Yu_Suki',
      phone: '5585999999999',
      age: 99,
      points: 0,
      role: 'adm',

    },
  });

  const user5 = await prisma.adm.create({
    data: {
      name: 'João Pedro',
      password: '123',
      user: 'Joao',
      userWtp: '@JoaoPedroh19',
      age: 99,
      phone: '5585999999999',
      points: 0,
      role: 'adm',
    },
  });

  const user6 = await prisma.adm.create({
    data: {
      name: 'Jorge',
      password: '123',
      user: 'JcBushido',
      userWtp: '@JcBushido',
      phone: '5585999999999',      
      age: 99,
      points: 0,
      role: 'adm',
    },
  });

  const user7 = await prisma.user.create({
    data: {
      name: 'DVRodry',
      password: '123',
      user: 'DVRodry',
      userWtp: '@DVRodry',
      phone: '5585999999999',
      age: 99,
      points: 0,
      role: 'user',
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user.id,
      subId: sub1.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user2.id,
      subId: sub2.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user3.id,
      subId: sub3.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user3.id,
      subId: sub5.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user3.id,
      subId: sub6.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user4.id,
      subId: sub4.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user4.id,
      subId: sub7.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user5.id,
      subId: sub5.id,
    },
  });

  await prisma.admSub.create({
    data: {
      admId: user6.id,
      subId: sub6.id,
    },
  });

  await prisma.book.create({
    data: {
      title: '𝑨 𝒗𝒆𝒓𝒅𝒂𝒅𝒆𝒊𝒓𝒂 𝒇𝒂𝒄𝒆 𝒅𝒐 𝒄𝒐𝒓𝒂𝒄̧𝒂̃𝒐',
      wUrl: 'https://www.wattpad.com/story/389352188-%F0%9D%91%A8-%F0%9D%92%97%F0%9D%92%86%F0%9D%92%93%F0%9D%92%85%F0%9D%92%82%F0%9D%92%85%F0%9D%92%86%F0%9D%92%8A%F0%9D%92%93%F0%9D%92%82-%F0%9D%92%87%F0%9D%92%82%F0%9D%92%84%F0%9D%92%86-%F0%9D%92%85%F0%9D%92%90-%F0%9D%92%84%F0%9D%92%90%F0%9D%92%93%F0%9D%92%82%F0%9D%92%84%CC%A7%F0%9D%92%82%CC%83%F0%9D%92%90',      
      adminId: user.id,
    },
  });

  await prisma.book.create({
    data: {
      title: 'Darkbonds',
      wUrl: 'https://www.wattpad.com/story/386224532-darkbonds',      
      adminId: user6.id,
    },
  });

  await prisma.book.create({
    data: {
      title: 'Darkbonds 2 - O julgamento do homem corvo',
      wUrl: 'https://www.wattpad.com/story/387855056-darkbonds-2-o-julgamento-do-corvo',      
      adminId: user6.id,
    },
  });

  await prisma.userSub.create({
    data: {
      userId: user7.id,
      subId: sub1.id,
    },
  });

  await prisma.userSub.create({
    data: {
      userId: user7.id,
      subId: sub2.id,
    },
  });




  console.log('Usuários criado:');

  // Buscar todos os usuários
  const users = await prisma.adm.findMany();
  console.log('Usuários:', users);
}

main()
  .catch(e => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  });
