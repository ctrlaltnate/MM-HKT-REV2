import { describe, expect, it } from 'vitest'
import { demoReducer, initialDemoState, isMutualMatch } from './demo'

describe('demo domain state', () => {
  it('creates only one active queue ticket for repeated joins', () => {
    const once = demoReducer(initialDemoState, { type: 'JOIN_QUEUE' })
    const twice = demoReducer(once, { type: 'JOIN_QUEUE' })
    expect(twice.queue.id).toBe('queue-demo-001')
    expect(twice).toEqual(once)
  })

  it('does not resolve a match before both private decisions exist', () => {
    const candidateOnly = demoReducer(initialDemoState, { type: 'SUBMIT_CANDIDATE_DECISION', value: 'INTERESTED' })
    expect(isMutualMatch(candidateOnly)).toBe(false)
    const both = demoReducer(candidateOnly, { type: 'SUBMIT_RECRUITER_DECISION', value: 'INTERESTED' })
    expect(isMutualMatch(both)).toBe(true)
  })

  it('recovers an expired ready check through a no-penalty requeue', () => {
    const queued = demoReducer(initialDemoState, { type: 'JOIN_QUEUE' })
    const ready = demoReducer(queued, { type: 'DISPATCH_QUEUE', now: 1000 })
    expect(ready.queue.readyDeadline).toBe(61000)
    const expired = demoReducer(ready, { type: 'EXPIRE_READY' })
    const recovered = demoReducer(expired, { type: 'REQUEUE' })
    expect(recovered.queue.state).toBe('QUEUED')
    expect(recovered.queue.id).toBe('queue-demo-001')
  })

  it('reveals only explicitly selected fields', () => {
    const result = demoReducer(initialDemoState, { type: 'REVEAL', fields: ['email', 'portfolio'] })
    expect(result.revealedFields).toEqual(['email', 'portfolio'])
    expect(result.revealedFields).not.toContain('phone')
  })
})
