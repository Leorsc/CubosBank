# Cubos Bank

### Vamos construir uma API de cadastros de usuarios, para um sistema de banco.

Precisamos construir endpoints com `express` seguindo padrao `REST` para executar as seguintes funcoes:

- Usuarios
    - Cadastrar usuario
        - Nome
        - CPF (único)
        - Data de nascimento
        - Telefone
        - E-mail (único)
        - Senha
    - Atualizar informações de usuario
    - Deletar usuario
    - Listar contas bancárias

Com o usuario já cadastrado, este poderá realizar transações:

- Contas
    - Depositar
    - Sacar
    - Transferir
    - Verificar saldo disponível
    - Extrato transações

## Regras da API

- O email e CPF das contas cadastradas deve ser único
- Todas as contas devem ter obrigatoriamente, `nome`, `CPF`, `data de nascimento`, `telefone` ,`email` e `senha`
- Todas os valores de transação devem ser feitos em centavos
- Para realizar transaferencias é necessário informar conta de origem e conta de destino
