import type { SanitizedConfig } from 'payload'
import payload from 'payload'

export const script = async (config: SanitizedConfig) => {
  await payload.init({ config })
  payload.logger.info('Iniciando a inserção de gestões no banco...')

  try {
    payload.logger.info('Buscando gestões existentes...')
    const existing = await payload.find({
      collection: 'managements',
      limit: 200,
      depth: 0,
    })

    const existingKeys = new Set(
      existing.docs.map((m: any) => `${m.managementStart}-${m.managementEnd}`),
    )

    payload.logger.info(`Encontradas ${existing.docs.length} gestões no banco.`)

    const managements = [
      { managementStart: 2016, managementEnd: 2018 },
      { managementStart: 2019, managementEnd: 2021 },
      { managementStart: 2022, managementEnd: 2024 },
      { managementStart: 2024, managementEnd: 2027 },
    ]

    let createdCount = 0

    for (const management of managements) {
      const key = `${management.managementStart}-${management.managementEnd}`

      if (existingKeys.has(key)) {
        payload.logger.info(
          `Pulando (já existe): ${management.managementStart}/${management.managementEnd}`,
        )
        continue
      }

      const created = await payload.create({
        collection: 'managements',
        data: management,
      })

      createdCount++
      payload.logger.info(
        `Gestão ${created.managementStart}/${created.managementEnd} criada! ID: ${created.id}`,
      )
    }

    payload.logger.info(`Seed finalizado. Criadas ${createdCount} novas gestões.`)
  } catch (error) {
    payload.logger.error(`Falha ao inserir gestões no banco: ${error}`)
  }
}
