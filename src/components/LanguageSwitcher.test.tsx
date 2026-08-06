import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Header } from './Header'
import { Hero } from './Hero'
import { I18nProvider } from '../i18n/I18nContext'

describe('LanguageSwitcher', () => {
  it('translates the interface into Portuguese and Spanish and persists the choice', async () => {
    render(<I18nProvider><Header /><Hero /></I18nProvider>)

    fireEvent.click(screen.getByRole('button', { name: 'Choose language' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /PT-BR/ }))

    expect(screen.getByRole('heading', { name: 'Distribua por todos os caminhos confiáveis.' })).toBeInTheDocument()
    await waitFor(() => expect(document.documentElement.lang).toBe('pt-BR'))
    expect(window.localStorage.getItem('pontemesh.language')).toBe('pt-BR')

    fireEvent.click(screen.getByRole('button', { name: 'Escolher idioma' }))
    fireEvent.click(screen.getByRole('menuitemradio', { name: /ES/ }))

    expect(screen.getByRole('heading', { name: 'Distribuye desde todas las rutas confiables.' })).toBeInTheDocument()
    await waitFor(() => expect(document.documentElement.lang).toBe('es'))
    expect(window.localStorage.getItem('pontemesh.language')).toBe('es')
  })
})
