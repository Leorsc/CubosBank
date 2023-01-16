const express = require("express");
const { cadastrarContaBancaria, listarContasBancarias, atualizarDadosContaBancaria, deletarContaBancaria, depositar, sacar, transferir, saldo, extrato, validarSenhaConta } = require("../controller/contas");
const { validarSenhaBanco } = require("../middleware/validadorDeSenha");
const fs = require('fs/promises');


const roteador = express();

roteador.post('/contas', cadastrarContaBancaria);
roteador.put('/contas/:numeroConta/usuario', atualizarDadosContaBancaria)
roteador.delete('/contas/:numeroConta', deletarContaBancaria)
roteador.post('/transacoes/depositar', depositar)
roteador.post('/transacoes/sacar', sacar)
roteador.post('/transacoes/transferir', transferir)
roteador.get('/contas/saldo', validarSenhaConta, saldo)
roteador.get('/contas/extrato', validarSenhaConta, extrato)


roteador.use(validarSenhaBanco)
roteador.get('/contas', listarContasBancarias)

module.exports = roteador;