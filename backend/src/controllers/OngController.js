const connection = require('../database/connection');
const crypto = require('crypto');

//tudo que a gente precisar exportar para outro lugar fica dentro de module.exports
module.exports = {
    async index(request, response){
        const ongs = await connection('ongs').select('*');

        return response.json(ongs);
    },
    async create(request, response){        
        const { name, email, whatsapp, city, uf } = request.body;
        const id = crypto.randomBytes(4).toString('HEX');
        //abrindo conexao
        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        });
        return response.json({ id });
    }
}