import { MaskedCandidateProfile, ExhibitorBooth, EventState } from '../types';

export const CANONICAL_CANDIDATE: MaskedCandidateProfile = {
  candidateId: 'cand_demo_8f3a',
  candidateCode: 'Candidate #8F3A',
  isVerified: true,
  verificationMethod: 'thaid',
  assuranceLevel: 'IAL2.3',
  bioSummary: 'Senior Backend & Distributed Systems Specialist with 4+ years of experience designing high-throughput event queues, real-time telemetry pipelines, and resilient cloud architectures.',
  avatarConfig: {
    skinTone: 'warm_tan',
    hairStyle: 'spiky',
    hairColor: 'cyan',
    outfitStyle: 'cyber_hoodie',
    outfitColor: 'purple',
    animalMask: 'fox',
    scale: 2
  },
  skills: [
    {
      id: 'sk-01',
      name: 'Node.js',
      category: 'Backend Runtime',
      proficiency: 'expert',
      provenance: 'candidate_confirmed',
      evidenceSnippet: 'Architected high-scale REST & WebSocket microservices serving 50k+ daily users.'
    },
    {
      id: 'sk-02',
      name: 'MQTT',
      category: 'Protocols',
      proficiency: 'advanced',
      provenance: 'candidate_confirmed',
      evidenceSnippet: 'Built IoT broker telemetry streaming 2M+ synthetic sensor payloads per day.'
    },
    {
      id: 'sk-03',
      name: 'Redis',
      category: 'Database / Caching',
      proficiency: 'advanced',
      provenance: 'candidate_confirmed',
      evidenceSnippet: 'Implemented distributed rate limiting, pub/sub channels, and memory caching.'
    },
    {
      id: 'sk-04',
      name: 'Queue Systems',
      category: 'Architecture',
      proficiency: 'advanced',
      provenance: 'candidate_confirmed',
      evidenceSnippet: 'Designed BullMQ & Kafka event-driven pipelines with dead-letter queue recovery.'
    },
    {
      id: 'sk-05',
      name: 'TypeScript',
      category: 'Languages',
      proficiency: 'intermediate',
      provenance: 'parsed',
      evidenceSnippet: 'Developed full-stack type-safe interfaces and API contracts.'
    },
    {
      id: 'sk-06',
      name: 'PostgreSQL',
      category: 'Database',
      proficiency: 'advanced',
      provenance: 'parsed',
      evidenceSnippet: 'Optimized schema indexing, table partitioning, and connection pooling.'
    }
  ],
  evidence: [
    {
      id: 'ev-01',
      title: 'IoT Telemetry Ingestion Pipeline',
      description: 'Engineered an end-to-end ingestion pipeline processing 2,000,000+ IoT events daily with automated anomaly detection and 99.95% uptime.',
      skillsDemonstrated: ['Node.js', 'MQTT', 'Redis', 'Queue Systems'],
      linkPreview: 'github.com/synthetic-demo/iot-pipeline'
    },
    {
      id: 'ev-02',
      title: 'Distributed Background Queue Orchestrator',
      description: 'Implemented multi-tenant async job queue with priority scheduling, reducing API average response latency from 320ms to 45ms.',
      skillsDemonstrated: ['Node.js', 'Redis', 'Queue Systems', 'PostgreSQL'],
      linkPreview: 'github.com/synthetic-demo/distributed-queue'
    }
  ],
  consents: {
    resumeProcessing: true,
    realtimeMediaTransform: true,
    integritySignals: true,
    marketing: false
  },
  hiddenPiiData: {
    fullName: 'สมชาย ประเสริฐดี (Somchai Prasertdee)',
    email: 'candidate@example.test',
    phone: '081-234-5678',
    institution: 'King Mongkut\'s University of Technology',
    exactEmployer: 'TechCo Innovations Thailand Co., Ltd.',
    rawResumeUrl: 'https://storage.example.test/resumes/raw_8f3a.pdf'
  },
  revealedFields: [],
  profileVersion: 1
};

export const CANONICAL_BOOTHS: ExhibitorBooth[] = [
  {
    id: 'company-cyber-orchard',
    companyName: 'Cyber Orchard Co.',
    industry: 'IoT & Cloud Systems',
    zone: 'A1',
    themeColor: '#8B5CF6',
    accentColor: '#4ADE80',
    tagline: 'Connecting Industrial Sensors to the Cloud Seamlessly',
    description: 'Cyber Orchard พัฒนาระบบประมวลผล IoT Edge Computing และ Cloud Telemetry ขนาดใหญ่ สำหรับโรงงานอุตสาหกรรมอัจฉริยะในภูมิภาคเอเชียตะวันออกเฉียงใต้',
    techStack: ['Node.js', 'MQTT', 'Redis', 'BullMQ', 'AWS IoT', 'TypeScript'],
    recruiter: {
      id: 'rec_cyber_r12',
      codeName: 'Recruiter #R12 (Ploy)',
      title: 'Head of Backend Engineering',
      status: 'ONLINE'
    },
    queueCount: 3,
    avgWaitMinutes: 8,
    coordinates: { x: 180, y: 160, width: 280, height: 200 },
    activeJobs: [
      {
        id: 'job-backend-01',
        boothId: 'company-cyber-orchard',
        companyName: 'Cyber Orchard Co.',
        title: 'Backend Developer (Distributed Systems)',
        workMode: 'Hybrid',
        salaryRange: '45,000 – 70,000 THB',
        location: 'กรุงเทพฯ (BTS พร้อมพงษ์ / Hybrid 2 วัน)',
        interviewMinutes: 12,
        mustHaveSkills: ['Node.js', 'Redis', 'Queue Systems', 'MQTT'],
        niceToHaveSkills: ['AWS IoT', 'TypeScript', 'Docker'],
        responsibilities: [
          'ออกแบบและดูแลระบบ Ingestion Microservices สำหรับรับส่งข้อมูลเซ็นเซอร์ IoT',
          'ปรับปรุงประสิทธิภาพ Distributed Queue และ Redis Cache ให้รองรับ Peak Load',
          'ร่วมมือกับทีม Firmware และ Frontend ในการส่งมอบ Real-time Dashboard'
        ],
        evidenceRequirements: [
          'มีตัวอย่างผลงานหรือประสบการณ์พัฒนา Backend ด้วย Node.js',
          'เข้าใจการทำงานของ Message Queue และ Caching ในระบบจริง'
        ],
        matchScore: 92,
        matchConfidence: 'High (Evidence-Backed Rule Engine v2.1)',
        matchReasons: [
          'ทักษะ Node.js ตรงกับความต้องการหลักของตำแหน่ง (Must-have)',
          'มีหลักฐานผลงานด้าน Queue Systems และ Redis ที่ผ่านการยืนยัน',
          'ประสบการณ์ด้าน IoT Telemetry และ MQTT สอดคล้องกับผลิตภัณฑ์ของบริษัทโดยตรง'
        ],
        uncertainReasons: [
          'ยังไม่มีหลักฐานการใช้ AWS IoT Core โดยตรงในโปรไฟล์ (สามารถเรียนรู้เพิ่มเติมได้)'
        ]
      },
      {
        id: 'job-cloud-02',
        boothId: 'company-cyber-orchard',
        companyName: 'Cyber Orchard Co.',
        title: 'Cloud Infrastructure Engineer',
        workMode: 'Remote',
        salaryRange: '60,000 – 90,000 THB',
        location: 'Remote (ประเทศไทย)',
        interviewMinutes: 15,
        mustHaveSkills: ['Terraform', 'Kubernetes', 'AWS', 'Docker'],
        niceToHaveSkills: ['Prometheus', 'Grafana', 'Go'],
        responsibilities: [
          'บริหารจัดการ Kubernetes Cluster บน AWS EKS',
          'สร้าง Infrastructure as Code ด้วย Terraform',
          'ตั้งค่า CI/CD Automation และระบบเฝ้าระวังความพร้อมใช้งาน 99.9%'
        ],
        evidenceRequirements: ['ประสบการณ์จัดการ Production Cloud Infra'],
        matchScore: 68,
        matchConfidence: 'Medium',
        matchReasons: [
          'มีพื้นฐานความเข้าใจสถาปัตยกรรมระบบคลาวด์และ Backend'
        ],
        uncertainReasons: [
          'ขาดหลักฐานผลงาน Terraform และ Kubernetes ขั้นสูง'
        ]
      }
    ]
  },
  {
    id: 'company-riverbyte',
    companyName: 'Riverbyte Studio',
    industry: 'Creative Tech & Interactive AI',
    zone: 'A2',
    themeColor: '#FF4FD8',
    accentColor: '#FFD84D',
    tagline: 'Next-Generation Generative Visuals & Realtime Web Experiences',
    description: 'Riverbyte Studio เป็น Creative Technology Lab ที่ผสมผสาน Interactive 3D/2D WebGL, GenAI และ Immersive Experience ให้กับแบรนด์ชั้นนำระดับสากล',
    techStack: ['React', 'WebGL', 'Three.js', 'Phaser', 'Python', 'PyTorch'],
    recruiter: {
      id: 'rec_river_r05',
      codeName: 'Recruiter #R05 (Art)',
      title: 'Lead Creative Technologist',
      status: 'ONLINE'
    },
    queueCount: 1,
    avgWaitMinutes: 4,
    coordinates: { x: 1076, y: 160, width: 280, height: 200 },
    activeJobs: [
      {
        id: 'job-frontend-01',
        boothId: 'company-riverbyte',
        companyName: 'Riverbyte Studio',
        title: 'Frontend / UI Engineer (Interactive Canvas)',
        workMode: 'Remote',
        salaryRange: '50,000 – 75,000 THB',
        location: 'Remote (Flexible)',
        interviewMinutes: 12,
        mustHaveSkills: ['React', 'TypeScript', 'Canvas / WebGL', 'CSS / Animation'],
        niceToHaveSkills: ['Phaser', 'Three.js', 'TailwindCSS'],
        responsibilities: [
          'พัฒนา Interactive Web Applications ด้วย React และ 2D/3D Canvas',
          'ออกแบบ Micro-interactions และ Web Animation ที่ลื่นไหล 60 FPS',
          'รองรับการใช้งานบนทุกขนาดหน้าจอทั้ง Mobile และ Desktop'
        ],
        evidenceRequirements: ['มี Portfolio เว็บหรือ Interactive Demo ให้ทดลอง'],
        matchScore: 78,
        matchConfidence: 'High',
        matchReasons: [
          'มีทักษะ TypeScript และประสบการณ์พัฒนา Web Applications',
          'มีผลงานด้าน Interactive User Interface'
        ],
        uncertainReasons: [
          'ประสบการณ์ด้าน WebGL Shaders ยังไม่ชัดเจนในโปรไฟล์'
        ]
      }
    ]
  },
  {
    id: 'company-apex-cloud',
    companyName: 'Apex Cloud Tech',
    industry: 'Cloud Infra & Security',
    zone: 'B1',
    themeColor: '#37E7FF',
    accentColor: '#3B82F6',
    tagline: 'Resilient Distributed Cloud Infrastructure & Zero-Trust Security',
    description: 'Apex Cloud ให้บริการแพลตฟอร์ม Cloud Security, Automated Zero-Trust Policy และ High-Performance Edge Routing สำหรับองค์กรระดับ Enterprise',
    techStack: ['Kubernetes', 'Go', 'Terraform', 'PostgreSQL', 'eBPF', 'Rust'],
    recruiter: {
      id: 'rec_apex_r21',
      codeName: 'Recruiter #R21 (Ken)',
      title: 'Director of Platform Engineering',
      status: 'ONLINE'
    },
    queueCount: 2,
    avgWaitMinutes: 6,
    coordinates: { x: 180, y: 640, width: 280, height: 200 },
    activeJobs: [
      {
        id: 'job-devops-01',
        boothId: 'company-apex-cloud',
        companyName: 'Apex Cloud Tech',
        title: 'DevOps / Cloud Architect',
        workMode: 'Hybrid',
        salaryRange: '70,000 – 110,000 THB',
        location: 'กรุงเทพฯ (สาทร / Hybrid)',
        interviewMinutes: 15,
        mustHaveSkills: ['Go', 'Kubernetes', 'PostgreSQL', 'Zero-Trust Architecture'],
        niceToHaveSkills: ['eBPF', 'Terraform', 'Vault'],
        responsibilities: [
          'ออกแบบ Cloud Mesh Architecture ที่มีความปลอดภัยระดับ Military-grade',
          'สร้างระบบ Observability, Logging และ Realtime Alerting',
          'ปรับปรุง PostgreSQL Database Cluster เพื่อรองรับ Multi-Region Replication'
        ],
        evidenceRequirements: ['หลักฐานความเชี่ยวชาญ High Availability Distributed Systems'],
        matchScore: 74,
        matchConfidence: 'Medium',
        matchReasons: [
          'มีความเชี่ยวชาญด้าน PostgreSQL และ Distributed Architecture',
          'มีประสบการณ์ออกแบบ High-Throughput Pipelines'
        ],
        uncertainReasons: [
          'ต้องการความเชี่ยวชาญภาษา Go และ eBPF เพิ่มเติม'
        ]
      }
    ]
  },
  {
    id: 'company-solarpulse',
    companyName: 'SolarPulse Energy',
    industry: 'GreenTech & Smart Grid Energy',
    zone: 'B2',
    themeColor: '#FFD84D',
    accentColor: '#10B981',
    tagline: 'Clean Energy Intelligence & Distributed Microgrid Optimization',
    description: 'SolarPulse พัฒนาระบบ AI สำหรับบริหารจัดการแผงพลังงานแสงอาทิตย์ แบตเตอรี่กักเก็บพลังงาน และการกระจายไฟฟ้าในโครงข่าย Smart Grid',
    techStack: ['Python', 'FastAPI', 'TimescaleDB', 'Rust', 'C++', 'Grafana'],
    recruiter: {
      id: 'rec_solar_r08',
      codeName: 'Recruiter #R08 (Nook)',
      title: 'Smart Grid Project Lead',
      status: 'ONLINE'
    },
    queueCount: 2,
    avgWaitMinutes: 5,
    coordinates: { x: 1076, y: 640, width: 280, height: 200 },
    activeJobs: [
      {
        id: 'job-greentech-01',
        boothId: 'company-solarpulse',
        companyName: 'SolarPulse Energy',
        title: 'Data / Firmware Engineer (Smart Meter)',
        workMode: 'Hybrid',
        salaryRange: '50,000 – 80,000 THB',
        location: 'กรุงเทพฯ / ระยอง (Hybrid)',
        interviewMinutes: 12,
        mustHaveSkills: ['Python', 'TimescaleDB', 'IoT Sensor Telemetry', 'FastAPI'],
        niceToHaveSkills: ['Rust', 'C++', 'Energy Market Trading'],
        responsibilities: [
          'ประมวลผลข้อมูล Real-time Telemetry จากมิเตอร์พลังงานแสงอาทิตย์ 10,000+ จุด',
          'พัฒนาโมเดลพยากรณ์ปริมาณแสงอาทิตย์และการชาร์จแบตเตอรี่',
          'สร้าง Dashboard ติดตาม Carbon Credit และประสิทธิภาพพลังงาน'
        ],
        evidenceRequirements: ['มีประสบการณ์ Time-series Data & IoT Telemetry'],
        matchScore: 86,
        matchConfidence: 'High',
        matchReasons: [
          'มีทักษะ Ingestion Telemetry และ IoT protocols ตรงกับสายงาน',
          'เข้าใจการจัดการข้อมูลความถี่สูงและ Caching'
        ],
        uncertainReasons: [
          'ความรู้เฉพาะทางด้านวิศวกรรมไฟฟ้าและ Solar Inverters ยังต้องฝึกอบรม'
        ]
      }
    ]
  }
];

export const INITIAL_EVENT_STATE: EventState = {
  id: 'event-neon-career-city',
  nameTh: 'Neon Career City Virtual Job Fair 2026',
  status: 'LIVE',
  totalCcu: 428,
  activeQueues: 8,
  liveInterviews: 4,
  mutualMatches: 19,
  broadcasts: [
    {
      id: 'b-01',
      message: 'ยินดีต้อนรับสู่ Neon Career City! โหมด Blind Mode เปิดใช้งานเพื่อความเป็นธรรมในการคัดเลือก',
      timestamp: new Date().toISOString(),
      level: 'info'
    }
  ]
};

export const SYNTHETIC_NPCS = [
  {
    id: 'npc-guide-1',
    name: 'Staff P\'Mew',
    role: 'Event Guide',
    x: 768,
    y: 920,
    direction: 'down',
    dialogue: 'สวัสดีครับ! ยินดีต้อนรับสู่ Neon Career Hall คุณสามารถเดินสำรวจบูธทั้ง 4 โซน หรือกดปุ่ม "Navigator" ที่แถบด้านบนเพื่อดูรายการตำแหน่งงานทั้งหมดได้ทันทีครับ'
  },
  {
    id: 'npc-a11y',
    name: 'K. Grace (A11y Lead)',
    role: 'Accessibility Specialist',
    x: 320,
    y: 920,
    direction: 'right',
    dialogue: 'หากคุณต้องการใช้งานแบบคีย์บอร์ด 100% หรือมีข้อจำกัดด้านสายตา/การควบคุม สามารถสลับไปที่ "โหมดรายการ (Navigator)" ได้ตลอดเวลา ทุกบูธและทุกคิวทำงานได้ครบถ้วนค่ะ'
  },
  {
    id: 'npc-tech-support',
    name: 'Engineer Bank',
    role: 'Tech Support & Device Pod',
    x: 1200,
    y: 920,
    direction: 'left',
    dialogue: 'แนะนำให้ทดสอบกล้องและไมค์ที่หน้าจอ Interview Preflight นะครับ! ระบบ Face Mask และ Voice Pitch Shifter ของเราประมวลผลบนเครื่องคุณ 100% ปลอดภัย ไร้กังวลแน่นอนครับ'
  },
  {
    id: 'npc-candidate-1',
    name: 'Candidate #Foxie',
    role: 'Job Seeker',
    x: 600,
    y: 480,
    direction: 'up',
    dialogue: 'ผมเพิ่งสัมภาษณ์กับทีม Cyber Orchard เสร็จ บรรยากาศเป็นกันเองมาก ได้คุยเรื่องงานจริงๆ โดยไม่ต้องกังวลเรื่องโปรไฟล์ส่วนตัวเลย!'
  },
  {
    id: 'npc-candidate-2',
    name: 'Candidate #CyberOwl',
    role: 'Job Seeker',
    x: 940,
    y: 480,
    direction: 'left',
    dialogue: 'คะแนน AI Match 92% มีคำอธิบายชัดเจนว่าตรงกับ Must-have ข้อไหน ทำให้เตรียมตัวสัมภาษณ์ได้ตรงจุดมากๆ ครับ'
  }
];
