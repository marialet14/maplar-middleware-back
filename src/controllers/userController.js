import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import * as userRepo from '../repositories/userRepo.js';

const SEGREDO = 'maplar_segredo_secreto';

export async function cadastro(req, res) {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios em falta.' });
    }

    const jaExiste = await userRepo.buscarPorEmail(email);
    if (jaExiste) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await userRepo.criarUsuario(nome, email, senhaHash);

    return res.status(201).json({ mensagem: 'Usuário criado!', id: usuario.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao cadastrar usuário.' });
  }
}

export async function login(req, res) {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Campos obrigatórios em falta.' });
    }

    const usuario = await userRepo.buscarPorEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      SEGREDO,
      { expiresIn: '1h' }
    );

    return res.json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: 'Erro ao fazer login.' });
  }
}