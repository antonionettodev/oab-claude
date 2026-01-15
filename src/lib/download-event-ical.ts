import type { Event, Speaker } from '@/payload-types'

type ProgramItem = NonNullable<Event['program']>[number]
type ProgramSpeaker = ProgramItem['speaker']

function slugifyFilename(input: string) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function formatYYYYMMDD(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}${m}${d}`
}

function icsEscape(text: string) {
  return (text || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
}

function makeUid(seed: string) {
  const base = `${seed}-${Date.now()}-${Math.random().toString(16).slice(2)}`
  return `${slugifyFilename(base)}@seu-dominio`
}

function toYYYYMMDDFromPayloadDate(dateISO?: string) {
  if (!dateISO) return null
  const datePart = dateISO.slice(0, 10)
  // valida básico
  return /^\d{4}-\d{2}-\d{2}$/.test(datePart) ? datePart : null
}

function parseLocalDateTime(dateYYYYMMDD?: string, time?: string) {
  if (!dateYYYYMMDD) return null
  const [y, m, d] = dateYYYYMMDD.split('-').map(Number)
  let hh = 0,
    mm = 0,
    ss = 0
  if (time) {
    const parts = time.split(':').map(Number)
    hh = parts[0] ?? 0
    mm = parts[1] ?? 0
    ss = parts[2] ?? 0
  }
  return new Date(y, (m ?? 1) - 1, d ?? 1, hh, mm, ss, 0)
}

function toICSUtc(date: Date) {
  const y = date.getUTCFullYear()
  const mo = String(date.getUTCMonth() + 1).padStart(2, '0')
  const da = String(date.getUTCDate()).padStart(2, '0')
  const h = String(date.getUTCHours()).padStart(2, '0')
  const mi = String(date.getUTCMinutes()).padStart(2, '0')
  const s = String(date.getUTCSeconds()).padStart(2, '0')
  return `${y}${mo}${da}T${h}${mi}${s}Z`
}

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function isSpeaker(value: unknown): value is Speaker {
  return !!value && typeof value === 'object' && 'name' in value
}

function getSpeakerName(speaker: ProgramSpeaker) {
  return isSpeaker(speaker) ? speaker.name : null
}

function buildICal(event: Event) {
  const now = new Date()
  const dtstamp = toICSUtc(now)

  const startDateYYYYMMDD = toYYYYMMDDFromPayloadDate(event.startDate)
  const fileDate = startDateYYYYMMDD ? (parseLocalDateTime(startDateYYYYMMDD, '00:00') ?? now) : now

  const fileName = `${slugifyFilename(event.title)}-${formatYYYYMMDD(fileDate)}.ical`

  const program = event.program ?? []
  const hasProgram = program.length > 0

  const vevents: string[] = []

  if (hasProgram) {
    for (const item of program) {
      const itemDateYYYYMMDD = toYYYYMMDDFromPayloadDate(item.date as unknown as string)
      const start = parseLocalDateTime(itemDateYYYYMMDD ?? undefined, item.time ?? undefined)
      if (!start) continue

      const end = new Date(start.getTime() + 60 * 60 * 1000)

      const speakerName = getSpeakerName(item.speaker)
      const summary = speakerName ? `${item.title} (Com: ${speakerName})` : item.title

      const descriptionParts: string[] = []
      if (item.briefDescription) descriptionParts.push(item.briefDescription)
      descriptionParts.push(`Evento: ${event.title}`)
      if (event.venue) descriptionParts.push(`Local: ${event.venue}`)
      const description = descriptionParts.join('\n')

      const uid = makeUid(`${event.title}-${item.title}-${itemDateYYYYMMDD}-${item.time}`)

      const lines = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `SUMMARY:${icsEscape(summary)}`,
        `DESCRIPTION:${icsEscape(description)}`,
        event.venue ? `LOCATION:${icsEscape(event.venue)}` : null,
        `DTSTART:${toICSUtc(start)}`,
        `DTEND:${toICSUtc(end)}`,
        'END:VEVENT',
      ].filter(Boolean) as string[]

      vevents.push(lines.join('\r\n'))
    }
  } else {
    const start = parseLocalDateTime(startDateYYYYMMDD ?? undefined, event.startTime ?? undefined)
    const end = parseLocalDateTime(startDateYYYYMMDD ?? undefined, event.endTime ?? undefined)

    if (start) {
      const uid = makeUid(`${event.title}-${startDateYYYYMMDD}-${event.startTime}`)

      const descriptionParts: string[] = []
      if (event.description) descriptionParts.push(event.description)
      if (event.venue) descriptionParts.push(`Local: ${event.venue}`)
      const description = descriptionParts.join('\n')

      const lines = [
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${dtstamp}`,
        `SUMMARY:${icsEscape(event.title)}`,
        `DESCRIPTION:${icsEscape(description)}`,
        event.venue ? `LOCATION:${icsEscape(event.venue)}` : null,
        `DTSTART:${toICSUtc(start)}`,
        end ? `DTEND:${toICSUtc(end)}` : null,
        'END:VEVENT',
      ].filter(Boolean) as string[]

      vevents.push(lines.join('\r\n'))
    }
  }

  const calendarLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SeuApp//Eventos//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...vevents,
    'END:VCALENDAR',
    '',
  ]

  const ics = calendarLines.join('\r\n')
  return { fileName, ics }
}

export function downloadEventIcal(event: Event) {
  const { fileName, ics } = buildICal(event)
  downloadTextFile(fileName, ics)
}
