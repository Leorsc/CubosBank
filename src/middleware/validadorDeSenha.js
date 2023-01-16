const senhaApp = "Cubos123Bank";

const validarSenhaBanco = (req, res, next) => {
    const { senha_banco } = req.query

    if (senha_banco !== senhaApp) {
        return res.status(401).json("A senha do banco informada é inválida!")
    }

    next()
}

module.exports = {
    validarSenhaBanco,
}