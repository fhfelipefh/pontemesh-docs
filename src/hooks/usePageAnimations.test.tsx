import { render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../App'
import { I18nProvider } from '../i18n/I18nContext'

const anime = vi.hoisted(() => ({
  animate: vi.fn(),
  revert: vi.fn(),
  set: vi.fn(),
  reduceMotion: false,
}))

vi.mock('animejs/animation', () => ({ animate: anime.animate }))
vi.mock('animejs/utils', () => ({ set: anime.set, stagger: vi.fn(() => 0) }))
vi.mock('animejs/scope', () => ({
  createScope: vi.fn(() => {
    const scope = {
      matches: { reduceMotion: anime.reduceMotion },
      execute: (callback: () => void) => callback(),
      add: (callback: (currentScope: unknown) => void) => {
        callback(scope)
        return scope
      },
      revert: anime.revert,
    }
    return scope
  }),
}))

class IntersectionObserverStub {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

beforeEach(() => {
  anime.animate.mockClear()
  anime.revert.mockClear()
  anime.set.mockClear()
  anime.reduceMotion = false
  vi.stubGlobal('IntersectionObserver', IntersectionObserverStub)
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 404 })))
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('usePageAnimations', () => {
  it('starts the page and diagram animations in normal motion mode', () => {
    const { unmount } = render(<I18nProvider><App /></I18nProvider>)

    expect(anime.set).toHaveBeenCalled()
    expect(anime.animate).toHaveBeenCalledWith('.mesh-diagram__data path', expect.objectContaining({ loop: true }))
    expect(anime.animate).toHaveBeenCalledWith('.mesh-diagram__fragments rect', expect.objectContaining({ alternate: true }))

    unmount()
    expect(anime.revert).toHaveBeenCalled()
  })

  it('does not start animations when reduced motion is requested', () => {
    anime.reduceMotion = true
    render(<I18nProvider><App /></I18nProvider>)

    expect(anime.set).not.toHaveBeenCalled()
    expect(anime.animate).not.toHaveBeenCalled()
  })
})
