import { prisma } from '../config/prismaClient.js';

export async function criarUsuario(nome, email, senhaHash) {
  return prisma.usuario.create({
    data: { nome, email, senha: senhaHash }
  });
}

export async function buscarPorEmail(email) {
  return prisma.usuario.findUnique({ where: { email } });
}

export async function buscarPorId(id) {
  return prisma.usuario.findUnique({ where: { id } });
}

export async function listarUsuarios() {
    const usuarios = await prisma.usuario.findMany();

    return usuarios;
}