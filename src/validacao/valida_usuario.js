function validaNome(nome) {
  //nomes ou textos que podem ter letras acentuadas, espaços, hífen e apóstrofo.
  const nomeRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  const isValid = nome.length >= 2 && nomeRegex.test(nome);
  return isValid;
}

function validaEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValid = emailRegex.test(email);
  return isValid;
}

function validaSenha(senha) {
  // Pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial
  const senhaRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const isValid = senhaRegex.test(senha);
  return isValid;
}

export function validaUsuario(nome, email, senha) {
  const nomeValido = validaNome(nome);
  const emailValido = validaEmail(email);
  const senhaValida = validaSenha(senha);

  const usuarioValido = { nomeValido, emailValido, senhaValida };

  if (usuarioValido.nomeValido === false) {
    return { status: false, mensagem: "Nome inválido" };
  } else if (usuarioValido.emailValido === false) {
    return { status: false, mensagem: "Email inválido" };
  } else if (usuarioValido.senhaValida === false) {
    return {
      status: false,
      mensagem:
        "Senha inválida. Deve ter no mínimo 8 caracteres, incluindo maiúscula, minúscula, número e caractere especial.",
    };
  } else {
    return { status: true, mensagem: "" };
  }
}
