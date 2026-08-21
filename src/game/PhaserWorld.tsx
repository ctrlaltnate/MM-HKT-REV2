import { useEffect, useRef } from 'react'
import Phaser from 'phaser'

const boothData = [
  { id: 'cyber-orchard', x: 162, y: 160, color: 0x37e7ff, label: 'CYBER\nORCHARD' },
  { id: 'cloud-lantern', x: 162, y: 350, color: 0x8b5cf6, label: 'CLOUD\nLANTERN' },
  { id: 'riverbyte', x: 638, y: 160, color: 0x4aa8ff, label: 'RIVERBYTE' },
  { id: 'pixel-loom', x: 638, y: 350, color: 0xff4fd8, label: 'PIXEL LOOM' },
]

class CareerCityScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private target = new Phaser.Math.Vector2(400, 470)
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private reducedMotion: boolean
  private onSelect: (boothId: string) => void

  constructor(reducedMotion: boolean, onSelect: (boothId: string) => void) {
    super('career-city')
    this.reducedMotion = reducedMotion
    this.onSelect = onSelect
  }

  create() {
    const g = this.add.graphics()
    g.fillStyle(0x0d1025).fillRect(0, 0, 800, 540)
    g.lineStyle(1, 0x262047, 0.7)
    for (let x = 0; x <= 800; x += 32) g.lineBetween(x, 0, x, 540)
    for (let y = 0; y <= 540; y += 32) g.lineBetween(0, y, 800, y)

    g.fillStyle(0x17162e).fillRect(0, 225, 800, 92)
    g.fillStyle(0x17162e).fillRect(350, 0, 100, 540)
    g.lineStyle(4, 0x37e7ff, 0.22).strokeRect(8, 232, 784, 76)
    g.lineStyle(3, 0xffd84d, 0.25).lineBetween(400, 0, 400, 540)

    this.add.text(28, 26, 'TECH DISTRICT', { color: '#37e7ff', fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold' })
    this.add.text(620, 26, 'CREATIVE ROW', { color: '#ff4fd8', fontFamily: 'monospace', fontSize: '15px', fontStyle: 'bold' })
    this.add.text(326, 255, 'CENTRAL WALK', { color: '#bbb6d5', fontFamily: 'monospace', fontSize: '13px' })
    this.add.text(340, 504, 'ENTRY PLAZA', { color: '#ffd84d', fontFamily: 'monospace', fontSize: '13px' })

    for (const booth of boothData) this.createBooth(booth)
    this.createSupport(400, 82)
    this.player = this.createPlayer(400, 466)

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.target.set(pointer.worldX, pointer.worldY)
    })

    this.cameras.main.setBounds(0, 0, 800, 540)
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => this.input.removeAllListeners())
  }

  private createBooth(booth: (typeof boothData)[number]) {
    const card = this.add.container(booth.x, booth.y)
    const glow = this.add.rectangle(0, 0, 178, 106, booth.color, 0.12).setStrokeStyle(3, booth.color, 0.85)
    const roof = this.add.rectangle(0, -38, 158, 22, booth.color, 0.85)
    const desk = this.add.rectangle(0, 34, 136, 20, 0x262047).setStrokeStyle(2, booth.color)
    const sign = this.add.text(0, -12, booth.label, {
      color: '#f8f7ff', fontFamily: 'monospace', fontSize: '13px', align: 'center', fontStyle: 'bold', lineSpacing: 2,
    }).setOrigin(0.5)
    const marker = this.add.circle(0, 72, 7, 0xffd84d).setStrokeStyle(2, 0x070816)
    card.add([glow, roof, desk, sign, marker]).setSize(178, 130).setInteractive({ useHandCursor: true })
    card.on('pointerdown', () => this.onSelect(booth.id))
    card.on('pointerover', () => glow.setFillStyle(booth.color, 0.25))
    card.on('pointerout', () => glow.setFillStyle(booth.color, 0.12))

    if (!this.reducedMotion) {
      this.tweens.add({ targets: marker, alpha: 0.25, yoyo: true, repeat: -1, duration: 700 })
    }
  }

  private createSupport(x: number, y: number) {
    const support = this.add.container(x, y)
    const base = this.add.rectangle(0, 0, 120, 56, 0x17162e).setStrokeStyle(3, 0x4ade80)
    const crossV = this.add.rectangle(0, 0, 10, 30, 0x4ade80)
    const crossH = this.add.rectangle(0, 0, 30, 10, 0x4ade80)
    const label = this.add.text(0, 42, 'SUPPORT', { color: '#4ade80', fontFamily: 'monospace', fontSize: '12px' }).setOrigin(0.5)
    support.add([base, crossV, crossH, label])
  }

  private createPlayer(x: number, y: number) {
    const shadow = this.add.ellipse(0, 15, 32, 12, 0x000000, 0.4)
    const body = this.add.rectangle(0, 0, 26, 30, 0xff8c63).setStrokeStyle(3, 0x070816)
    const ear1 = this.add.triangle(-10, -21, 0, 14, 8, 0, 14, 14, 0xff8c63).setStrokeStyle(2, 0x070816)
    const ear2 = this.add.triangle(10, -21, 0, 14, 8, 0, 14, 14, 0xff8c63).setStrokeStyle(2, 0x070816)
    const face = this.add.rectangle(0, -3, 15, 10, 0xffd8ae)
    const badge = this.add.text(0, 30, '#8F3A', { color: '#f8f7ff', backgroundColor: '#070816', fontFamily: 'monospace', fontSize: '11px', padding: { x: 4, y: 2 } }).setOrigin(0.5)
    return this.add.container(x, y, [shadow, body, ear1, ear2, face, badge])
  }

  update(_time: number, delta: number) {
    const active = document.activeElement?.tagName
    const editing = active === 'INPUT' || active === 'TEXTAREA' || active === 'SELECT'
    let dx = 0
    let dy = 0
    if (!editing) {
      if (this.cursors.left.isDown || this.keys.A.isDown) dx -= 1
      if (this.cursors.right.isDown || this.keys.D.isDown) dx += 1
      if (this.cursors.up.isDown || this.keys.W.isDown) dy -= 1
      if (this.cursors.down.isDown || this.keys.S.isDown) dy += 1
    }
    const speed = 0.18 * delta
    if (dx || dy) {
      const length = Math.hypot(dx, dy)
      this.player.x += (dx / length) * speed
      this.player.y += (dy / length) * speed
      this.target.set(this.player.x, this.player.y)
    } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y) > 5) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.target.x, this.target.y)
      this.player.x += Math.cos(angle) * speed
      this.player.y += Math.sin(angle) * speed
    }
    this.player.x = Phaser.Math.Clamp(this.player.x, 26, 774)
    this.player.y = Phaser.Math.Clamp(this.player.y, 42, 502)
  }
}

export function PhaserWorld({ reducedMotion, onSelectBooth }: { reducedMotion: boolean; onSelectBooth: (id: string) => void }) {
  const host = useRef<HTMLDivElement>(null)
  const callback = useRef(onSelectBooth)
  callback.current = onSelectBooth

  useEffect(() => {
    if (!host.current) return
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      width: 800,
      height: 540,
      transparent: true,
      render: { antialias: false, pixelArt: true },
      scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: new CareerCityScene(reducedMotion, (id) => callback.current(id)),
      input: { keyboard: true, mouse: true, touch: true },
    })
    return () => game.destroy(true)
  }, [reducedMotion])

  return <div ref={host} className="phaser-world" aria-hidden="true" />
}
