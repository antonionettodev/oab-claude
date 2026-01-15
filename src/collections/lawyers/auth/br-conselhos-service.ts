/**
 * Serviço de Autenticação BR Conselhos
 *
 * Este serviço faz a autenticação de advogados usando a API SOAP do BR Conselhos.
 * A autenticação é feita com CPF/CNPJ e senha.
 */

// URL de homologação do BR Conselhos
const BR_CONSELHOS_URL =
  process.env.BR_CONSELHOS_URL ||
  'https://homolog.oab-sc.org.br/BRConselhos_HML/WSAutenticar/WSAutenticar.asmx'

/**
 * Interface com os dados retornados pelo BR Conselhos
 */
export interface BRConselhosUserData {
  status: string
  registroConselho?: string
  registroConselhoTemporario?: string
  nome?: string
  dataNascimento?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  municipio?: string
  estado?: string
  pais?: string
  estadoCivil?: string
  nomeMae?: string
  nomePai?: string
  emailComercial?: string
  telefoneComercial?: string
  telefone2Comercial?: string
  subunidade?: string
  dataAcordao?: string
  dataAcordaoEstagiario?: string
  inadimplente?: string
  situacaoAtual?: string
  jovemAdvogado?: string
  cpfCnpj?: string
  rg?: string
  orgaoEmissorRG?: string
  dataEmissaoRG?: string
  loginUser?: string
  dtInscricao?: string
  subsecao?: string
}

/**
 * Monta o envelope SOAP para autenticação
 */
function buildSoapEnvelope(usuario: string, senha: string): string {
  return `<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Autenticar xmlns="http://tempuri.org/">
      <Usuario>${usuario}</Usuario>
      <Senha>${senha}</Senha>
    </Autenticar>
  </soap:Body>
</soap:Envelope>`
}

/**
 * Extrai o valor de uma tag XML
 */
function extractXmlValue(xml: string, tagName: string): string | undefined {
  // Tenta com &lt; e &gt; (HTML entities)
  const encodedRegex = new RegExp(`${tagName}&gt;([^&]*?)&lt;/${tagName}`, 'i')
  const encodedMatch = xml.match(encodedRegex)
  if (encodedMatch) {
    return encodedMatch[1].trim()
  }

  // Tenta com tags normais
  const normalRegex = new RegExp(`<${tagName}>([^<]*?)</${tagName}>`, 'i')
  const normalMatch = xml.match(normalRegex)
  if (normalMatch) {
    return normalMatch[1].trim()
  }

  return undefined
}

/**
 * Faz o parse do XML de resposta do BR Conselhos
 */
function parseResponse(xmlResponse: string): BRConselhosUserData {
  // Decodifica entities HTML se necessário
  const decodedXml = xmlResponse
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")

  const status = extractXmlValue(decodedXml, 'Status') || 'Erro'

  if (status !== 'OK') {
    return { status }
  }

  return {
    status,
    registroConselho: extractXmlValue(decodedXml, 'RegistroConselho'),
    registroConselhoTemporario: extractXmlValue(decodedXml, 'RegistroConselhoTemporario'),
    nome: extractXmlValue(decodedXml, 'Nome'),
    dataNascimento: extractXmlValue(decodedXml, 'DataNascimento') || extractXmlValue(decodedXml, 'DataNascimentoFundacao'),
    cep: extractXmlValue(decodedXml, 'CEP') || extractXmlValue(decodedXml, 'CEPCorreio.CEP'),
    logradouro: extractXmlValue(decodedXml, 'Logradouro') || extractXmlValue(decodedXml, 'LogradouroCorreio'),
    numero: extractXmlValue(decodedXml, 'Numero') || extractXmlValue(decodedXml, 'NumeroCorreio'),
    complemento: extractXmlValue(decodedXml, 'Complemento') || extractXmlValue(decodedXml, 'ComplementoCorreio'),
    bairro: extractXmlValue(decodedXml, 'Bairro') || extractXmlValue(decodedXml, 'BairroCorreio'),
    municipio: extractXmlValue(decodedXml, 'Municipio') || extractXmlValue(decodedXml, 'MunicipioCorreio'),
    estado: extractXmlValue(decodedXml, 'Estado') || extractXmlValue(decodedXml, 'MunicipioCorreio.Estado.Sigla'),
    pais: extractXmlValue(decodedXml, 'Pais') || extractXmlValue(decodedXml, 'MunicipioCorreio.Pais.Descricao'),
    estadoCivil: extractXmlValue(decodedXml, 'EstadoCivil'),
    nomeMae: extractXmlValue(decodedXml, 'NomeMae'),
    nomePai: extractXmlValue(decodedXml, 'NomePai'),
    emailComercial: extractXmlValue(decodedXml, 'Email') || extractXmlValue(decodedXml, 'EMailComercial') || extractXmlValue(decodedXml, 'EmailComercial'),
    telefoneComercial: extractXmlValue(decodedXml, 'TelComercial') || extractXmlValue(decodedXml, 'TelefoneComercial') || extractXmlValue(decodedXml, 'TelCelular'),
    telefone2Comercial: extractXmlValue(decodedXml, 'Telefone2Comercial') || extractXmlValue(decodedXml, 'TelComercial'),
    subunidade: extractXmlValue(decodedXml, 'SubSecao') || extractXmlValue(decodedXml, 'SubUnidadeAtual.NomeSubUnidade'),
    dataAcordao: extractXmlValue(decodedXml, 'DataAcordao'),
    dataAcordaoEstagiario: extractXmlValue(decodedXml, 'DataAcordaoEstagiario'),
    inadimplente: extractXmlValue(decodedXml, 'Inadimplente'),
    situacaoAtual: extractXmlValue(decodedXml, 'SituacaoAtual'),
    jovemAdvogado: extractXmlValue(decodedXml, 'JovemAdvogado'),
    cpfCnpj: extractXmlValue(decodedXml, 'CPFCNPJ'),
    rg: extractXmlValue(decodedXml, 'RG'),
    orgaoEmissorRG: extractXmlValue(decodedXml, 'OrgaoEmissorRG'),
    dataEmissaoRG: extractXmlValue(decodedXml, 'DataEmissaoRG'),
    loginUser: extractXmlValue(decodedXml, 'LoginUser'),
    dtInscricao: extractXmlValue(decodedXml, 'DtInscricao'),
    subsecao: extractXmlValue(decodedXml, 'SubSecao'),
  }
}

/**
 * Converte data no formato DD/MM/YYYY para ISO
 */
function parseDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) return undefined

  // Tenta formato DD/MM/YYYY
  const parts = dateStr.split('/')
  if (parts.length === 3) {
    const [day, month, year] = parts
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  return dateStr
}

/**
 * Mapeia estado civil do BR Conselhos para o formato da collection
 */
function mapMaritalStatus(status: string | undefined): string | undefined {
  if (!status) return undefined

  const statusMap: Record<string, string> = {
    'Solteiro': 'solteiro',
    'Solteiro(a)': 'solteiro',
    'Casado': 'casado',
    'Casado(a)': 'casado',
    'Divorciado': 'divorciado',
    'Divorciado(a)': 'divorciado',
    'Viúvo': 'viuvo',
    'Viúvo(a)': 'viuvo',
    'Separado': 'separado',
    'Separado(a)': 'separado',
    'União Estável': 'uniao-estavel',
  }

  return statusMap[status] || undefined
}

/**
 * Mapeia situação do BR Conselhos para o formato da collection
 */
function mapStatus(situacao: string | undefined): string | undefined {
  if (!situacao) return undefined

  const statusMap: Record<string, string> = {
    'Ativo': 'ativo',
    'Inativo': 'inativo',
    'Suspenso': 'suspenso',
    'Licenciado': 'licenciado',
    'Cancelado': 'cancelado',
    'Falecido': 'falecido',
  }

  return statusMap[situacao] || 'ativo'
}

/**
 * Autentica um usuário no BR Conselhos
 *
 * @param cpf - CPF do advogado (apenas números)
 * @param senha - Senha do advogado
 * @returns Dados do usuário ou null se falhar
 */
export async function authenticateBRConselhos(
  cpf: string,
  senha: string
): Promise<BRConselhosUserData | null> {
  // Remove caracteres não numéricos do CPF
  const cpfClean = cpf.replace(/\D/g, '')

  if (!cpfClean || !senha) {
    console.error('BR Conselhos: CPF e senha são obrigatórios')
    return null
  }

  try {
    const soapEnvelope = buildSoapEnvelope(cpfClean, senha)

    console.log('BR Conselhos: Autenticando CPF:', cpfClean.substring(0, 3) + '***')

    const response = await fetch(BR_CONSELHOS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'http://tempuri.org/Autenticar',
      },
      body: soapEnvelope,
    })

    if (!response.ok) {
      console.error('BR Conselhos: Erro na requisição:', response.status, response.statusText)
      return null
    }

    const xmlResponse = await response.text()

    // Extrai o conteúdo do AutenticarResult
    const resultMatch = xmlResponse.match(/<AutenticarResult>([\s\S]*?)<\/AutenticarResult>/)
    if (!resultMatch) {
      console.error('BR Conselhos: Resposta inválida')
      return null
    }

    const userData = parseResponse(resultMatch[1])

    if (userData.status !== 'OK') {
      console.log('BR Conselhos: Autenticação falhou -', userData.status)
      return null
    }

    console.log('BR Conselhos: Autenticação bem-sucedida para:', userData.nome)
    return userData
  } catch (error) {
    console.error('BR Conselhos: Erro ao autenticar:', error)
    return null
  }
}

/**
 * Converte os dados do BR Conselhos para o formato da collection lawyers
 */
export function mapBRConselhosToLawyer(data: BRConselhosUserData): Record<string, unknown> {
  return {
    name: data.nome?.toUpperCase(),
    cpf: data.cpfCnpj?.replace(/\D/g, ''),
    birthDate: parseDate(data.dataNascimento),
    maritalStatus: mapMaritalStatus(data.estadoCivil),
    rg: data.rg,
    rgIssuer: data.orgaoEmissorRG,
    rgIssueDate: parseDate(data.dataEmissaoRG),
    motherName: data.nomeMae?.toUpperCase(),
    fatherName: data.nomePai?.toUpperCase(),
    oabNumber: data.registroConselho,
    temporaryRegistration: data.registroConselhoTemporario,
    oabState: data.estado || 'SC',
    subunit: data.subunidade || data.subsecao,
    status: mapStatus(data.situacaoAtual),
    isDefaulter: data.inadimplente?.toLowerCase() === 'sim',
    isYoungLawyer: data.jovemAdvogado?.toLowerCase() === 'sim',
    judgmentDate: parseDate(data.dataAcordao),
    internJudgmentDate: parseDate(data.dataAcordaoEstagiario),
    commercialEmail: data.emailComercial?.toLowerCase(),
    commercialPhone: data.telefoneComercial?.replace(/\D/g, ''),
    commercialPhone2: data.telefone2Comercial?.replace(/\D/g, ''),
    postalCode: data.cep?.replace(/\D/g, ''),
    street: data.logradouro?.toUpperCase(),
    streetNumber: data.numero,
    complement: data.complemento,
    neighborhood: data.bairro?.toUpperCase(),
    city: data.municipio?.toUpperCase(),
    state: data.estado,
    country: data.pais?.toUpperCase() || 'BRASIL',
  }
}
