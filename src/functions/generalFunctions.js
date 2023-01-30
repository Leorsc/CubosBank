const fs = require('fs/promises');

const writeFilebancoDeDados = async (bancoDeDados) => {
    try {
        await fs.writeFile('./src/database/bancoDeDados.json', JSON.stringify(bancoDeDados));
    } catch (error) {
        console.log(error);
    }
}

const encontrarIndiceDaConta = (bancoDeDados, numeroConta) => {
    const { contas } = bancoDeDados;
    return contas.findIndex((conta) => {
        const { numero_conta } = conta
        return numero_conta === numeroConta
    })
}

const encontrarIndicePeloCPF = (bancoDeDados, CPFValidacao) => {
    const { contas } = bancoDeDados;
    return contas.findIndex((conta) => {
        const { cpf } = conta.usuario
        return cpf === CPFValidacao
    })
}

const encontrarIndicePeloEmail = (bancoDeDados, emailValidacao) => {
    const { contas } = bancoDeDados;
    return contas.findIndex((conta) => {
        const { email } = conta.usuario
        return email === emailValidacao
    })
}

const verificarSeContaExiste = (bancoDeDados, indice) => {
    if (indice === -1 || bancoDeDados.contas === "") {
        return false;
    }
    return true;
}

const encontrarContaPeloCPF = (bancoDeDados, cpf) => {
    const { contas } = bancoDeDados;
    return contas.find((conta) => {
        if (conta.usuario.cpf === cpf) {
            return true;
        }
        return false;
    })
}

const encontrarContaPeloEmail = (bancoDeDados, email) => {
    const { contas } = bancoDeDados;
    return contas.find((conta) => {
        if (conta.usuario.email === email) {
            return true;
        }
        return false;
    })
}

const validarInformacaoesDaConta = (nome, cpf, data_nascimento, telefone, email, senha) => {
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return false;
    }
    return true;
}

const validarCPF = (cpf) => {
    const cpfInformado = cpf.split('');
    if (cpfInformado.length !== 11) {
        return false;
    }
    return true;
}

const validarSenha = (senha) => {
    const senhaInformada = senha.split('');
    if (senhaInformada.length !== 4) {
        return false;
    }
    return true;
}

function geradorDeNumeroDeConta() {
    for (let i = 0; i < 100; i++) {
        const numAll = parseInt(Math.random() * 10000)
        if (numAll > 1000 && numAll < 10000) {
            return (numAll.toString());
        }
    }
}

const verificarSaldo = (bancoDeDados, indice) => {
    const { contas } = bancoDeDados;
    if (contas[indice].saldo === 0) {
        return true;
    }
    return false;
}

const verificarSaldoSaque = (bancoDeDados, indice, valor) => {
    const { contas } = bancoDeDados;
    if (contas[indice].saldo >= valor) {
        return true;
    }
    return false;

}

const verificarSenha = (bancoDeDados, indice, senhabody) => {
    if (bancoDeDados.contas[indice].usuario.senha === senhabody) {
        return true;
    }
    return false;
}

const somarSaldo = (bancoDeDados, valor, conta) => {
    const { contas } = bancoDeDados;
    let saldo = contas[conta].saldo;
    saldo += valor;
    return saldo;
}

const subtrairSaldo = (bancoDeDados, valor, conta) => {
    const { contas } = bancoDeDados;
    let saldo = contas[conta].saldo;
    saldo -= valor;
    return saldo;
}

const transacoesDeposito = (bancoDeDados, numeroConta) => {
    const { depositos } = bancoDeDados;
    return depositos.filter((operacao) => {
        return operacao.numero_conta === numeroConta
    })
}

const transacoesSaque = (bancoDeDados, numeroConta) => {
    const { saques } = bancoDeDados;
    return saques.filter((operacao) => {
        return operacao.numero_conta === numeroConta
    })
}

const transacoesTransferenciasRecebidas = (bancoDeDados, numeroConta) => {
    const { transferencias } = bancoDeDados;
    return transferencias.filter((operacao) => {
        return operacao.numero_conta_destino === numeroConta
    })
}

const transacoesTransferenciasEnviadas = (bancoDeDados, numeroConta) => {
    const { transferencias } = bancoDeDados;
    return transferencias.filter((operacao) => {
        return operacao.numero_conta_origem === numeroConta
    })
}

module.exports = {
    writeFilebancoDeDados,
    encontrarIndiceDaConta,
    encontrarIndicePeloCPF,
    encontrarIndicePeloEmail,
    verificarSeContaExiste,
    encontrarContaPeloCPF,
    encontrarContaPeloEmail,
    validarInformacaoesDaConta,
    validarCPF,
    validarSenha,
    geradorDeNumeroDeConta,
    verificarSaldo,
    verificarSaldoSaque,
    verificarSenha,
    somarSaldo,
    subtrairSaldo,
    transacoesDeposito,
    transacoesSaque,
    transacoesTransferenciasRecebidas,
    transacoesTransferenciasEnviadas
}