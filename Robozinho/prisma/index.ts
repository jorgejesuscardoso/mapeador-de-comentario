import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Criar um usuário
  // const user = await prisma.adm.create({
  //   data: {
  //     name: 'Anna França',
  //     password: 'Vizinha',
  //     user: 'Anna',
  //     userWtp: 'Anna_Fransa',      
  //   },
  // });

  const user2 = await prisma.adm.create({
    data: {
      name: 'Gleyce Messias',
      password: 'Cruela',
      user: 'Gley',
      userWtp: '@GleyMessias',
    },
  });

  const user3 = await prisma.adm.create({
    data: {
      name: 'Leticia',
      password: 'Leticia',
      user: 'Leticia',
      userWtp: '@LehCorreia25',
    },
  });

  const user4 = await prisma.adm.create({
    data: {
      name: 'Katley',
      password: 'Katley',
      user: 'Yu',
      userWtp: '@Yu_Suki',
    },
  });

  const user5 = await prisma.adm.create({
    data: {
      name: 'João Pedro',
      password: 'João',
      user: 'Joao',
      userWtp: '@JoaoPedroh19',
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
