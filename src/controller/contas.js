let bancoDeDados = require('../database/bancoDeDados.json');
const { format } = require('date-fns');
const fs = require('fs/promises');
const { writeFilebancoDeDados,
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
    transacoesTransferenciasEnviadas } = require('../functions/funcoesGerais');


const cadastrarContaBancaria = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const inputValidacao = validarInformacaoesDaConta(nome, cpf, data_nascimento, telefone, email, senha);

    if (!inputValidacao) {
        return res.status(400).json("Todos os campos são obrigatorios");
    }

    const CPFValidacao = validarCPF(cpf);

    if (!CPFValidacao) {
        return res.status(400).json("Tamanho do CPF está incorreto");
    }

    const senhaCadastrada = validarSenha(senha);

    if (!senhaCadastrada) {
        return res.status(400).json("Informe uma senha de 4 números");
    }

    const contaEncontradaPeloCPF = encontrarContaPeloCPF(bancoDeDados, cpf);


    if (contaEncontradaPeloCPF) {
        return res.status(400).json(`Conta com CPF já existe`);
    }

    const contaEncontradaPeloEmail = encontrarContaPeloEmail(bancoDeDados, email);

    if (contaEncontradaPeloEmail) {
        return res.status(400).json("Email informado já existe");
    }

    bancoDeDados.contas.push({
        numero_conta: geradorDeNumeroDeConta(),
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    })

    writeFilebancoDeDados(bancoDeDados);
    return res.status(201).json();
}

const listarContasBancarias = (req, res) => {
    return res.status(200).json(bancoDeDados.contas);
}

const atualizarDadosContaBancaria = (req, res) => {
    const { numeroConta } = req.params
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    const inputValidacao = validarInformacaoesDaConta(nome, cpf, data_nascimento, telefone, email, senha);

    if (!inputValidacao) {
        return res.status(400).json("Todos os campos são obrigatorios");
    }

    const indiceEncontrado = encontrarIndiceDaConta(bancoDeDados, numeroConta);

    const encontrarConta = verificarSeContaExiste(bancoDeDados, indiceEncontrado)

    if (!encontrarConta) {
        return res.status(404).json("A conta informada não existe");
    }

    const contaEncontradaPeloCPF = encontrarIndicePeloCPF(bancoDeDados, cpf);

    if (contaEncontradaPeloCPF !== indiceEncontrado && contaEncontradaPeloCPF !== -1) {
        return res.status(400).json("O CPF informado já existe cadastrado!");
    }

    const contaEncontradaPeloEmail = encontrarIndicePeloEmail(bancoDeDados, email);

    if (contaEncontradaPeloEmail !== indiceEncontrado && contaEncontradaPeloEmail !== -1) {
        return res.status(400).json("O email informado já existe cadastrado!");
    }

    bancoDeDados.contas[indiceEncontrado] = {
        ...bancoDeDados.contas[indiceEncontrado],
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }
    writeFilebancoDeDados(bancoDeDados);

    return res.status(204).json()
}

const deletarContaBancaria = (req, res) => {
    const { numeroConta } = req.params

    const indiceEncontrado = encontrarIndiceDaConta(bancoDeDados, numeroConta);

    const encontrarConta = verificarSeContaExiste(bancoDeDados, indiceEncontrado);

    if (!encontrarConta) {
        return res.status(404).json("A conta informada não existe");
    }

    const analiseDeSaldo = verificarSaldo(bancoDeDados, indiceEncontrado);

    if (!analiseDeSaldo) {
        return res.status(400).json("A conta só pode ser removida se o saldo for zero!");
    }
    bancoDeDados.contas.splice(indiceEncontrado, 1);
    writeFilebancoDeDados(bancoDeDados);
    return res.status(204).json()
}

const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;

    if (!numero_conta || !valor) {
        return res.status(400).json("Todos os campos são obrigatorios");
    }

    const indiceEncontrado = encontrarIndiceDaConta(bancoDeDados, numero_conta);

    const encontrarConta = verificarSeContaExiste(bancoDeDados, indiceEncontrado);

    if (!encontrarConta) {
        return res.status(404).json("A conta informada não existe!");
    }

    if (valor <= 0) {
        return res.status(404).json("O valor não pode ser menor que zero!");
    }

    const depositarValorNaConta = somarSaldo(bancoDeDados, valor, indiceEncontrado);

    bancoDeDados.contas[indiceEncontrado] = {
        ...bancoDeDados.contas[indiceEncontrado],
        saldo: depositarValorNaConta
    }

    const data = new Date();
    const dataModificada = format(data, "yyyy-MM-dd HH:mm:ss")

    bancoDeDados.depositos = [
        ...bancoDeDados.depositos,
        {
            data: dataModificada,
            numero_conta,
            valor
        }
    ]

    writeFilebancoDeDados(bancoDeDados);
    return res.status(201).json({
        data: dataModificada,
        numero_conta,
        valor
    })
}

const sacar = (req, res) => {
    const { numero_conta, valor, senha } = req.body;
    const indiceEncontrado = encontrarIndiceDaConta(bancoDeDados, numero_conta);
    const encontrarConta = verificarSeContaExiste(bancoDeDados, indiceEncontrado);

    if (!valor || !numero_conta || !senha) {
        return res.status(400).json("Todos os campos são obrigatorios");
    }

    if (!encontrarConta) {
        return res.status(404).json("A conta informada não existe!");
    }

    const validarSenha = verificarSenha(bancoDeDados, indiceEncontrado, senha);

    if (!validarSenha) {
        return res.status(401).json("Senha incorreta!");
    }

    if (valor <= 0) {
        return res.status(404).json("O valor não pode ser menor que zero!");
    }

    const analiseDeSaldo = verificarSaldoSaque(bancoDeDados, indiceEncontrado, valor);

    if (!analiseDeSaldo) {
        return res.status(400).json("Saldo insuficiente!");
    }

    const sacarValorNaConta = subtrairSaldo(bancoDeDados, valor, indiceEncontrado);

    bancoDeDados.contas[indiceEncontrado] = {
        ...bancoDeDados.contas[indiceEncontrado],
        saldo: sacarValorNaConta
    }

    const data = new Date();
    const dataModificada = format(data, "yyyy-MM-dd HH:mm:ss")

    bancoDeDados.saques = [
        ...bancoDeDados.saques,
        {
            data: dataModificada,
            numero_conta,
            valor
        }
    ]

    writeFilebancoDeDados(bancoDeDados);
    return res.status(201).json(transacoesSaque(bancoDeDados, numero_conta))
}

const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;

    if (!numero_conta_destino || !numero_conta_origem || !valor || !senha) {
        return res.status(400).json("Todos os campos são obrigatorios");
    }
    const indiceContaOrigem = encontrarIndiceDaConta(bancoDeDados, numero_conta_origem);

    const indiceContaDestino = encontrarIndiceDaConta(bancoDeDados, numero_conta_destino);

    const encontrarContaOrigem = verificarSeContaExiste(bancoDeDados, indiceContaOrigem);

    const encontrarContaDestino = verificarSeContaExiste(bancoDeDados, indiceContaDestino);

    if (!encontrarContaOrigem) {
        return res.status(404).json("A conta de origem informada não existe");
    }

    if (!encontrarContaDestino) {
        return res.status(404).json("A conta de destino informada não existe");
    }

    const validarSenha = verificarSenha(bancoDeDados, indiceContaOrigem, senha);

    if (!validarSenha) {
        return res.status(401).json("Senha incorreta!");
    }

    const analiseDeSaldo = verificarSaldoSaque(bancoDeDados, indiceContaOrigem, valor);

    if (!analiseDeSaldo) {
        return res.status(400).json("Saldo insuficiente!");
    }

    const sacarValorNaConta = subtrairSaldo(bancoDeDados, valor, indiceContaOrigem);

    bancoDeDados.contas[indiceContaOrigem] = {
        ...bancoDeDados.contas[indiceContaOrigem],
        saldo: sacarValorNaConta
    }

    const depositarValorNaConta = somarSaldo(bancoDeDados, valor, indiceContaDestino);

    bancoDeDados.contas[indiceContaDestino] = {
        ...bancoDeDados.contas[indiceContaDestino],
        saldo: depositarValorNaConta
    }

    const data = new Date();
    const dataModificada = format(data, "yyyy-MM-dd HH:mm:ss")

    bancoDeDados.transferencias = [
        ...bancoDeDados.transferencias,
        {
            data: dataModificada,
            numero_conta_origem,
            numero_conta_destino,
            valor
        }
    ]
    writeFilebancoDeDados(bancoDeDados);

    return res.status(201).json()
}

const saldo = (req, res) => {
    const { numero_conta, senha } = req.query

    const indiceEncontrado = encontrarIndiceDaConta(bancoDeDados, numero_conta);

    return res.status(200).json({ saldo: bancoDeDados.contas[indiceEncontrado].saldo });
}

const extrato = async (req, res) => {
    const { numero_conta } = req.query

    return res.status(200).json({
        depositos: transacoesDeposito(bancoDeDados, numero_conta),
        saques: transacoesSaque(bancoDeDados, numero_conta),
        transferenciasEnviadas: transacoesTransferenciasEnviadas(bancoDeDados, numero_conta),
        transferenciasRecebidas: transacoesTransferenciasRecebidas(bancoDeDados, numero_conta)
    });
}

const validarSenhaConta = (req, res, next) => {
    const { numero_conta, senha } = req.query

    if (!numero_conta || !senha) {
        return res.status(400).json("Informe numero da conta e senha");
    }

    const indiceEncontrado = encontrarIndiceDaConta(bancoDeDados, numero_conta);

    if (indiceEncontrado === -1) {
        return res.status(404).json("A conta informada não existe");
    }

    const validarSenha = verificarSenha(bancoDeDados, indiceEncontrado, senha);

    if (!validarSenha) {
        return res.status(401).json("Senha incorreta!");
    }

    next()
}

module.exports = {
    cadastrarContaBancaria,
    listarContasBancarias,
    atualizarDadosContaBancaria,
    deletarContaBancaria,
    depositar,
    sacar,
    transferir,
    saldo,
    validarSenhaConta,
    extrato
}