import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import Phaser from 'phaser'

const WORLD_WIDTH = 1536
const WORLD_HEIGHT = 1024
const ATLAS_CELL_SIZE = 320
const NPC_SCALE = 94 / ATLAS_CELL_SIZE
const PLAYER_SCALE = 104 / ATLAS_CELL_SIZE

const boothData = [
  { id: 'cyber-orchard', name: 'Cyber Orchard', monogram: 'CO', x: 356, y: 330, entryX: 355, entryY: 470, color: 0x37e7ff },
  { id: 'cloud-lantern', name: 'Cloud Lantern', monogram: 'CL', x: 1150, y: 325, entryX: 1145, entryY: 468, color: 0xff4fd8 },
  { id: 'riverbyte', name: 'Riverbyte', monogram: 'RB', x: 355, y: 615, entryX: 355, entryY: 750, color: 0x8cff6a },
  { id: 'pixel-loom', name: 'Pixel Loom', monogram: 'PL', x: 1140, y: 615, entryX: 1140, entryY: 755, color: 0xffc947 },
]

const npcData = [
  { frame: 1, x: 660, y: 270, role: 'Candidate', line: 'กำลังดูงานที่แนะนำอยู่' },
  { frame: 2, x: 770, y: 350, role: 'Candidate', line: 'Navigator ช่วยให้หาบูธเร็วมาก' },
  { frame: 3, x: 860, y: 270, role: 'Candidate', line: 'รอสัมภาษณ์อีกประมาณ 6 นาที' },
  { frame: 4, x: 515, y: 420, role: 'Recruiter', line: 'ยินดีต้อนรับ ลองเปิดรายละเอียดบูธได้เลย' },
  { frame: 5, x: 1010, y: 425, role: 'Recruiter', line: 'วันนี้เราคุยกันด้วย skill evidence' },
  { frame: 6, x: 610, y: 610, role: 'Recruiter', line: 'Masked Profile ของคุณพร้อมแล้ว' },
  { frame: 7, x: 910, y: 620, role: 'Recruiter', line: 'แตะบูธเพื่อดูตำแหน่งงานได้เลย' },
  { frame: 8, x: 740, y: 520, role: 'Hall Guide', line: 'สี่บูธหลักอยู่รอบ Central Hub' },
  { frame: 9, x: 1300, y: 850, role: 'Accessibility', line: 'ต้องการ text-assisted interview แจ้งได้เสมอ' },
  { frame: 10, x: 820, y: 790, role: 'Event Staff', line: 'Ready Check จะไม่พาเข้าห้องอัตโนมัติ' },
  { frame: 11, x: 670, y: 825, role: 'Wayfinder', line: 'BEEP · เปิด Navigator ได้จากมุมซ้าย' },
  { frame: 0, x: 255, y: 530, role: 'Candidate', line: 'บูธสีเขียวเน้น portfolio' },
  { frame: 2, x: 1260, y: 525, role: 'Candidate', line: 'กำลังเตรียมคำถามสำหรับ recruiter' },
  { frame: 3, x: 495, y: 785, role: 'Candidate', line: 'Quiet Lounge อยู่มุมซ้ายล่าง' },
  { frame: 1, x: 1035, y: 835, role: 'Candidate', line: 'Device Test อยู่ใกล้ Support Desk' },
  { frame: 7, x: 705, y: 920, role: 'Event Staff', line: 'ทางเข้างานอยู่ด้านล่างของฮอลล์' },
]

class CareerHallScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Container
  private playerSprite!: Phaser.GameObjects.Sprite
  private target = new Phaser.Math.Vector2(768, 650)
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keys!: Record<'W' | 'A' | 'S' | 'D', Phaser.Input.Keyboard.Key>
  private interactKey!: Phaser.Input.Keyboard.Key
  private reducedMotion: boolean
  private onSelect: (boothId: string) => void
  private npcs: Phaser.GameObjects.Sprite[] = []
  private proximityLabel!: Phaser.GameObjects.Container
  private speechBubble?: Phaser.GameObjects.Container
  private targetMarker?: Phaser.GameObjects.Container
  private onReady: () => void
  private onPosition: (x: number, y: number, moving: boolean) => void
  private lastPositionReport = 0

  constructor(reducedMotion: boolean, onSelect: (boothId: string) => void, onReady: () => void, onPosition: (x: number, y: number, moving: boolean) => void) {
    super('career-hall')
    this.reducedMotion = reducedMotion
    this.onSelect = onSelect
    this.onReady = onReady
    this.onPosition = onPosition
  }

  preload() {
    this.load.image('career-hall', '/assets/world/neon-career-hall-v3.png')
    this.load.spritesheet('hall-atlas', '/assets/world/career-hall-atlas-v3.png', { frameWidth: 320, frameHeight: 320 })
  }

  create() {
    this.add.image(0, 0, 'career-hall').setOrigin(0).setDepth(0)
    this.createAmbientLighting()
    boothData.forEach((booth) => this.createBoothZone(booth))
    this.createProps()
    this.createCrowd()
    this.player = this.createPlayer(768, 650)
    this.createProximityLabel()

    this.cursors = this.input.keyboard!.createCursorKeys()
    this.keys = this.input.keyboard!.addKeys('W,A,S,D') as typeof this.keys
    this.interactKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.input.keyboard!.addCapture([
      Phaser.Input.Keyboard.KeyCodes.UP,
      Phaser.Input.Keyboard.KeyCodes.DOWN,
      Phaser.Input.Keyboard.KeyCodes.LEFT,
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
      Phaser.Input.Keyboard.KeyCodes.W,
      Phaser.Input.Keyboard.KeyCodes.A,
      Phaser.Input.Keyboard.KeyCodes.S,
      Phaser.Input.Keyboard.KeyCodes.D,
      Phaser.Input.Keyboard.KeyCodes.E,
    ])
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, objects: Phaser.GameObjects.GameObject[]) => {
      if (objects.length === 0) this.walkTo(pointer.worldX, pointer.worldY)
    })

    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT)
    this.cameras.main.startFollow(this.player, true, 0.075, 0.075)
    this.updateCameraZoom(this.scale.width)
    this.scale.on(Phaser.Scale.Events.RESIZE, (size: Phaser.Structs.Size) => this.updateCameraZoom(size.width))
    this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.input.removeAllListeners()
      this.scale.off(Phaser.Scale.Events.RESIZE)
    })
    this.onReady()
  }

  public nudge(dx: number, dy: number) {
    if (!this.player) return
    this.walkTo(this.player.x + dx * 118, this.player.y + dy * 118)
  }

  public zoomBy(amount: number) {
    const camera = this.cameras.main
    camera.setZoom(Phaser.Math.Clamp(camera.zoom + amount, 0.72, 1.45))
  }

  public recenter() {
    if (!this.player) return
    this.walkTo(768, 650)
  }

  private walkTo(x: number, y: number) {
    this.target.set(
      Phaser.Math.Clamp(x, 75, WORLD_WIDTH - 75),
      Phaser.Math.Clamp(y, 120, WORLD_HEIGHT - 70),
    )
    this.showTargetMarker(this.target.x, this.target.y)
  }

  private showTargetMarker(x: number, y: number) {
    this.targetMarker?.destroy(true)
    const ring = this.add.circle(0, 0, 18, 0x37e7ff, 0.08).setStrokeStyle(3, 0x37e7ff, 0.95)
    const dot = this.add.circle(0, 0, 4, 0xffd84d, 1)
    this.targetMarker = this.add.container(x, y, [ring, dot]).setDepth(y + 10)
    if (this.reducedMotion) return
    this.tweens.add({ targets: ring, scale: { from: 0.55, to: 1.35 }, alpha: { from: 1, to: 0.15 }, duration: 620, repeat: -1, ease: 'Sine.Out' })
  }

  private updateCameraZoom(width: number) {
    this.cameras.main.setZoom(width < 520 ? 0.82 : width < 900 ? 0.9 : 1.02)
  }

  private createAmbientLighting() {
    const glowPoints = [
      [340, 234, 0x37e7ff], [1170, 238, 0xff4fd8], [340, 520, 0x8cff6a], [1170, 520, 0xffc947],
      [767, 725, 0x8b5cf6], [688, 460, 0x37e7ff], [850, 460, 0xff4fd8],
    ] as const
    glowPoints.forEach(([x, y, color], index) => {
      const glow = this.add.circle(x, y, 22, color, 0.11).setBlendMode(Phaser.BlendModes.ADD).setDepth(2)
      if (!this.reducedMotion) this.tweens.add({ targets: glow, alpha: { from: 0.05, to: 0.22 }, scale: { from: 0.75, to: 1.45 }, yoyo: true, repeat: -1, duration: 1200 + index * 110, ease: 'Sine.InOut' })
    })

    const hubRing = this.add.circle(768, 525, 54, 0x8b5cf6, 0.04).setStrokeStyle(3, 0x8b5cf6, 0.55).setDepth(3)
    if (!this.reducedMotion) this.tweens.add({ targets: hubRing, angle: 360, scale: { from: 0.88, to: 1.12 }, alpha: { from: 0.25, to: 0.7 }, duration: 3200, repeat: -1, yoyo: true })
  }

  private createBoothZone(booth: (typeof boothData)[number]) {
    const logoPlate = this.add.container(booth.x, booth.y - 64).setDepth(5)
    const plate = this.add.rectangle(0, 0, 112, 48, 0x090a18, 0.92).setStrokeStyle(3, booth.color, 0.95)
    const monogram = this.add.text(0, -2, booth.monogram, { color: '#f8f7ff', fontFamily: 'monospace', fontSize: '20px', fontStyle: 'bold' }).setOrigin(0.5)
    logoPlate.add([plate, monogram])

    const zone = this.add.zone(booth.x, booth.y, 410, 270).setRectangleDropZone(410, 270).setInteractive({ useHandCursor: true }).setDepth(10)
    const marker = this.add.container(booth.entryX, booth.entryY).setDepth(60)
    const markerGlow = this.add.circle(0, 0, 18, booth.color, 0.2).setStrokeStyle(2, booth.color, 0.9)
    const markerIcon = this.add.text(0, 0, '!', { color: '#070816', backgroundColor: Phaser.Display.Color.IntegerToColor(booth.color).rgba, fontFamily: 'monospace', fontSize: '14px', fontStyle: 'bold', padding: { x: 5, y: 2 } }).setOrigin(0.5)
    marker.add([markerGlow, markerIcon])
    if (!this.reducedMotion) {
      this.tweens.add({ targets: marker, y: booth.entryY - 8, yoyo: true, repeat: -1, duration: 750, ease: 'Sine.InOut' })
      this.tweens.add({ targets: logoPlate, alpha: { from: 0.78, to: 1 }, yoyo: true, repeat: -1, duration: 1350 })
    }

    zone.on('pointerover', () => {
      plate.setStrokeStyle(5, booth.color, 1)
      markerGlow.setScale(1.3).setAlpha(0.42)
      this.showSpeech(booth.x, booth.y - 125, booth.name, 'แตะเพื่อเปิดบูธ')
    })
    zone.on('pointerout', () => {
      plate.setStrokeStyle(3, booth.color, 0.95)
      markerGlow.setScale(1).setAlpha(1)
    })
    zone.on('pointerdown', () => this.onSelect(booth.id))
  }

  private createProps() {
    const props = [
      { frame: 12, x: 610, y: 470, size: 82 }, { frame: 12, x: 920, y: 470, size: 82 },
      { frame: 13, x: 650, y: 545, size: 70 }, { frame: 13, x: 885, y: 545, size: 70 },
      { frame: 14, x: 210, y: 830, size: 100 }, { frame: 15, x: 1320, y: 420, size: 86 },
      { frame: 15, x: 720, y: 380, size: 72 }, { frame: 15, x: 815, y: 380, size: 72 },
    ]
    props.forEach((prop, index) => {
      const sprite = this.add.sprite(prop.x, prop.y, 'hall-atlas', prop.frame).setDisplaySize(prop.size, prop.size).setDepth(prop.y)
      if (!this.reducedMotion && (prop.frame === 13 || prop.frame === 15)) this.tweens.add({ targets: sprite, alpha: { from: 0.72, to: 1 }, yoyo: true, repeat: -1, duration: 950 + index * 70 })
    })
  }

  private createCrowd() {
    npcData.forEach((npc, index) => {
      const shadow = this.add.ellipse(npc.x, npc.y + 30, 42, 15, 0x000000, 0.28).setDepth(npc.y - 1)
      const sprite = this.add.sprite(npc.x, npc.y, 'hall-atlas', npc.frame).setDisplaySize(94, 94).setDepth(npc.y).setInteractive({ useHandCursor: true })
      sprite.setData('shadow', shadow)
      this.npcs.push(sprite)

      sprite.on('pointerover', () => {
        sprite.setTint(0xd8fbff).setScale(NPC_SCALE * 1.08)
        this.showSpeech(sprite.x, sprite.y - 66, npc.role, npc.line)
      })
      sprite.on('pointerout', () => sprite.clearTint().setScale(NPC_SCALE))
      sprite.on('pointerdown', () => this.showSpeech(sprite.x, sprite.y - 66, npc.role, npc.line, true))

      if (!this.reducedMotion) {
        const horizontal = index % 2 === 0
        const travel = horizontal
          ? { x: npc.x + (index % 4 < 2 ? 48 : -48) }
          : { y: npc.y + (index % 3 === 0 ? 42 : -42) }
        this.tweens.add({
          targets: [sprite, shadow],
          ...travel,
          yoyo: true,
          repeat: -1,
          duration: 1800 + (index % 5) * 260,
          delay: index * 90,
          ease: 'Sine.InOut',
        })
        this.tweens.add({ targets: sprite, angle: { from: -1.2, to: 1.2 }, yoyo: true, repeat: -1, duration: 420 + (index % 3) * 80 })
      }
    })
  }

  private createPlayer(x: number, y: number) {
    const outerRing = this.add.circle(0, 25, 43, 0x37e7ff, 0.07).setStrokeStyle(3, 0x37e7ff, 0.95)
    const shadow = this.add.ellipse(0, 30, 48, 16, 0x000000, 0.42)
    this.playerSprite = this.add.sprite(0, 0, 'hall-atlas', 0).setDisplaySize(104, 104)
    const pointer = this.add.text(0, -63, '▼ YOU', { color: '#070816', backgroundColor: '#ffd84d', fontFamily: 'monospace', fontSize: '11px', fontStyle: 'bold', padding: { x: 7, y: 4 } }).setOrigin(0.5)
    const badge = this.add.text(0, 51, 'CANDIDATE #8F3A', { color: '#f8f7ff', backgroundColor: '#090a18', fontFamily: 'monospace', fontSize: '9px', fontStyle: 'bold', padding: { x: 6, y: 3 } }).setOrigin(0.5)
    if (!this.reducedMotion) {
      this.tweens.add({ targets: outerRing, scale: { from: 0.88, to: 1.12 }, alpha: { from: 0.45, to: 1 }, yoyo: true, repeat: -1, duration: 720, ease: 'Sine.InOut' })
      this.tweens.add({ targets: pointer, y: -70, yoyo: true, repeat: -1, duration: 520, ease: 'Sine.InOut' })
    }
    return this.add.container(x, y, [outerRing, shadow, this.playerSprite, pointer, badge]).setDepth(9999)
  }

  private createProximityLabel() {
    const bg = this.add.rectangle(0, 0, 250, 42, 0x070816, 0.94).setStrokeStyle(2, 0x37e7ff)
    const text = this.add.text(0, 0, 'E · เปิดบูธ', { color: '#f8f7ff', fontFamily: 'sans-serif', fontSize: '14px', fontStyle: 'bold' }).setOrigin(0.5)
    this.proximityLabel = this.add.container(0, 0, [bg, text]).setDepth(10000).setVisible(false)
  }

  private showSpeech(x: number, y: number, title: string, body: string, sticky = false) {
    this.speechBubble?.destroy(true)
    const width = 260
    const bg = this.add.rectangle(0, 0, width, 68, 0x0b0c1c, 0.96).setStrokeStyle(2, 0x37e7ff)
    const titleText = this.add.text(-width / 2 + 13, -22, title.toUpperCase(), { color: '#37e7ff', fontFamily: 'monospace', fontSize: '10px', fontStyle: 'bold' })
    const bodyText = this.add.text(-width / 2 + 13, -3, body, { color: '#f8f7ff', fontFamily: 'sans-serif', fontSize: '12px', wordWrap: { width: width - 26 } })
    this.speechBubble = this.add.container(x, y, [bg, titleText, bodyText]).setDepth(12000).setAlpha(0)
    this.tweens.add({ targets: this.speechBubble, alpha: 1, y: y - 6, duration: this.reducedMotion ? 1 : 130 })
    if (!sticky) this.time.delayedCall(1800, () => this.speechBubble?.destroy(true))
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
    const speed = 0.24 * delta
    let moving = false
    if (dx || dy) {
      const length = Math.hypot(dx, dy)
      this.player.x += (dx / length) * speed
      this.player.y += (dy / length) * speed
      this.target.set(this.player.x, this.player.y)
      this.playerSprite.setFlipX(dx < 0)
      moving = true
    } else if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y) > 6) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.target.x, this.target.y)
      this.player.x += Math.cos(angle) * speed
      this.player.y += Math.sin(angle) * speed
      this.playerSprite.setFlipX(Math.cos(angle) < 0)
      moving = true
    }
    this.player.x = Phaser.Math.Clamp(this.player.x, 75, WORLD_WIDTH - 75)
    this.player.y = Phaser.Math.Clamp(this.player.y, 120, WORLD_HEIGHT - 70)
    this.player.setDepth(this.player.y + 2000)
    this.playerSprite.setAngle(moving && !this.reducedMotion ? Math.sin(this.time.now / 70) * 4 : 0)
    this.playerSprite.setY(moving && !this.reducedMotion ? Math.abs(Math.sin(this.time.now / 95)) * -7 : 0)
    const strideScale = moving && !this.reducedMotion ? 1 + Math.sin(this.time.now / 95) * 0.035 : 1
    this.playerSprite.setScale(PLAYER_SCALE * strideScale)
    if (!moving && Phaser.Math.Distance.Between(this.player.x, this.player.y, this.target.x, this.target.y) <= 6) {
      this.targetMarker?.destroy(true)
      this.targetMarker = undefined
    }
    if (this.time.now - this.lastPositionReport > 100) {
      this.lastPositionReport = this.time.now
      this.onPosition(this.player.x, this.player.y, moving)
    }

    this.npcs.forEach((npc) => {
      npc.setDepth(npc.y)
      const shadow = npc.getData('shadow') as Phaser.GameObjects.Ellipse
      shadow.setPosition(npc.x, npc.y + 30).setDepth(npc.y - 1)
    })

    const nearest = boothData
      .map((booth) => ({ booth, distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, booth.entryX, booth.entryY) }))
      .sort((a, b) => a.distance - b.distance)[0]
    if (nearest.distance < 125) {
      this.proximityLabel.setVisible(true).setPosition(this.player.x, this.player.y - 80)
      const text = this.proximityLabel.list[1] as Phaser.GameObjects.Text
      text.setText(`E · เปิด ${nearest.booth.name}`)
      if (Phaser.Input.Keyboard.JustDown(this.interactKey)) this.onSelect(nearest.booth.id)
    } else {
      this.proximityLabel.setVisible(false)
    }
  }
}

export type PhaserWorldHandle = {
  nudge: (dx: number, dy: number) => void
  zoomIn: () => void
  zoomOut: () => void
  recenter: () => void
}

export const PhaserWorld = forwardRef<PhaserWorldHandle, { reducedMotion: boolean; onSelectBooth: (id: string) => void; onReady?: () => void }>(function PhaserWorld({ reducedMotion, onSelectBooth, onReady }, ref) {
  const host = useRef<HTMLDivElement>(null)
  const callback = useRef(onSelectBooth)
  const readyCallback = useRef(onReady)
  const scene = useRef<CareerHallScene | null>(null)
  callback.current = onSelectBooth
  readyCallback.current = onReady

  useImperativeHandle(ref, () => ({
    nudge: (dx, dy) => scene.current?.nudge(dx, dy),
    zoomIn: () => scene.current?.zoomBy(0.1),
    zoomOut: () => scene.current?.zoomBy(-0.1),
    recenter: () => scene.current?.recenter(),
  }), [])

  useEffect(() => {
    if (!host.current) return
    const hallScene = new CareerHallScene(
      reducedMotion,
      (id) => callback.current(id),
      () => {
        if (host.current) host.current.dataset.phaserReady = 'true'
        readyCallback.current?.()
      },
      (x, y, moving) => {
        if (!host.current) return
        host.current.dataset.playerX = x.toFixed(1)
        host.current.dataset.playerY = y.toFixed(1)
        host.current.dataset.playerMoving = String(moving)
      },
    )
    scene.current = hallScene
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: host.current,
      width: host.current.clientWidth || 960,
      height: host.current.clientHeight || 640,
      backgroundColor: '#090a18',
      render: { antialias: false, pixelArt: true, roundPixels: true },
      scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: hallScene,
      input: { keyboard: true, mouse: true, touch: true },
    })
    return () => {
      scene.current = null
      game.destroy(true)
    }
  }, [reducedMotion])

  return <div ref={host} className="phaser-world" aria-label="พื้นที่ Phaser แบบโต้ตอบ กด WASD ลูกศร หรือแตะพื้นเพื่อเดิน" role="application" tabIndex={0} onPointerDown={() => host.current?.focus()} />
})
