export type QueueState =
  | 'NONE'
  | 'QUEUED'
  | 'READY_CHECK'
  | 'ACCEPTED'
  | 'EXPIRED'
  | 'IN_INTERVIEW'
  | 'COMPLETED'

export type InterviewState =
  | 'PREFLIGHT'
  | 'ACTIVE'
  | 'RECONNECTING'
  | 'COMPLETED'

export type DecisionValue = 'INTERESTED' | 'PASS'
export type Scenario = 'happy' | 'no-match' | 'media-denied' | 'queue-timeout' | 'offline'

export interface DemoState {
  version: 1
  scenario: Scenario
  verified: boolean
  requiredConsent: boolean
  reducedMotion: boolean
  listFirst: boolean
  profileImported: boolean
  profileApproved: boolean
  avatar: 'fox' | 'rabbit' | 'bear' | 'dog'
  queue: {
    id: 'queue-demo-001' | null
    state: QueueState
    position: number
    readyDeadline: number | null
  }
  interview: {
    state: InterviewState
    mediaMode: 'AVATAR_ONLY' | 'AUDIO_ONLY' | 'TEXT_ASSISTED'
    micOn: boolean
    cameraOn: boolean
    endsAt: number | null
  }
  candidateDecision: DecisionValue | null
  recruiterDecision: DecisionValue | null
  revealedFields: string[]
  recruiterAvailable: boolean
  network: 'ONLINE' | 'RECONNECTING' | 'OFFLINE'
}

export const initialDemoState: DemoState = {
  version: 1,
  scenario: 'happy',
  verified: false,
  requiredConsent: false,
  reducedMotion: false,
  listFirst: false,
  profileImported: false,
  profileApproved: false,
  avatar: 'fox',
  queue: { id: null, state: 'NONE', position: 3, readyDeadline: null },
  interview: {
    state: 'PREFLIGHT',
    mediaMode: 'AVATAR_ONLY',
    micOn: false,
    cameraOn: false,
    endsAt: null,
  },
  candidateDecision: null,
  recruiterDecision: null,
  revealedFields: [],
  recruiterAvailable: false,
  network: 'ONLINE',
}

export type DemoAction =
  | { type: 'PATCH'; patch: Partial<DemoState> }
  | { type: 'VERIFY'; reducedMotion: boolean; listFirst: boolean }
  | { type: 'IMPORT_PROFILE' }
  | { type: 'APPROVE_PROFILE' }
  | { type: 'SET_AVATAR'; avatar: DemoState['avatar'] }
  | { type: 'JOIN_QUEUE' }
  | { type: 'DISPATCH_QUEUE'; now?: number }
  | { type: 'EXPIRE_READY' }
  | { type: 'REQUEUE' }
  | { type: 'ACCEPT_READY' }
  | { type: 'START_INTERVIEW'; now?: number }
  | { type: 'COMPLETE_INTERVIEW' }
  | { type: 'SET_MEDIA'; mediaMode: DemoState['interview']['mediaMode'] }
  | { type: 'TOGGLE_MIC' }
  | { type: 'SUBMIT_CANDIDATE_DECISION'; value: DecisionValue }
  | { type: 'SUBMIT_RECRUITER_DECISION'; value: DecisionValue }
  | { type: 'REVEAL'; fields: string[] }
  | { type: 'SET_SCENARIO'; scenario: Scenario }
  | { type: 'SET_NETWORK'; network: DemoState['network'] }
  | { type: 'RESET' }

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'PATCH':
      return { ...state, ...action.patch }
    case 'VERIFY':
      return { ...state, verified: true, requiredConsent: true, reducedMotion: action.reducedMotion, listFirst: action.listFirst }
    case 'IMPORT_PROFILE':
      return { ...state, profileImported: true }
    case 'APPROVE_PROFILE':
      return { ...state, profileApproved: true }
    case 'SET_AVATAR':
      return { ...state, avatar: action.avatar }
    case 'JOIN_QUEUE':
      if (state.queue.id) return state
      return { ...state, queue: { id: 'queue-demo-001', state: 'QUEUED', position: 3, readyDeadline: null } }
    case 'DISPATCH_QUEUE':
      if (state.queue.state !== 'QUEUED') return state
      return { ...state, queue: { ...state.queue, state: 'READY_CHECK', position: 1, readyDeadline: (action.now ?? Date.now()) + 60_000 } }
    case 'EXPIRE_READY':
      return { ...state, queue: { ...state.queue, state: 'EXPIRED', readyDeadline: null } }
    case 'REQUEUE':
      return { ...state, queue: { id: 'queue-demo-001', state: 'QUEUED', position: 4, readyDeadline: null } }
    case 'ACCEPT_READY':
      return { ...state, queue: { ...state.queue, state: 'ACCEPTED', readyDeadline: null } }
    case 'START_INTERVIEW':
      return {
        ...state,
        queue: { ...state.queue, state: 'IN_INTERVIEW' },
        interview: { ...state.interview, state: 'ACTIVE', endsAt: (action.now ?? Date.now()) + 12 * 60_000 },
      }
    case 'COMPLETE_INTERVIEW':
      return {
        ...state,
        queue: { ...state.queue, state: 'COMPLETED' },
        interview: { ...state.interview, state: 'COMPLETED' },
      }
    case 'SET_MEDIA':
      return { ...state, interview: { ...state.interview, mediaMode: action.mediaMode, cameraOn: false } }
    case 'TOGGLE_MIC':
      return { ...state, interview: { ...state.interview, micOn: !state.interview.micOn } }
    case 'SUBMIT_CANDIDATE_DECISION':
      return { ...state, candidateDecision: state.candidateDecision ?? action.value }
    case 'SUBMIT_RECRUITER_DECISION':
      return { ...state, recruiterDecision: state.recruiterDecision ?? action.value }
    case 'REVEAL':
      return { ...state, revealedFields: action.fields }
    case 'SET_SCENARIO': {
      const next = { ...initialDemoState, scenario: action.scenario }
      if (action.scenario === 'media-denied') next.interview.mediaMode = 'AVATAR_ONLY'
      if (action.scenario === 'offline') next.network = 'RECONNECTING'
      return next
    }
    case 'SET_NETWORK':
      return { ...state, network: action.network }
    case 'RESET':
      return initialDemoState
  }
}

export function isMutualMatch(state: DemoState) {
  return state.candidateDecision === 'INTERESTED' && state.recruiterDecision === 'INTERESTED'
}

export function isDecisionComplete(state: DemoState) {
  return Boolean(state.candidateDecision && state.recruiterDecision)
}
