export const EVENT = {
  id: 'event-neon-career-city',
  name: 'Neon Career City',
  timezone: 'Asia/Bangkok',
  status: 'LIVE',
}

export const CANDIDATE = {
  alias: 'Candidate #8F3A',
  email: 'candidate@example.test',
  phone: '+66 80 000 0000 (demo)',
  portfolio: 'portfolio.example.test/8f3a',
  skills: ['Node.js', 'MQTT', 'Redis', 'Queue Systems'],
  evidence: 'สร้าง IoT telemetry pipeline รองรับข้อมูลจำลอง 2M events/day',
}

export const COMPANIES = [
  { id: 'cyber-orchard', name: 'Cyber Orchard Co.', district: 'TECH DISTRICT', accent: '#37E7FF', queue: '8–12 นาที', jobs: 2 },
  { id: 'cloud-lantern', name: 'Cloud Lantern Labs', district: 'TECH DISTRICT', accent: '#8B5CF6', queue: '4–7 นาที', jobs: 3 },
  { id: 'riverbyte', name: 'Riverbyte Studio', district: 'CREATIVE ROW', accent: '#4AA8FF', queue: '12–16 นาที', jobs: 2 },
  { id: 'pixel-loom', name: 'Pixel Loom Works', district: 'CREATIVE ROW', accent: '#FF4FD8', queue: 'เปิดสำรวจ', jobs: 1 },
]

export const JOB = {
  id: 'job-backend-01',
  title: 'Backend Developer',
  company: COMPANIES[0],
  mode: 'Hybrid · Bangkok / Remote',
  salary: 'ช่วงเงินเดือนจำลอง 45,000–70,000 บาท',
  score: 92,
  mustHave: ['Node.js', 'REST APIs', 'Queue systems'],
  niceToHave: ['Redis', 'MQTT', 'Observability'],
  reasons: [
    'Node.js ตรงกับ must-have',
    'มีหลักฐาน Queue Systems และ Redis',
    'IoT / MQTT ตรงกับบริบทผลิตภัณฑ์',
  ],
  uncertain: 'ยังไม่มีหลักฐาน observability ในโปรไฟล์',
}
