import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, type I18nValue } from './context'
import { LANGUAGE_STORAGE_KEY, supportedLanguages, type Locale } from './languages'

const en = {
  'language.label': 'Choose language',
  'nav.overview': 'Overview',
  'nav.architecture': 'Architecture',
  'nav.download': 'Download',
  'nav.main': 'Main navigation',
  'nav.toggle': 'Toggle navigation',
  'hero.title.1': 'Distribute from',
  'hero.title.2': 'every trusted path.',
  'hero.description': 'Ponte Mesh combines an authoritative Origin, authenticated Replica/Edge nodes and authorized peers — with fragment integrity and automatic fallback built in.',
  'hero.download': 'Download',
  'hero.architecture': 'Read the architecture',
  'hero.status': 'Server + native SDK',
  'diagram.title': 'Ponte Mesh delivery topology',
  'diagram.description': 'An authoritative Origin coordinates authenticated Replica Edge nodes and authorized peers while fragments move over trusted paths.',
  'diagram.origin.meta': 'AUTHORITATIVE',
  'diagram.peer.1': 'Authorized',
  'diagram.peer.2': 'peer',
  'architecture.title.1': 'One control plane.',
  'architecture.title.2': 'Multiple delivery paths.',
  'architecture.description': 'Every download starts with authorization from the Origin. The SDK can then combine trusted sources while validating each fragment before it becomes progress.',
  'architecture.origin': 'Origin',
  'architecture.origin.description': 'Authorizes, catalogs and guarantees fallback.',
  'architecture.replica': 'Replica / Edge',
  'architecture.replica.description': 'Replicates only within explicit scope.',
  'architecture.peers': 'Authorized peers',
  'architecture.peers.description': 'Shares temporary fragments when policy allows.',
  'architecture.sdk': 'SDK',
  'architecture.sdk.description': 'Selects sources, verifies hashes and preserves progress.',
  'architecture.control': 'Control & authorization (required)',
  'architecture.data': 'Data plane (opportunistic & distrusted)',
  'integration.title.1': 'Integrate once.',
  'integration.title.2': 'Let the SDK choose the path.',
  'integration.description': 'Give the SDK your Origin and object. It handles authorization, selects trusted sources, verifies every fragment, and preserves progress.',
  'integration.action': 'Explore the SDK',
  'integration.code': 'Rust integration example',
  'download.title': 'Download the latest release.',
  'download.description': 'Choose a product and platform. The matching package comes directly from the official GitHub Release.',
  'download.product': 'Product',
  'download.platform': 'Platform',
  'download.sdk': 'Native SDK',
  'download.server': 'Server',
  'download.note': 'Server and SDK packages support Windows x64, Linux x64, macOS Intel, and macOS ARM.',
  'download.selected': 'Selected package',
  'download.status': 'Release status',
  'download.loading.title': 'Checking GitHub Releases',
  'download.loading.description': 'Looking for the latest package for this platform.',
  'download.empty.title': 'No published release yet',
  'download.empty.description': 'The download will appear here as soon as the first GitHub Release is available.',
  'download.unavailable.title': 'Release status unavailable',
  'download.unavailable.description': 'GitHub could not be reached. You can still open the official releases page.',
  'download.action.sdk': 'View SDK releases',
  'download.action.server': 'View server releases',
  'download.action.direct': 'Download',
  'footer.navigation': 'Footer navigation',
  'footer.architecture': 'Architecture',
  'footer.security': 'Security',
  'footer.sdk': 'SDK repository',
  'footer.server': 'Server repository',
  'footer.closing': 'Ponte Mesh — controlled hybrid distribution.',
} as const

export type TranslationKey = keyof typeof en

const ptBR: Record<TranslationKey, string> = {
  'language.label': 'Escolher idioma',
  'nav.overview': 'Visão geral',
  'nav.architecture': 'Arquitetura',
  'nav.download': 'Download',
  'nav.main': 'Navegação principal',
  'nav.toggle': 'Alternar navegação',
  'hero.title.1': 'Distribua por todos os',
  'hero.title.2': 'caminhos confiáveis.',
  'hero.description': 'O Ponte Mesh combina um Origin autoritativo, nós Replica/Edge autenticados e peers autorizados — com integridade por fragmento e fallback automático incorporados.',
  'hero.download': 'Download',
  'hero.architecture': 'Conheça a arquitetura',
  'hero.status': 'Servidor + SDK nativo',
  'diagram.title': 'Topologia de entrega do Ponte Mesh',
  'diagram.description': 'Um Origin autoritativo coordena nós Replica Edge autenticados e peers autorizados enquanto fragmentos percorrem caminhos confiáveis.',
  'diagram.origin.meta': 'AUTORITATIVO',
  'diagram.peer.1': 'Peer',
  'diagram.peer.2': 'autorizado',
  'architecture.title.1': 'Um plano de controle.',
  'architecture.title.2': 'Vários caminhos de entrega.',
  'architecture.description': 'Todo download começa com a autorização do Origin. Depois, o SDK pode combinar fontes confiáveis enquanto valida cada fragmento antes que ele se torne progresso.',
  'architecture.origin': 'Origin',
  'architecture.origin.description': 'Autoriza, cataloga e garante o fallback.',
  'architecture.replica': 'Replica / Edge',
  'architecture.replica.description': 'Replica somente dentro do escopo explícito.',
  'architecture.peers': 'Peers autorizados',
  'architecture.peers.description': 'Compartilham fragmentos temporários quando a política permite.',
  'architecture.sdk': 'SDK',
  'architecture.sdk.description': 'Seleciona fontes, verifica hashes e preserva o progresso.',
  'architecture.control': 'Controle e autorização (obrigatórios)',
  'architecture.data': 'Plano de dados (oportunista e não confiável)',
  'integration.title.1': 'Integre uma vez.',
  'integration.title.2': 'Deixe o SDK escolher o caminho.',
  'integration.description': 'Informe ao SDK seu Origin e objeto. Ele cuida da autorização, seleciona fontes confiáveis, verifica cada fragmento e preserva o progresso.',
  'integration.action': 'Conheça o SDK',
  'integration.code': 'Exemplo de integração em Rust',
  'download.title': 'Baixe a versão mais recente.',
  'download.description': 'Escolha um produto e uma plataforma. O pacote correspondente vem diretamente da Release oficial no GitHub.',
  'download.product': 'Produto',
  'download.platform': 'Plataforma',
  'download.sdk': 'SDK nativo',
  'download.server': 'Servidor',
  'download.note': 'Os pacotes do Servidor e do SDK suportam Windows x64, Linux x64, macOS Intel e macOS ARM.',
  'download.selected': 'Pacote selecionado',
  'download.status': 'Status da release',
  'download.loading.title': 'Consultando as Releases do GitHub',
  'download.loading.description': 'Procurando o pacote mais recente para esta plataforma.',
  'download.empty.title': 'Ainda não há release publicada',
  'download.empty.description': 'O download aparecerá aqui assim que a primeira Release estiver disponível no GitHub.',
  'download.unavailable.title': 'Status da release indisponível',
  'download.unavailable.description': 'Não foi possível acessar o GitHub. Você ainda pode abrir a página oficial de releases.',
  'download.action.sdk': 'Ver releases do SDK',
  'download.action.server': 'Ver releases do Servidor',
  'download.action.direct': 'Baixar',
  'footer.navigation': 'Navegação do rodapé',
  'footer.architecture': 'Arquitetura',
  'footer.security': 'Segurança',
  'footer.sdk': 'Repositório do SDK',
  'footer.server': 'Repositório do Servidor',
  'footer.closing': 'Ponte Mesh — distribuição híbrida controlada.',
}

const es: Record<TranslationKey, string> = {
  'language.label': 'Elegir idioma',
  'nav.overview': 'Descripción general',
  'nav.architecture': 'Arquitectura',
  'nav.download': 'Descargar',
  'nav.main': 'Navegación principal',
  'nav.toggle': 'Alternar navegación',
  'hero.title.1': 'Distribuye desde todas las',
  'hero.title.2': 'rutas confiables.',
  'hero.description': 'Ponte Mesh combina un Origin autoritativo, nodos Replica/Edge autenticados y peers autorizados, con integridad por fragmento y fallback automático incorporados.',
  'hero.download': 'Descargar',
  'hero.architecture': 'Conoce la arquitectura',
  'hero.status': 'Servidor + SDK nativo',
  'diagram.title': 'Topología de entrega de Ponte Mesh',
  'diagram.description': 'Un Origin autoritativo coordina nodos Replica Edge autenticados y peers autorizados mientras los fragmentos recorren rutas confiables.',
  'diagram.origin.meta': 'AUTORITATIVO',
  'diagram.peer.1': 'Peer',
  'diagram.peer.2': 'autorizado',
  'architecture.title.1': 'Un plano de control.',
  'architecture.title.2': 'Múltiples rutas de entrega.',
  'architecture.description': 'Cada descarga comienza con la autorización del Origin. Después, el SDK puede combinar fuentes confiables mientras valida cada fragmento antes de convertirlo en progreso.',
  'architecture.origin': 'Origin',
  'architecture.origin.description': 'Autoriza, cataloga y garantiza el fallback.',
  'architecture.replica': 'Replica / Edge',
  'architecture.replica.description': 'Replica únicamente dentro del alcance explícito.',
  'architecture.peers': 'Peers autorizados',
  'architecture.peers.description': 'Comparten fragmentos temporales cuando la política lo permite.',
  'architecture.sdk': 'SDK',
  'architecture.sdk.description': 'Selecciona fuentes, verifica hashes y conserva el progreso.',
  'architecture.control': 'Control y autorización (obligatorios)',
  'architecture.data': 'Plano de datos (oportunista y no confiable)',
  'integration.title.1': 'Integra una vez.',
  'integration.title.2': 'Deja que el SDK elija la ruta.',
  'integration.description': 'Indica al SDK tu Origin y objeto. Este gestiona la autorización, selecciona fuentes confiables, verifica cada fragmento y conserva el progreso.',
  'integration.action': 'Conoce el SDK',
  'integration.code': 'Ejemplo de integración en Rust',
  'download.title': 'Descarga la versión más reciente.',
  'download.description': 'Elige un producto y una plataforma. El paquete correspondiente proviene directamente de la Release oficial de GitHub.',
  'download.product': 'Producto',
  'download.platform': 'Plataforma',
  'download.sdk': 'SDK nativo',
  'download.server': 'Servidor',
  'download.note': 'Los paquetes del Servidor y del SDK admiten Windows x64, Linux x64, macOS Intel y macOS ARM.',
  'download.selected': 'Paquete seleccionado',
  'download.status': 'Estado de la release',
  'download.loading.title': 'Consultando las Releases de GitHub',
  'download.loading.description': 'Buscando el paquete más reciente para esta plataforma.',
  'download.empty.title': 'Todavía no hay una release publicada',
  'download.empty.description': 'La descarga aparecerá aquí cuando la primera Release esté disponible en GitHub.',
  'download.unavailable.title': 'Estado de la release no disponible',
  'download.unavailable.description': 'No se pudo acceder a GitHub. Aún puedes abrir la página oficial de releases.',
  'download.action.sdk': 'Ver releases del SDK',
  'download.action.server': 'Ver releases del Servidor',
  'download.action.direct': 'Descargar',
  'footer.navigation': 'Navegación del pie de página',
  'footer.architecture': 'Arquitectura',
  'footer.security': 'Seguridad',
  'footer.sdk': 'Repositorio del SDK',
  'footer.server': 'Repositorio del Servidor',
  'footer.closing': 'Ponte Mesh — distribución híbrida controlada.',
}

const translations: Record<Locale, Record<TranslationKey, string>> = { en, 'pt-BR': ptBR, es }

function isLocale(value: string): value is Locale {
  return supportedLanguages.some((language) => language.code === value)
}

function resolveInitialLocale(): Locale {
  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (stored && isLocale(stored)) return stored
  const browserLanguage = navigator.language
  if (isLocale(browserLanguage)) return browserLanguage
  const baseLanguage = browserLanguage.split('-')[0]
  if (baseLanguage === 'pt') return 'pt-BR'
  if (isLocale(baseLanguage)) return baseLanguage
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(resolveInitialLocale)

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const value = useMemo<I18nValue>(() => ({
    locale,
    setLocale,
    t: (key) => translations[locale][key],
  }), [locale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
