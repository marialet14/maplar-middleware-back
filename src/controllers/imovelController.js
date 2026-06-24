import * as imovelRepo from '../repositories/imovelRepo.js';

export async function criar(req, res) {
  try {
    const {
      usuarioId,
      titulo,
      valor,
      tipo,
      imagem,
      descricao,
      quarto,
      banheiro,
    } = req.body;

    if (!titulo || !valor || !tipo) {
      return res.status(400).json({
        erro: 'Campos obrigatórios em falta.',
      });
    }

    const novoImovel = await imovelRepo.criarImovel(
      usuarioId,
      titulo,
      valor,
      tipo,
      imagem,
      descricao,
      quarto,
      banheiro
    );

    return res.status(201).json(novoImovel);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao criar imóvel.',
    });
  }
}

export async function listar(req, res) {
  try {
    const imoveis = await imovelRepo.listarImoveis();

    return res.status(200).json(imoveis);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao listar imóveis.',
    });
  }
}

export async function buscarPorId(req, res) {
  try {
    const { id } = req.params;

    const imovel = await imovelRepo.buscarImovelPorId(id);

    if (!imovel) {
      return res.status(404).json({
        erro: 'Imóvel não encontrado.',
      });
    }

    return res.status(200).json(imovel);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao buscar imóvel.',
    });
  }
}

export async function buscarPorUsuario(req, res) {
  try {
    const { usuarioId } = req.params;

    const imoveis = await imovelRepo.buscarImoveisPorUsuario(usuarioId);

    return res.status(200).json(imoveis);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao buscar imóveis do usuário.',
    });
  }
}

export async function atualizar(req, res) {
  try {
    const { id } = req.params;

    const imovelAtualizado = await imovelRepo.atualizarImovel(id, req.body);

    if (!imovelAtualizado) {
      return res.status(404).json({
        erro: 'Imóvel não encontrado.',
      });
    }

    return res.status(200).json(imovelAtualizado);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao atualizar imóvel.',
    });
  }
}

export async function deletar(req, res) {
  try {
    const { id } = req.params;

    const deletado = await imovelRepo.deletarImovel(id);

    if (!deletado) {
      return res.status(404).json({
        erro: 'Imóvel não encontrado.',
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      erro: 'Erro ao deletar imóvel.',
    });
  }
}