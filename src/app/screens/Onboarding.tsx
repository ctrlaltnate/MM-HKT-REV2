import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CANDIDATE, COMPANIES, EVENT, JOB } from '../../data/demo/fixtures'
import { useDemo } from '../../data/demo/DemoContext'
import { Brand, PageShell, PixelButton, Progress, SectionEyebrow } from '../components'

export function LandingScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  return (
    <PageShell minimal>
      <div className="landing-nav"><Brand /><div><button className="text-button" onClick={() => dispatch({ type: 'PATCH', patch: { reducedMotion: !state.reducedMotion } })}>{state.reducedMotion ? 'เปิดภาพเคลื่อนไหว' : 'ลดการเคลื่อนไหว'}</button><Link className="button button--secondary" to="/demo/role/recruiter">สำหรับ Recruiter</Link></div></div>
      <section className="hero">
        <div className="hero__copy">
          <div className="live-pill"><span aria-hidden="true">●</span> LIVE NOW · {EVENT.timezone}</div>
          <h1>SKILLS FIRST.<br /><span>BIAS LAST.</span></h1>
          <p className="hero__lead">เดินเข้าเมืองงานแฟร์ ค้นพบงานจากทักษะ คุยกันโดยยังไม่เห็นตัวตน แล้วเปิดเผยข้อมูลเมื่อทั้งสองฝ่ายอยากไปต่อ</p>
          <div className="hero__actions"><PixelButton onClick={() => navigate('/demo/verify')}>เข้าสู่งาน Demo <span aria-hidden="true">→</span></PixelButton><PixelButton variant="secondary" onClick={() => document.getElementById('jobs')?.scrollIntoView()}>ดูตำแหน่งงาน</PixelButton></div>
          <div className="trust-row"><span>◇ Recruiter ไม่เห็นชื่อ</span><span>● กล้อง/ไมค์ปิดไว้</span><span>✓ เลือกข้อมูลที่จะเปิดเอง</span></div>
        </div>
        <div className="city-preview" aria-label="ภาพจำลอง Neon Career City">
          <div className="city-preview__sky"><span className="pixel-star pixel-star--1" /><span className="pixel-star pixel-star--2" /><span className="pixel-star pixel-star--3" /></div>
          <div className="pixel-building pixel-building--one"><span>TECH</span></div>
          <div className="pixel-building pixel-building--two"><span>CAREER<br />CITY</span></div>
          <div className="pixel-building pixel-building--three"><span>CREATE</span></div>
          <div className="pixel-road"><div className="pixel-avatar"><i /><b>#8F3A</b></div></div>
          <span className="preview-npc preview-npc--one">C</span><span className="preview-npc preview-npc--two">R</span><span className="preview-npc preview-npc--three">G</span>
          <div className="preview-live"><i /> 16 PEOPLE EXPLORING</div>
          <div className="preview-card"><span>งานแนะนำสำหรับคุณ</span><strong>Backend Developer</strong><small>Cyber Orchard Co.</small><b>92<span>/100</span></b></div>
        </div>
      </section>
      <section className="landing-section" id="jobs">
        <SectionEyebrow>HOW BLIND MODE WORKS</SectionEyebrow>
        <h2>เริ่มจากสิ่งที่คุณทำได้<br />ไม่ใช่สิ่งที่คุณเป็น</h2>
        <div className="steps-grid">
          <article><span className="step-no">01</span><div className="step-icon">▤</div><h3>สร้าง Masked Profile</h3><p>ระบบสกัดทักษะและซ่อนข้อมูลระบุตัวตน คุณตรวจและอนุมัติก่อนเสมอ</p></article>
          <article><span className="step-no">02</span><div className="step-icon">⌁</div><h3>ค้นพบงานจาก Evidence</h3><p>คำแนะนำอธิบายเหตุผลได้ และไม่ใช้ชื่อ รูป อายุ เพศ หรือสถาบันในการจัดอันดับ</p></article>
          <article><span className="step-no">03</span><div className="step-icon">◇</div><h3>เปิดเผยเมื่อ Match</h3><p>ทั้งสองฝ่ายตัดสินใจแบบส่วนตัว แล้วคุณเลือกเองว่าจะแชร์ข้อมูลช่องใด</p></article>
        </div>
        <div className="job-preview-row">
          {COMPANIES.slice(0, 3).map((company, i) => <article className="mini-job" key={company.id} style={{ '--accent': company.accent } as React.CSSProperties}><span>{company.district}</span><h3>{i === 0 ? JOB.title : i === 1 ? 'Platform Engineer' : 'Product Designer'}</h3><p>{company.name}</p><small>{company.jobs} ตำแหน่ง · รอ {company.queue}</small></article>)}
        </div>
      </section>
      <footer className="landing-footer"><Brand compact /><p>Functional hackathon prototype · Synthetic data only</p><Link to="/demo/control">Demo Controller</Link></footer>
    </PageShell>
  )
}

export function VerifyScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const [required, setRequired] = useState(state.requiredConsent)
  const [optionalCamera, setOptionalCamera] = useState(false)
  const [listFirst, setListFirst] = useState(state.listFirst)
  const [reduced, setReduced] = useState(state.reducedMotion)
  const [loading, setLoading] = useState(false)
  const submit = () => {
    if (!required) return
    setLoading(true)
    window.setTimeout(() => { dispatch({ type: 'VERIFY', reducedMotion: reduced, listFirst }); navigate('/candidate/profile/import') }, 450)
  }
  return (
    <PageShell>
      <div className="task-page"><Progress current={1} /><div className="task-card task-card--wide">
        <SectionEyebrow>STEP 01 · VERIFY & CONSENT</SectionEyebrow><h1>ยืนยันเพื่อเข้า Event</h1><p className="lead">การยืนยันช่วยป้องกันบัญชีปลอม แต่ recruiter จะยังเห็นคุณในชื่อ <strong>{CANDIDATE.alias}</strong> เท่านั้น</p>
        <div className="mock-id-card"><div className="mock-id-card__icon">ID</div><div><span>การยืนยันตัวตนจำลอง</span><strong>Mock ThaID Verification</strong><small>ไม่มีการส่งข้อมูลไปยัง DOPA หรือบริการภายนอก</small></div><span className="badge badge--mango">DEMO ONLY</span></div>
        <fieldset><legend>ความยินยอม</legend><label className="check-card"><input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} /><span><strong>เข้าร่วม Event และประมวลผลโปรไฟล์จำลอง <em>จำเป็น</em></strong><small>ใช้เพื่อสร้าง alias, Masked Profile และจับคู่งานใน demo นี้</small></span></label><label className="check-card"><input type="checkbox" checked={optionalCamera} onChange={(e) => setOptionalCamera(e.target.checked)} /><span><strong>ทดลองกล้องใน preflight <em>ไม่บังคับ</em></strong><small>คุณใช้ Avatar-only, เสียง หรือข้อความแทนได้ทุกเมื่อ</small></span></label></fieldset>
        <fieldset><legend>การเข้าถึง</legend><div className="check-grid"><label><input type="checkbox" checked={listFirst} onChange={(e) => setListFirst(e.target.checked)} /> เริ่มด้วยโหมดรายการ</label><label><input type="checkbox" checked={reduced} onChange={(e) => setReduced(e.target.checked)} /> ลดการเคลื่อนไหว</label></div></fieldset>
        {!required && <p className="form-error" id="consent-error">กรุณายอมรับเงื่อนไขที่จำเป็นเพื่อเข้าสู่ demo</p>}
        <PixelButton className="button--full" disabled={!required} loading={loading} onClick={submit}>ยืนยันแบบจำลองและดำเนินการต่อ</PixelButton>
      </div></div>
    </PageShell>
  )
}

export function ImportScreen() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  const [processing, setProcessing] = useState(false)
  const useSample = () => {
    setProcessing(true)
    window.setTimeout(() => { dispatch({ type: 'IMPORT_PROFILE' }); navigate('/candidate/profile/review') }, 650)
  }
  return (
    <PageShell><div className="task-page"><Progress current={2} /><div className="task-card task-card--wide"><SectionEyebrow>STEP 02 · BUILD YOUR PROFILE</SectionEyebrow><h1>บอกเราว่าคุณทำอะไรได้</h1><p className="lead">สำหรับ prototype นี้ เราแนะนำ Resume ตัวอย่าง เพื่อไม่ให้ข้อมูลจริงถูกเก็บใน browser</p>
      <div className="option-grid"><button className="option-card option-card--recommended" onClick={useSample} disabled={processing}><span className="option-card__tag">แนะนำสำหรับ DEMO</span><div className="option-card__icon">▤</div><h2>ใช้ Resume ตัวอย่าง</h2><p>Node.js · MQTT · Redis · Queue Systems</p><b>{processing ? 'กำลังสแกนและปิดบังข้อมูล…' : 'ใช้ข้อมูลสังเคราะห์ →'}</b></button><button className="option-card" onClick={useSample}><div className="option-card__icon">✎</div><h2>กรอกทักษะเอง</h2><p>เพิ่มทักษะและหลักฐาน โดยไม่ต้องแนบไฟล์</p><b>เปิดแบบฟอร์ม →</b></button></div>
      <div className="privacy-note"><span>◇</span><p><strong>ข้อมูลยังไม่ถูกแชร์</strong><br />Recruiter จะเห็นเฉพาะโปรไฟล์ที่ซ่อนข้อมูลแล้วและคุณกดยืนยันในขั้นถัดไป</p></div>
    </div></div></PageShell>
  )
}

export function ReviewScreen() {
  const { dispatch } = useDemo()
  const navigate = useNavigate()
  return (
    <PageShell><div className="task-page task-page--wide"><Progress current={2} /><SectionEyebrow>MASKED PROFILE REVIEW</SectionEyebrow><div className="review-heading"><div><h1>ตรวจดูก่อนเผยแพร่</h1><p>คุณเป็นคนตัดสินใจว่าข้อมูลนี้ถูกต้องและปลอดภัยพอหรือยัง</p></div><div className="visibility-total"><b>4</b><span>ข้อมูลที่ซ่อน</span></div></div>
      <div className="compare-grid"><article className="profile-panel profile-panel--original"><header><span>ต้นฉบับจำลอง</span><small>เห็นเฉพาะคุณ</small></header><div className="profile-identity"><div className="identity-photo">?</div><div><h2>Candidate Demo</h2><p className="redacted">candidate@example.test</p><p className="redacted">University X</p></div></div><hr /><h3>ประสบการณ์</h3><p>Backend Engineer ที่ <mark>Exact Employer Co.</mark></p><p>{CANDIDATE.evidence}</p><h3>ทักษะ</h3><div className="skill-row">{CANDIDATE.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>
      <div className="transform-arrow" aria-hidden="true">→<small>ซ่อนข้อมูล</small></div>
      <article className="profile-panel profile-panel--masked"><header><span>Recruiter จะเห็น</span><small>Blind Mode active</small></header><div className="profile-identity"><div className="fox-face">◇</div><div><h2>{CANDIDATE.alias}</h2><p>Contact hidden</p><p>Institution hidden</p></div></div><hr /><h3>ประสบการณ์</h3><p>Backend Engineer · <span className="hidden-chip">ซ่อนชื่อนายจ้าง</span></p><p>{CANDIDATE.evidence}</p><h3>ทักษะที่ยืนยันแล้ว</h3><div className="skill-row skill-row--active">{CANDIDATE.skills.map((skill) => <span key={skill}>✓ {skill}</span>)}</div><p className="confidence"><span>!</span><b>Confidence: สูง</b> กฎจำลองตรวจพบชื่อ อีเมล สถาบัน และนายจ้าง</p></article></div>
      <div className="sticky-actions"><div><strong>◇ Identity stays masked</strong><span>แก้ไขได้ก่อนเผยแพร่</span></div><PixelButton variant="secondary">แก้ไขโปรไฟล์</PixelButton><PixelButton onClick={() => { dispatch({ type: 'APPROVE_PROFILE' }); navigate('/candidate/avatar') }}>ยืนยัน Masked Profile</PixelButton></div>
    </div></PageShell>
  )
}

export function AvatarScreen() {
  const { state, dispatch } = useDemo()
  const navigate = useNavigate()
  const avatars = [{ id: 'fox', face: '◇', name: 'จิ้งจอก' }, { id: 'rabbit', face: '♢', name: 'กระต่าย' }, { id: 'bear', face: '▣', name: 'หมี' }, { id: 'dog', face: '◆', name: 'สุนัข' }] as const
  return (
    <PageShell><div className="task-page"><Progress current={3} /><div className="task-card task-card--wide"><SectionEyebrow>STEP 03 · YOUR AVATAR</SectionEyebrow><h1>เลือกตัวแทนใน Career City</h1><p className="lead">อวตารเป็นเพียงภาพแทน ไม่ได้สื่อบุคลิก เพศ หรือคุณสมบัติการทำงานของคุณ</p><div className="avatar-picker"><div className={`avatar-stage avatar-stage--${state.avatar}`}><div className="avatar-big">◇</div><span>{CANDIDATE.alias}</span></div><div className="avatar-options">{avatars.map((avatar) => <button key={avatar.id} className={state.avatar === avatar.id ? 'is-selected' : ''} onClick={() => dispatch({ type: 'SET_AVATAR', avatar: avatar.id })}><span>{avatar.face}</span>{avatar.name}<small>{state.avatar === avatar.id ? 'เลือกแล้ว' : 'เลือก'}</small></button>)}</div></div><div className="tutorial-row"><span><b>WASD / ลูกศร</b> เดินบน desktop</span><span><b>แตะจุดหมาย</b> บนมือถือ</span><span><b>Navigator</b> ใช้งานแทนแผนที่ได้ครบ</span></div><div className="button-row button-row--end"><Link className="text-button" to="/event/demo/navigator">ใช้โหมดรายการ</Link><PixelButton onClick={() => navigate(state.listFirst ? '/event/demo/navigator' : '/event/demo/world')}>พร้อมเข้า Career City →</PixelButton></div></div></div></PageShell>
  )
}
