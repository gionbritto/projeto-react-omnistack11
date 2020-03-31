const connection = require('../database/connection');
//essa estrutura abaixo é como o meu objeto de exportacao da classe (conhecida como componente no react)
module.exports = {
    /*este metodo ira fazer a paginacao dos dados recebendo no request.query 
    o numero da pagina e irei limitar o resultado por 5 e dar um ofset(pular)
    de 5 * pagina;
    */
    async index(request, response){
        const { page = 1} = request.query;
        const incidents = await connection('incidents')
        .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
        .limit(5)
        .offset((page - 1) * 5)
        .select([
            'incidents.*', 
            'ongs.name', 
            'ongs.email', 
            'ongs.whatsapp', 
            'ongs.city', 
            'ongs.uf'
        ]); 
        //no select acima eu descrevo o que vou retornar no join

        const [count] = await connection('incidents').count();

        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents);
    },
    
    async create(request, response){
        const { title, description, value } = request.body;

        /*
        NEste momento é que uma ong ira cadastrar um incidente, e devemos linkar o
        incidente cadastrado à ong. Quando estamos falando de autenticacao a informação não é trazida
        no corpo da requisição (por isso ela nao esta na desetruturacao) e sim no cabecalho da requisicao
        onde é utilizado o header. Nela é guardada as informações o contexto na nossa requisicao;
        */
       const ong_id =  request.headers.authorization; //pegando o id da ong vindo no cabecalho da requisicao
       const [id] = await connection('incidents').insert({
           title,
           description, value,
           ong_id
       });

       return response.json({id});

    },

    async delete(request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents').where('id', id)
                                                      .select('ong_id')
                                                      .first();
        if(incident.ong_id != ong_id){
            return response.status(401).json({ error : 'Operation not permitted'});
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();

    }
}