import { createNew, injectable, injector } from './index'

describe('injector', () => {
  @injectable
  class LivingSection {}
  @injectable
  class TechnicalSection {}
  @injectable
  class SpaceShuttle {
    constructor(public livingSection: LivingSection, public technicalSection: TechnicalSection) {}
  }

  afterEach(() => {
    injector.invalidate(LivingSection)
    injector.invalidate(TechnicalSection)
  })

  it('resolves class dependencies', () => {
    const { livingSection, technicalSection } = createNew(SpaceShuttle)

    expect(livingSection).toBeInstanceOf(LivingSection)
    expect(technicalSection).toBeInstanceOf(TechnicalSection)
  })

  it('treats dependencies as singletons', () => {
    const shuttle = createNew(SpaceShuttle)
    const renovatedShuttle = createNew(SpaceShuttle)

    expect(shuttle.livingSection).toBe(renovatedShuttle.livingSection)
    expect(shuttle.technicalSection).toBe(renovatedShuttle.technicalSection)
  })

  it('does not keep instance of the class created not by the injector', () => {
    const livingSection = createNew(LivingSection)
    expect(injector.has(LivingSection)).toBe(false)

    const shuttle = createNew(SpaceShuttle)
    expect(injector.has(LivingSection)).toBe(true)
    expect(livingSection === shuttle.livingSection).toBe(false)
  })
})
