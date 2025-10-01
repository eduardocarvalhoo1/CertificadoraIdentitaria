function User({ userId, nome, email, senha, registro, role }) { 
    return { 
        userId, 
        nome, 
        email, 
        senha, 
        registro, 
        role, 
        creaetedAt: new Date(), 
        updatedAt: new Date(), 
    } 
} 
module.exports = User;