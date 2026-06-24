import { prisma } from '../config/prismaClient.js';

const USUARIO_FAKE_ID = '00000000-0000-0000-0000-000000000001';
const USUARIO_FAKE_EMAIL = 'usuario.fake@maplar.com';

async function garantirUsuarioFakePadrao() {
  const usuarioFake = await prisma.usuario.upsert({
    where: {
      email: USUARIO_FAKE_EMAIL,
    },
    update: {},
    create: {
      id: USUARIO_FAKE_ID,
      nome: 'Usuário Fake',
      email: USUARIO_FAKE_EMAIL,
      senha: '123456',
    },
  });

  return usuarioFake;
}

async function garantirUsuarioPorId(usuarioId) {
  if (!usuarioId) {
    return garantirUsuarioFakePadrao();
  }

  const usuarioExiste = await prisma.usuario.findUnique({
    where: {
      id: usuarioId,
    },
  });

  if (usuarioExiste) {
    return usuarioExiste;
  }

  const usuarioCriado = await prisma.usuario.create({
    data: {
      id: usuarioId,
      nome: 'Usuário Temporário',
      email: `usuario.${usuarioId}@maplar.com`,
      senha: '123456',
    },
  });

  return usuarioCriado;
}

function normalizarImagem(imagem) {
  if (!imagem) {
    return '';
  }

  if (typeof imagem === 'string') {
    return imagem;
  }

  if (typeof imagem === 'object') {
    if (imagem.url) {
      return imagem.url;
    }

    if (imagem.src) {
      return imagem.src;
    }

    if (imagem.name) {
      return imagem.name;
    }

    return '';
  }

  return String(imagem);
}

export async function criarImovel(
  usuarioId,
  titulo,
  valor,
  tipo,
  imagem,
  descricao,
  quarto,
  banheiro
) {
  const usuario = await garantirUsuarioPorId(usuarioId);

  const imovel = await prisma.imovel.create({
    data: {
      titulo,
      valor: Number(valor),
      tipo,
      imagem: normalizarImagem(imagem),
      descricao: descricao || '',
      quarto: Number(quarto) || 0,
      banheiro: Number(banheiro) || 0,
      usuarioId: usuario.id,
    },
  });

  return imovel;
}

export async function listarImoveis() {
  const imoveis = await prisma.imovel.findMany({
    include: {
      usuario: true,
    },
    orderBy: {
      titulo: 'asc',
    },
  });

  return imoveis;
}

export async function buscarImovelPorId(id) {
  const imovel = await prisma.imovel.findUnique({
    where: {
      id,
    },
    include: {
      usuario: true,
    },
  });

  return imovel;
}

export async function buscarImoveisPorUsuario(usuarioId) {
  const imoveis = await prisma.imovel.findMany({
    where: {
      usuarioId,
    },
    include: {
      usuario: true,
    },
    orderBy: {
      titulo: 'asc',
    },
  });

  return imoveis;
}

export async function atualizarImovel(id, dadosAtualizados) {
  const imovelExiste = await prisma.imovel.findUnique({
    where: {
      id,
    },
  });

  if (!imovelExiste) {
    return null;
  }

  const dados = {};

  if (dadosAtualizados.titulo !== undefined) {
    dados.titulo = dadosAtualizados.titulo;
  }

  if (dadosAtualizados.valor !== undefined) {
    dados.valor = Number(dadosAtualizados.valor);
  }

  if (dadosAtualizados.tipo !== undefined) {
    dados.tipo = dadosAtualizados.tipo;
  }

  if (dadosAtualizados.imagem !== undefined) {
    dados.imagem = normalizarImagem(dadosAtualizados.imagem);
  }

  if (dadosAtualizados.descricao !== undefined) {
    dados.descricao = dadosAtualizados.descricao;
  }

  if (dadosAtualizados.quarto !== undefined) {
    dados.quarto = Number(dadosAtualizados.quarto);
  }

  if (dadosAtualizados.banheiro !== undefined) {
    dados.banheiro = Number(dadosAtualizados.banheiro);
  }

  const imovelAtualizado = await prisma.imovel.update({
    where: {
      id,
    },
    data: dados,
  });

  return imovelAtualizado;
}

export async function deletarImovel(id) {
  const imovelExiste = await prisma.imovel.findUnique({
    where: {
      id,
    },
  });

  if (!imovelExiste) {
    return null;
  }

  await prisma.imovel.delete({
    where: {
      id,
    },
  });

  return true;
}