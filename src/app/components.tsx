import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDemo } from '../data/demo/DemoContext'

export function PixelButton({ variant = 'primary', className = '', loading, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'quiet' | 'danger'; loading?: boolean }) {
  return (
    <button className={`button button--${variant} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <><span className="spinner" aria-hidden="true" /> กำลังดำเนินการ…</> : children}
    </button>
  )
}

export function DemoBanner() {
  return (
    <div className="demo-banner" role="status">
      <span className="demo-banner__signal" aria-hidden="true">●</span>
      <strong>DEMO DATA</strong>
      <span>ข้อมูลทั้งหมดเป็นข้อมูลสังเคราะห์</span>
      <span className="demo-banner__divider" aria-hidden="true" />
      <strong>NOT A REAL THAID INTEGRATION</strong>
    </div>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link to="/event/demo" className={`brand ${compact ? 'brand--compact' : ''}`} aria-label="MaskedMatch หน้าหลัก"><span className="brand__mark" aria-hidden="true">M</span><span>MASKED<span>MATCH</span></span></Link>
}

export function BlindBadge() {
  return <span className="badge badge--cyan"><span aria-hidden="true">◇</span> BLIND MODE ACTIVE</span>
}

export function NetworkBadge() {
  const { state } = useDemo()
  const label = state.network === 'ONLINE' ? 'ออนไลน์' : state.network === 'OFFLINE' ? 'ออฟไลน์' : 'กำลังเชื่อมต่อ'
  return <span className={`network network--${state.network.toLowerCase()}`} role="status"><span aria-hidden="true">●</span> {label}</span>
}

export function PageShell({ children, minimal = false }: { children: ReactNode; minimal?: boolean }) {
  const { state } = useDemo()
  return (
    <div className={state.reducedMotion ? 'app reduce-motion' : 'app'}>
      <a className="skip-link" href="#main">ข้ามไปยังเนื้อหาหลัก</a>
      <DemoBanner />
      {!minimal && (
        <header className="site-header">
          <Brand compact />
          <div className="site-header__meta"><BlindBadge /><NetworkBadge /></div>
        </header>
      )}
      {state.network !== 'ONLINE' && (
        <div className="connection-bar" role="status">
          <span aria-hidden="true">↻</span> การเชื่อมต่อขาดชั่วคราว กำลังนำสถานะล่าสุดกลับมา — คิวของคุณยังอยู่
        </div>
      )}
      <main id="main">{children}</main>
    </div>
  )
}

export function Progress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="progress" aria-label="ขั้นตอนการเตรียมตัว">
      {['ยืนยัน', 'โปรไฟล์', 'อวตาร'].map((label, index) => (
        <li key={label} className={index + 1 <= current ? 'is-active' : ''} aria-current={index + 1 === current ? 'step' : undefined}>
          <span>{index + 1}</span>{label}
        </li>
      ))}
    </ol>
  )
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow"><span aria-hidden="true">▰</span> {children}</p>
}

export function QueueChip() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  if (!state.queue.id || state.queue.state === 'COMPLETED') return null
  const ready = state.queue.state === 'READY_CHECK'
  const expired = state.queue.state === 'EXPIRED'
  return (
    <aside className={`queue-chip ${ready ? 'queue-chip--ready' : ''}`} aria-live="polite">
      <div className="queue-chip__icon" aria-hidden="true">{ready ? '!' : expired ? '↻' : '⌛'}</div>
      <div>
        <strong>{ready ? 'ถึงคิวของคุณแล้ว' : expired ? 'หมดเวลาตอบรับ' : 'คิว Cyber Orchard'}</strong>
        <span>{ready ? 'ยืนยันภายใน 60 วินาที' : expired ? 'เข้าคิวใหม่ได้โดยไม่ถูกลงโทษ' : `ลำดับ #${state.queue.position} · ประมาณ 8–12 นาที`}</span>
      </div>
      {ready ? <PixelButton onClick={() => navigate('/event/demo/world')}>เปิด</PixelButton> : expired ? <PixelButton onClick={() => dispatch({ type: 'REQUEUE' })}>เข้าคิวใหม่</PixelButton> : <PixelButton variant="secondary" onClick={() => dispatch({ type: 'DISPATCH_QUEUE' })}>Demo: เรียกคิว</PixelButton>}
    </aside>
  )
}

export function ReadyCheckDialog() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [remaining, setRemaining] = useState(60)
  const [minimized, setMinimized] = useState(false)

  useEffect(() => {
    if (state.queue.state !== 'READY_CHECK' || !state.queue.readyDeadline) return
    setMinimized(false)
    window.setTimeout(() => titleRef.current?.focus(), 0)
    const tick = () => {
      const next = Math.max(0, Math.ceil((state.queue.readyDeadline! - Date.now()) / 1000))
      setRemaining(next)
      if (next === 0) dispatch({ type: 'EXPIRE_READY' })
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [state.queue.state, state.queue.readyDeadline, dispatch])

  if (state.queue.state !== 'READY_CHECK' || minimized) return null
  return (
    <div className="modal-backdrop" onKeyDown={(event) => { if (event.key === 'Escape') setMinimized(true) }}>
      <section className="ready-dialog" role="alertdialog" aria-modal="true" aria-labelledby="ready-title" aria-describedby="ready-description">
        <div className="ready-dialog__clock" aria-hidden="true">⌁</div>
        <p className="eyebrow eyebrow--dark">READY CHECK</p>
        <h2 id="ready-title" ref={titleRef} tabIndex={-1}>ถึงคิวสัมภาษณ์แล้ว</h2>
        <p id="ready-description">Backend Developer · Cyber Orchard Co.</p>
        <div className="countdown" aria-label={`เหลือ ${remaining} วินาที`}><span>00</span><b>:</b><span>{String(remaining).padStart(2, '0')}</span></div>
        <p className="ready-dialog__hint">กรุณากดปุ่มเมื่อคุณพร้อม ระบบจะไม่พาเข้าห้องโดยอัตโนมัติ</p>
        <div className="button-row">
          <PixelButton onClick={() => { dispatch({ type: 'ACCEPT_READY' }); navigate('/interviews/demo-session/preflight') }}>พร้อมสัมภาษณ์</PixelButton>
          <PixelButton variant="secondary" onClick={() => { dispatch({ type: 'REQUEUE' }); setMinimized(true) }}>ขอเลื่อน 1 ครั้ง</PixelButton>
        </div>
        <button className="text-button" onClick={() => setMinimized(true)}>ย่อไว้ก่อน (Esc)</button>
      </section>
    </div>
  )
}

export function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="เมนูหลักบนมือถือ">
      <Link to="/event/demo/world"><span aria-hidden="true">▦</span>แผนที่</Link>
      <Link to="/event/demo/navigator"><span aria-hidden="true">⌕</span>งาน</Link>
      <Link to="/event/demo/world"><span aria-hidden="true">⌛</span>คิว</Link>
      <Link to="/event/demo/navigator#support"><span aria-hidden="true">?</span>ช่วย</Link>
      <Link to="/candidate/profile/review"><span aria-hidden="true">◉</span>ฉัน</Link>
    </nav>
  )
}

export function MatchScore({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`match-score ${compact ? 'match-score--compact' : ''}`}>
      <div className="match-score__number"><strong>92</strong><span>/100</span></div>
      <div><b>ตรงกับทักษะสูง</b><span>DEMO MATCH RULE · ไม่ใช่ผลตัดสินจ้างงาน</span></div>
    </div>
  )
}

export function useCountdown(endsAt: number | null) {
  const [remaining, setRemaining] = useState(12 * 60)
  useEffect(() => {
    if (!endsAt) return
    const tick = () => setRemaining(Math.max(0, Math.floor((endsAt - Date.now()) / 1000)))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [endsAt])
  return `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
}
