import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type Dispatch, type ReactNode } from 'react'
import { demoReducer, initialDemoState, type DemoAction, type DemoState } from '../../domain/demo'

const STORAGE_KEY = 'maskedmatch.demo.v1'
const CHANNEL_KEY = 'maskedmatch.demo.channel.v1'
const TTL = 24 * 60 * 60 * 1000

type Stored = { savedAt: number; state: DemoState }

function loadState(): DemoState {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Stored | null
    if (parsed?.state.version === 1 && Date.now() - parsed.savedAt < TTL) return parsed.state
  } catch {
    // Invalid demo storage safely falls back to the deterministic seed.
  }
  return initialDemoState
}

const DemoContext = createContext<{ state: DemoState; dispatch: Dispatch<DemoAction> } | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(demoReducer, undefined, loadState)
  const senderId = useRef(crypto.randomUUID())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ savedAt: Date.now(), state }))
    const channel = new BroadcastChannel(CHANNEL_KEY)
    channel.postMessage({ sender: senderId.current, state })
    channel.close()
  }, [state])

  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_KEY)
    channel.onmessage = (event: MessageEvent<{ sender: string; state: DemoState }>) => {
      if (event.data?.sender !== senderId.current && event.data?.state?.version === 1) {
        dispatch({ type: 'PATCH', patch: event.data.state })
      }
    }
    return () => channel.close()
  }, [])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo() {
  const value = useContext(DemoContext)
  if (!value) throw new Error('useDemo must be used within DemoProvider')
  return value
}
