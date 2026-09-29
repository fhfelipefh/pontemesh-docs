import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'
import { PerformanceSection } from './PerformanceSection'
import { I18nProvider } from '../i18n/I18nContext'

describe('PerformanceSection i18n', () => {
  it('renders translated strings without leaking English in pt-BR', () => {
    window.localStorage.setItem('pontemesh.language', 'pt-BR')
    render(
      <I18nProvider>
        <PerformanceSection />
      </I18nProvider>
    )

    // Should contain Portuguese scenario names
    expect(screen.getByText('Ponte Mesh: Enxame Frio (Sem Cache)')).toBeInTheDocument()
    expect(screen.getByText('Ponte Mesh: Semeador Dedicado')).toBeInTheDocument()
    expect(screen.getByText('Ponte Mesh: Múltiplos Pares Locais')).toBeInTheDocument()
    expect(screen.getByText('Cliente-Servidor Tradicional (Direto)')).toBeInTheDocument()

    // English strings must NOT be present
    expect(screen.queryByText('Ponte Mesh: Cold Swarm')).not.toBeInTheDocument()
    expect(screen.queryByText('P2P Mesh')).not.toBeInTheDocument()
    expect(screen.queryByText('Direct Origin')).not.toBeInTheDocument()

    // Badges, metrics, tabs, button
    expect(screen.getAllByText('Malha P2P').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Vazão Útil:').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Tempo (DCT):').length).toBeGreaterThan(0)
    expect(screen.getByText('Painel Geral (2x2)')).toBeInTheDocument()
    expect(screen.getByText(/Abrir gráfico em alta resolução/)).toBeInTheDocument()
  })

  it('switches between locales seamlessly', () => {
    window.localStorage.removeItem('pontemesh.language')
    render(
      <I18nProvider>
        <Header />
        <PerformanceSection />
      </I18nProvider>
    )

    // Switch to English
    fireEvent.click(screen.getByRole('button', { name: /idioma|language/i }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /EN/ }))
    expect(screen.getByText('Ponte Mesh: Cold Swarm')).toBeInTheDocument()
    expect(screen.getAllByText('P2P Mesh').length).toBeGreaterThan(0)

    // Switch to Spanish
    fireEvent.click(screen.getByRole('button', { name: /Choose language/i }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /ES/ }))
    expect(screen.getByText('Ponte Mesh: Enjambre Frío (Sin Caché)')).toBeInTheDocument()
    expect(screen.getAllByText('Malla P2P').length).toBeGreaterThan(0)
  })
})
