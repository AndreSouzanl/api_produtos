function validaNome(nome) {
  //nomes ou textos que podem ter letras acentuadas, espaços, hífen e apóstrofo.
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  const isValid = nome.length >= 2 && nomeRegex.test(nome);
  return isValid;
}

// Pode ser opcional, mas se existir, deve ter pelo menos 3 caracteres
function validaDescricao(descricao) {
  if (!descricao) return true;
  return descricao.length >= 3 && descricao.length <= 500;
}

// Deve ser número inteiro >= 0
function validaQuantidade(quantidade) {
  const quantidadeRegex = /^\d+$/;
  return quantidadeRegex.test(quantidade) && parseInt(quantidade) >= 0;
}

// Lista restrita de unidades válidas
function validaUnidade(unidade) {
  const unidadesValidas = ["un", "kg", "lt", "cx", "m", "g", "pc"];
  return unidadesValidas.includes(unidade);
}

// Deve ser número inteiro positivo
function validaCriadoPor(criado_por) {
  const criadoRegex = /^\d+$/;
  return criadoRegex.test(criado_por) && parseInt(criado_por) > 0;
}
// Deve ser número inteiro positivo
function validaAtualizadoPor(atualizado_por) {
  const criadoRegex = /^\d+$/;
  return criadoRegex.test(atualizado_por) && parseInt(atualizado_por) > 0;
}
// Deve ser número inteiro positivo
function validaRemovidoPor(removido_por) {
  const criadoRegex = /^\d+$/;
  return criadoRegex.test(removido_por) && parseInt(removido_por) > 0;
}

//  NOVA: valida status (enum)
function validaStatus(status) {
  const statusRegex = /^(ativo|editado|removido)$/;
  return statusRegex.test(status);
}

// --- Função principal que agrupa todas as validações ---
export function validaProduto(
  nome,
  descricao,
  quantidade,
  unidade,
  criado_por,
  
) {
  const nomeValido = validaNome(nome);
  const descricaoValida = validaDescricao(descricao);
  const quantidadeValida = validaQuantidade(quantidade);
  const unidadeValida = validaUnidade(unidade);
  const criadoPorValido = validaCriadoPor(criado_por);
  

  if (!nomeValido) {
    return {
      status: false,
      mensagem: "Nome inválido. Deve ter pelo menos 2 caracteres.",
    };
  }

  if (!descricaoValida) {
    return {
      status: false,
      mensagem: "Descrição inválida. Deve ter entre 3 e 500 caracteres.",
    };
  }

  if (!quantidadeValida) {
    return {
      status: false,
      mensagem:
        "Quantidade inválida. Deve ser um número inteiro igual ou maior que 0.",
    };
  }

  if (!unidadeValida) {
    return {
      status: false,
      mensagem: "Unidade inválida. Use: un, kg, lt, cx, m, g ou pc.",
    };
  }

  if (!criadoPorValido) {
    return {
      status: false,
      mensagem:
        "Campo criado_por inválido. Deve ser um número inteiro positivo.",
    };
  }
  return { status: true, mensagem: "" };
}

export function validaProdutoAtualizacao(
  nome,
  descricao,
  quantidade,
  unidade,
  atualizado_por,
  status
) {
  if (!validaNome(nome)) {
    return { status: false, mensagem: "Nome inválido." };
  }

  if (!validaDescricao(descricao)) {
    return { status: false, mensagem: "Descrição inválida." };
  }

  if (!validaQuantidade(quantidade)) {
    return { status: false, mensagem: "Quantidade inválida." };
  }

  if (!validaUnidade(unidade)) {
    return { status: false, mensagem: "Unidade inválida." };
  }

  if (!validaAtualizadoPor(atualizado_por)) {
    return { status: false, mensagem: "atualizado_por inválido." };
  }

  if (!validaStatus(status)) {
    return { status: false, mensagem: "Status inválido." };
  }

  return { status: true };
}

