import type { SanitizedConfig } from 'payload'
import payload from 'payload'

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })
  payload.logger.info('Iniciando a inserção de dados no banco...')
  try {
    payload.logger.info('Verificando o banco de dados...')
    const users = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (users.docs.length > 0) {
      payload.logger.info(
        'O banco de dados já contém registros. A inserção inicial não será executada.',
      )
      return
    }

    payload.logger.info('Criando o primeiro usuário...')
    const user = await payload.create({
      collection: 'users',
      data: {
        id: 1,
        email: process.env.DEV_EMAIL || 'admin@mail.com',
        password: process.env.DEV_PASS || 'Admin123',
        name: 'Admin',
        _verified: true,
      },
    })
    payload.logger.info(`Primeiro usuário criado com sucesso! ID: ${user.id}`)
  } catch (error) {
    payload.logger.error(`Falha ao inserir dados no banco: ${error}`)
  }
}
