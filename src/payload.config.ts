import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { pt } from '@payloadcms/translations/languages/pt'
import sharp from 'sharp'

import { Users } from './collections/users'
import { Files } from './collections/files'
import { Categories } from './collections/posts/categories'
import { Posts } from './collections/posts'
import { Newsletter } from './collections/newsletter'
import { Managements } from './collections/managements'
import { Commissions } from './collections/commissions'
import { CommissionMembers } from './collections/commissions/members'
import { CommissionAreas } from './collections/commissions/areas'
import { Subsections } from './collections/subsections'
import { SubsectionRegions } from './collections/subsections/regions'
import { SubsectionMembers } from './collections/subsections/members'
import { SubsectionRooms } from './collections/subsections/rooms'
import { Lawyers } from './collections/lawyers'
import { Events } from './collections/events'
import { Speakers } from './collections/events/speakers'
import { Registrations } from './collections/events/registrations'
import { UrhHonorarium } from './collections/urh-honorarium'
import { Legislations } from './collections/legislations'
import { LegislationsTypes } from './collections/legislations/legislations_types'
import { Board } from './collections/board'
import { Counselors } from './collections/board/counselors'
import { StateCouncilDigests } from './collections/board/state_council_digests'
import { AdjudicatingChamber } from './collections/adjudicating-chamber'
import { MembersAdjudicatingChamber } from './collections/adjudicating-chamber/members'
import { Composition } from './collections/ted/composition'
import { TedMembers } from './collections/ted/members'
import { TedCouncilDigests } from './collections/ted/ted_council_digests'
import { LegislationsTedTypes } from './collections/ted/legislations_ted_types'
import { LegislationsTed } from './collections/ted/legislations_ted'
import { CalendarTed } from './collections/ted/calendar_ted'

import { sendPostNotificationTask } from './jobs/tasks/newsletter-notification'
import { getServerSideURL } from './lib/get-urls'
import { plugins } from './plugins'
// import { migrations } from './migrations'
import { Certificates } from './collections/events/certificates'
import { ParticipantCategories } from './collections/events/participant-categories'
import { Checkins } from './collections/events/checkins'
import { Payments } from './collections/payments'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: process.env.DEV_EMAIL,
            password: process.env.DEV_PASS,
            prefillOnly: true,
          }
        : false,
    components: {
      graphics: {
        Icon: '/components/admin/admin-icon',
        Logo: '/components/admin/admin-logo',
      },
    },
    meta: {
      title: 'Dashboard',
      titleSuffix: '- OAB/SC',
      description: 'Dashboard Administrativo da OAB/SC.',
      defaultOGImageType: 'static',
      openGraph: {
        description: 'Dashboard Administrativo da OAB/SC.',
        title: 'Painel de Administração',
        siteName: 'Dashboard OAB/SC',
        locale: 'pt_BR',
        images: [
          {
            url: '/public/logo.svg',
            width: 1200,
            height: 630,
            alt: 'Logo OAB/SC',
          },
        ],
      },
      icons: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          url: '/favicon.ico',
        },
      ],
      alternates: {
        canonical: getServerSideURL(),
      },
    },
    avatar: 'gravatar',
    dateFormat: 'dd/MM/yyyy, HH:mm',
    timezones: {
      defaultTimezone: 'America/Sao_Paulo',
    },
  },
  i18n: {
    fallbackLanguage: 'pt',
    supportedLanguages: { pt },
    translations: {
      pt: {
        general: {
          payloadSettings: 'Configurações do Dashboard',
        },
      },
    },
  },
  collections: [
    Users,
    Files,
    Categories,
    Posts,
    Newsletter,
    Managements,
    Board,
    Counselors,
    StateCouncilDigests,
    AdjudicatingChamber,
    MembersAdjudicatingChamber,
    TedMembers,
    Composition,
    TedCouncilDigests,
    LegislationsTed,
    LegislationsTedTypes,
    CalendarTed,
    Commissions,
    CommissionMembers,
    CommissionAreas,
    Subsections,
    SubsectionRegions,
    SubsectionMembers,
    SubsectionRooms,
    UrhHonorarium,
    Legislations,
    LegislationsTypes,
    Lawyers,
    Events,
    Speakers,
    Registrations,
    Certificates,
    ParticipantCategories,
    Checkins,
    Payments,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
    // prodMigrations: migrations,
  }),
  sharp,
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_USER!,
    defaultFromName: process.env.SMTP_FROM_NAME!,
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: Number(process.env.SMTP_PORT) === 465,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  upload: {
    limits: {
      fileSize: Number(process.env.PAYLOAD_MAX_UPLOAD_SIZE) * 1024 * 1024,
    },
    abortOnLimit: true,
    safeFileNames: true,
    preserveExtension: true,
    uploadTimeout: Number(process.env.PAYLOAD_UPLOAD_TIMEOUT) * 1000,
    responseOnLimit: 'Tamanho Máximo de Arquivo Excedido.',
  },
  folders: {
    browseByFolder: true,
    slug: 'fileFolders',
  },
  plugins: [...plugins],
  jobs: {
    tasks: [sendPostNotificationTask],

    autoRun: [
      {
        cron: '*/5 * * * *',
        limit: 50,
        queue: 'default',
      },
    ],
  },
  cors: [getServerSideURL()].filter(Boolean),
  bin: [
    {
      scriptPath: path.resolve(dirname, 'seed.ts'),
      key: 'seed',
    },
    {
      scriptPath: path.resolve(dirname, 'managements-seed.ts'),
      key: 'managements-seed',
    },
  ],
})
