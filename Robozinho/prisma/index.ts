import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getRandomPoints() {
  return Math.floor(Math.random() * (4000000 - 10000 + 1)) + 10000;
}

async function main() {
  // Criando Membros (Admins e Usuários)
  const members = await prisma.member.createMany({
    data: [
        { name: 'Anna França', user: 'Anna', password: '123', userWtp: '@AnnaFr4nca', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'superadm', subRole: 'adm', subs: ['Luna-A1'] },
        { name: 'Ana Novais', user: 'Aserhumana', password: '!@#@!#!@#', userWtp: '@Aserhumana', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-A2'] },
        { name: 'Ana Santos', user: 'anawtxm', password: '!@#@!#!@#', userWtp: '@anawtxm', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-A3'] },
        { name: 'Ana Sousa', user: 'Aninhasousa_12348', password: '!@#@!#!@#', userWtp: '@Aninhasousa_12348', phone: '85999999999', age: 30, points: getRandomPoints(), role: 'member', subs: ['Luna-A4'] },
        { name: 'Izabelly', user: 'Alanamora7', password: '!@#@!#!@#', userWtp: '@Alanamora7', phone: '85999999999', age: 21, points: getRandomPoints(), role: 'member', subs: ['Luna-A5'] },
        { name: 'Ana Vitória', user: 'AutoraMermaid', password: '!@#@!#!@#', userWtp: '@AutoraMermaid', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-A6'] },
        { name: 'Lorena', user: 'Lorenaxvz', password: '!@#@!#!@#', userWtp: '@Lorenaxvz', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-A7'] },
        { name: 'Marcos Torres', user: 'MA-TORRES4', password: '!@#@!#!@#', userWtp: '@MA-TORRES4', phone: '85999999999', age: 28, points: getRandomPoints(), role: 'member', subs: ['Luna-A8'] },
        { name: 'Lavez', user: 'Lavez_Jr', password: '!@#@!#!@#', userWtp: '@Lavez_Jr', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-A9'] },
        { name: 'Kelvin Silva', user: 'ATOMIC_SHADOW', password: '!@#@!#!@#', userWtp: '@ATOMIC_SHADOW', phone: '85999999999', age: 29, points: getRandomPoints(), role: 'member', subs: ['Luna-A10'] },
        { name: 'Maria Luiza', user: 'MaryHollyns', password: '!@#@!#!@#', userWtp: '@MaryHollyns', phone: '85999999999', age: 31, points: getRandomPoints(), role: 'member', subs: ['Luna-A11'] },
        { name: 'Aline', user: 'MonnaLila', password: '!@#@!#!@#', userWtp: '@MonnaLila', phone: '85999999999', age: 33, points: getRandomPoints(), role: 'member', subs: ['Luna-A12'] },
        { name: 'Yasmim', user: 'yasminnc17', password: '!@#@!#!@#', userWtp: '@yasminnc17', phone: '85999999999', age: 20, points: getRandomPoints(), role: 'member', subs: ['Luna-A13'] },
        { name: 'Yin - Yali', user: 'Y_6_6_Y', password: '!@#@!#!@#', userWtp: '@Y_6_6_Y', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-A14'] },
        { name: 'Belton', user: 'beltonKira', password: '!@#@!#!@#', userWtp: '@beltonKira', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-A15'] },
        { name: 'Caroline', user: 'Baby_Evans', password: '!@#@!#!@#', userWtp: '@Baby_Evans', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-A16'] },
        { name: 'Chiara Ricci', user: 'AutoraChiaraRicci', password: '!@#@!#!@#', userWtp: '@AutoraChiaraRicci', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-A17'] },
        { name: 'Dilerio', user: 'dileriooo', password: '!@#@!#!@#', userWtp: '@dileriooo', phone: '85999999999', age: 30, points: getRandomPoints(), role: 'member', subs: ['Luna-A18'] },
        { name: 'Morgana', user: 'autoramorg_', password: '!@#@!#!@#', userWtp: '@autoramorg_', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-A19'] },
        { name: 'Duda', user: 'Duda', password: '123', userWtp: '@Luthien03', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'adm', subs: ['Luna-A20'] },
        { name: 'Davi Carvalho', user: 'DaviC', password: '!@#@!#!@#', userWtp: '@davis_are_davie', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B1'] },
        { name: 'Erica Moura', user: 'EricaM', password: '!@#@!#!@#', userWtp: '@3ricautora', phone: '85999999999', age: 30, points: getRandomPoints(), role: 'member', subs: ['Luna-B2', 'Luna-B3'] },
        { name: 'Emma Araújo', user: 'EmmaA', password: '!@#@!#!@#', userWtp: '@Juba2_4', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B4'] },
        { name: 'Leslie', user: 'LeslieX', password: '!@#@!#!@#', userWtp: '@EcstasyAinslee', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-B5'] },
        { name: 'Gleyciane Messias', user: 'Gley', password: '123', userWtp: '@GleyMessias', phone: '85999999999', age: 28, points: getRandomPoints(), role: 'adm', subs: ['Luna-B6'] },
        { name: 'Jamilly', user: 'JamillyD', password: '!@#@!#!@#', userWtp: '@The_Destiny', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B7', 'Luna-B8'] },
        { name: 'Isa', user: 'IsaX', password: '!@#@!#!@#', userWtp: '@xxSamn0rEiRaxx', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B9'] },
        { name: 'Igor Feijó', user: 'Igor', password: '123', userWtp: '@CroweWriter', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'adm', subs: ['Luna-B10'] },
        { name: 'Jana Heloísa', user: 'JanaH', password: '!@#@!#!@#', userWtp: '@JanaHSupernova', phone: '85999999999', age: 29, points: getRandomPoints(), role: 'member', subRole: '', subs: ['Luna-B11'] },
        { name: 'Jorge Cardoso', user: 'JcBushido', password: '123', userWtp: '@JCBushido', phone: '85999999999', age: 99, points: getRandomPoints(), role: 'superadm', subRole: 'adm', subs: ['Luna-B12'] },
        { name: 'Jamilly Vitorino', user: 'JamillyV', password: '!@#@!#!@#', userWtp: '@_gguksh', phone: '85999999999', age: 21, points: getRandomPoints(), role: 'member', subs: ['Luna-B13'] },
        { name: 'Jasmine', user: 'JasmineS', password: '!@#@!#!@#', userWtp: '@JasmineSantos', phone: '85999999999', age: 20, points: getRandomPoints(), role: 'member', subs: ['Luna-B14', 'Luna-B15'] },
        { name: 'Jéssica', user: 'JessicaO', password: '!@#@!#!@#', userWtp: '@A_Observadora2', phone: '85999999999', age: 31, points: getRandomPoints(), role: 'member', subs: ['Luna-B16'] },
        { name: 'Jeferson', user: 'JeffX', password: '!@#@!#!@#', userWtp: '@Jeffantasies', phone: '85999999999', age: 32, points: getRandomPoints(), role: 'member', subs: ['Luna-B17'] },
        { name: 'Letícia Correia', user: 'Leh', password: '123', userWtp: '@LehCorreia25', phone: '85999999999', age: 28, points: getRandomPoints(), role: 'superadm', subRole: 'adm', subs: ['Luna-B18', 'Luna-B19'] },
        { name: 'Lorrany', user: 'LorranyX', password: '!@#@!#!@#', userWtp: '@Rany_any', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B20'] },
        { name: 'Brendha', user: 'BrendhaX', password: '!@#@!#!@#', userWtp: '@rhadassy', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B21'] },
        { name: 'Jamilly Sousa', user: 'JamillyS', password: '!@#@!#!@#', userWtp: '@Milly_FoxRui', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B22'] },
        { name: 'Leonardo', user: 'LeoM', password: '!@#@!#!@#', userWtp: '@LeoMorrigann', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B23'] },
        { name: 'Adry Raquel', user: 'AdryR', password: '!@#@!#!@#', userWtp: '@Afrodite28_04', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B24'] },
        { name: 'Maria Eduarda', user: 'MariaD1', password: '!@#@!#!@#', userWtp: '@dudkz_', phone: '85999999999', age: 21, points: getRandomPoints(), role: 'member', subs: ['Luna-B25'] },
        { name: 'Monique', user: 'MoniqueX', password: '!@#@!#!@#', userWtp: '@Miss_Crow', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B26'] },
        { name: 'Maria Eduarda', user: 'MariaD2', password: '!@#@!#!@#', userWtp: '@Estrela_do_m4r', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B27'] },
        { name: 'Ryan S', user: 'RyanS', password: '!@#@!#!@#', userWtp: '@RyanSilvar', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-B28'] },
        { name: 'Ryan Hale', user: 'RyanH', password: '!@#@!#!@#', userWtp: '@RyanHale096', phone: '85999999999', age: 28, points: getRandomPoints(), role: 'member', subs: ['Luna-B29'] },
        { name: 'Rafaela', user: 'RafaelaX', password: '!@#@!#!@#', userWtp: '@Raverso', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B30'] },
        { name: 'Ramon', user: 'RamonX', password: '!@#@!#!@#', userWtp: '@A-Story-And-A-Dream', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B31'] },
        { name: 'Sammy Débora', user: 'SammyD', password: '!@#@!#!@#', userWtp: '@Cwistine_s2', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B32'] },
        { name: 'Vitória Costa', user: 'VitoriaC', password: '!@#@!#!@#', userWtp: '@Nixkage', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B33'] },
        { name: 'Wilson Jesus', user: 'WilsonJ', password: '!@#@!#!@#', userWtp: '@IsonWLone', phone: '85999999999', age: 29, points: getRandomPoints(), role: 'member', subs: ['Luna-B34'] },
        { name: 'Luana Ramos', user: 'LuanaR', password: '!@#@!#!@#', userWtp: '@autoralukjkk', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B35'] },
        { name: 'Cath Sellan', user: 'CathS', password: '!@#@!#!@#', userWtp: '@majorzo', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B36'] },
        { name: 'Renan Dois', user: 'RenanD', password: '!@#@!#!@#', userWtp: '@Nixaroth', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B37'] },
        { name: 'Lucas Davalos', user: 'LucasD', password: '!@#@!#!@#', userWtp: '@lucashvd', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-B38'] },
        { name: 'Nolan', user: 'NolanX', password: '!@#@!#!@#', userWtp: '@oznolanryder', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B39'] },
        { name: 'Samuel Assunção', user: 'SamuelA', password: '!@#@!#!@#', userWtp: '@Pandaba2417S', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B40'] },
        { name: 'Maycon Silva', user: 'MayconS', password: '!@#@!#!@#', userWtp: '@NeideSilva793', phone: '85999999999', age: 30, points: getRandomPoints(), role: 'member', subs: ['Luna-B41'] },
        { name: 'Suki Yu', user: 'SukiY', password: '123', userWtp: '@Yu_Suki', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'adm', subs: ['Luna-B42'] },
        { name: 'Wiliane', user: 'WilianeX', password: '!@#@!#!@#', userWtp: '@WlliiyyGabriellW', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B43'] },
        { name: 'José Emanuel', user: 'JoseE', password: '!@#@!#!@#', userWtp: '@JosEmanuelpereira1', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B44'] },
        { name: 'Daniel', user: 'DanielR', password: '!@#@!#!@#', userWtp: '@DVRodry', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B45'] },
        { name: 'Keren Letícia', user: 'KerenL', password: '!@#@!#!@#', userWtp: '@AgathaMorais', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B46'] },
        { name: 'Julia Fernandes', user: 'JuliaF', password: '!@#@!#!@#', userWtp: '@anjyliaf', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B47'] },
        { name: 'Débora', user: 'DeboraM', password: '!@#@!#!@#', userWtp: '@Deborademartins', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B48'] },
        { name: 'Alex James', user: 'AlexJ', password: '!@#@!#!@#', userWtp: '@TalesofFeryndral', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-B49'] },
        { name: 'Fabi', user: 'FabiN', password: '!@#@!#!@#', userWtp: '@Nyraliz', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B50'] },
        { name: 'Morgana Santos', user: 'MorganaS', password: '!@#@!#!@#', userWtp: '@IsArabell', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B51'] },
        { name: 'Raphaela Mandelle', user: 'RaphaM', password: '!@#@!#!@#', userWtp: '@rapha_mandelle', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B52'] },
        { name: 'Maycon', user: 'MayconX', password: '!@#@!#!@#', userWtp: '@neideSilva793', phone: '85999999999', age: 30, points: getRandomPoints(), role: 'member', subs: ['Luna-B53'] },
        { name: 'Maria Azevedo', user: 'MariaA', password: '!@#@!#!@#', userWtp: '@Lilithblooly', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B54'] },
        { name: 'Larissa Almeida', user: 'LarissaA', password: '!@#@!#!@#', userWtp: '@Larismrp', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B55'] },
        { name: 'Manuela', user: 'ManuelaX', password: '!@#@!#!@#', userWtp: '@Mahhzyss', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B56'] },
        { name: 'Lorena dos Anjos', user: 'LorenaA', password: '!@#@!#!@#', userWtp: '@Lorenaxvz', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B57'] },
        { name: 'David Lima', user: 'DavidL', password: '!@#@!#!@#', userWtp: '@delimadavid', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B58'] },
        { name: 'Violet Woolridge', user: 'VioletW', password: '!@#@!#!@#', userWtp: '@violetaerosas', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B59'] },
        { name: 'Alana Miron', user: 'AlanaM', password: '!@#@!#!@#', userWtp: '@Kitsunemiron', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B60'] },
        { name: 'Flávia Karina', user: 'FlaviaK', password: '!@#@!#!@#', userWtp: '@Flaviakarina02', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B61'] },
        { name: 'Ágatha Brandão', user: 'AgathaB', password: '!@#@!#!@#', userWtp: '@Lady_gatinha', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B62'] },
        { name: 'Janaina', user: 'JanainaM', password: '!@#@!#!@#', userWtp: '@Janainamelo844', phone: '85999999999', age: 26, points: getRandomPoints(), role: 'member', subs: ['Luna-B63'] },
        { name: 'Milena Santana', user: 'MilenaS', password: '!@#@!#!@#', userWtp: '@Stanx_boldly', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B64'] },
        { name: 'Hari', user: 'HariX', password: '!@#@!#!@#', userWtp: '@RT_anonima', phone: '85999999999', age: 24, points: getRandomPoints(), role: 'member', subs: ['Luna-B65'] },
        { name: 'Jasmine', user: 'JasmineX', password: '!@#@!#!@#', userWtp: '@Xiao_Meihua', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B66'] },
        { name: 'Joaquim Pader', user: 'JoaquimP', password: '!@#@!#!@#', userWtp: '@JoaquimPader', phone: '85999999999', age: 27, points: getRandomPoints(), role: 'member', subs: ['Luna-B67'] },
        { name: 'Amanda', user: 'AmandaP', password: '!@#@!#!@#', userWtp: '@APsurgent37', phone: '85999999999', age: 23, points: getRandomPoints(), role: 'member', subs: ['Luna-B68'] },
        { name: 'Vinny', user: 'VinnyA', password: '!@#@!#!@#', userWtp: '@vinny_alejadto', phone: '85999999999', age: 25, points: getRandomPoints(), role: 'member', subs: ['Luna-B69'] },
        { name: 'Michael', user: 'MichaelW', password: '!@#@!#!@#', userWtp: '@_michaelwriter', phone: '85999999999', age: 28, points: getRandomPoints(), role: 'member', subs: ['Luna-B70'] },
        { name: 'Sam', user: 'SamL', password: '!@#@!#!@#', userWtp: '@samlokjs', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B71'] },
        { name: 'Nicolas', user: 'Nick', password: '!@#@!#!@#', userWtp: '@4rthurop4to', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B71'] },
        { name: 'Ana Silva', user: 'AnaSil', password: '!@#@!#!@#', userWtp: '@anna_bi77', phone: '85999999999', age: 22, points: getRandomPoints(), role: 'member', subs: ['Luna-B71'] },  
    ]
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
