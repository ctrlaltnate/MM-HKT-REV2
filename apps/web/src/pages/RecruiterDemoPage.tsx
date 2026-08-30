import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Cpu,
  ExternalLink,
  EyeOff,
  FileText,
  Heart,
  HelpCircle,
  Info,
  Layers,
  LoaderCircle,
  Mail,
  MapPin,
  PartyPopper,
  Pencil,
  Phone,
  RotateCcw,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { analyzeResume, generateAssessment, type AssessmentQuestion } from "../services/resume-api";
import { sponsorCompanies, type Company } from "../data/companies";

export type Job = {
  id: string;
  companyId: string;
  title: string;
  category: "Tech" | "Business" | "People" | "Operations";
  department: string;
  location: string;
  type: string;
  salary: string;
  summary: string;
  skills: string[];
};

export const jobs: Job[] = [
  // Tech (6 positions)
  {
    id: "tech-msft-ai",
    companyId: "microsoft",
    title: "Cloud & AI Solutions Architect",
    category: "Tech",
    department: "Azure AI & Cloud Solutions",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿90K–145K",
    summary: "ออกแบบสถาปัตยกรรม Enterprise Cloud & AI บน Azure ดูแลความปลอดภัย Scalability และการบูรณาการ Generative AI Solutions สำหรับลูกค้าองค์กร",
    skills: ["Azure Cloud", "Generative AI", "Cloud Architecture", "Kubernetes", "System Security"],
  },
  {
    id: "tech-lineman-fullstack",
    companyId: "lineman",
    title: "Senior Full-Stack Engineer",
    category: "Tech",
    department: "Core Marketplace Engineering",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿75K–120K",
    summary: "พัฒนาและดูแลระบบ Marketplace On-demand ขนาดใหญ่ รองรับ High Concurrency แสน Transactions/min ด้วย Microservices และ Real-time API",
    skills: ["React", "TypeScript", "Node.js / Go", "PostgreSQL", "System Design"],
  },
  {
    id: "tech-canva-frontend",
    companyId: "canva",
    title: "Frontend Design Engineer",
    category: "Tech",
    department: "Visual Suite & Magic Studio",
    location: "Bangkok & Sydney · Hybrid",
    type: "Full-time",
    salary: "฿70K–110K",
    summary: "สร้างสรรค์ Canvas-based Interactive Web Tools ระดับโลก พร้อมเชื่อมต่อ Magic AI และเน้น Performance 60fps รวมถึง Web Accessibility",
    skills: ["React", "TypeScript", "Canvas/WebGL", "Design Systems", "Web Performance"],
  },
  {
    id: "tech-mfec-security",
    companyId: "mfec",
    title: "Cybersecurity & Cloud Defense Specialist",
    category: "Tech",
    department: "Security Operations Center (SOC)",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿65K–105K",
    summary: "เฝ้าระวัง ตอบสนองต่อภัยคุกคามไซเบอร์ระดับองค์กร ตรวจสอบ SIEM และวางมาตรฐานความปลอดภัยคลาวด์ ISO 27001",
    skills: ["SIEM / SOC", "Threat Hunting", "Cloud Security", "Incident Response", "Network Defense"],
  },
  {
    id: "tech-muvmi-mobile",
    companyId: "muvmi",
    title: "Mobile Application Engineer (EV Fleet)",
    category: "Tech",
    department: "Smart Mobility App Team",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿55K–90K",
    summary: "พัฒนาโมบายแอปพลิเคชันเรียกรถตุ๊กตุ๊กไฟฟ้าแบบ On-Demand เชื่อมต่อ Telemetry แบบเรียลไทม์ และระบบแชร์เส้นทางอัจฉริยะ",
    skills: ["React Native", "TypeScript", "Geolocation / Maps", "WebSockets", "Mobile UI"],
  },
  {
    id: "tech-jobthai-data",
    companyId: "jobthai",
    title: "Data Analytics & ML Platform Engineer",
    category: "Tech",
    department: "Data & Career Intelligence",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿60K–95K",
    summary: "สร้าง Data Pipeline วิเคราะห์ข้อมูลตลาดแรงงาน และพัฒนาโมเดล AI Talent Matching จับคู่งานและทักษะอย่างแม่นยำ",
    skills: ["Python", "SQL", "BigQuery", "Machine Learning", "Data Pipeline"],
  },

  // Business (4 positions)
  {
    id: "biz-msft-sales",
    companyId: "microsoft",
    title: "Enterprise Partner Sales Lead",
    category: "Business",
    department: "Enterprise Commercial",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿80K–130K + Incentive",
    summary: "ดูแลการขายโซลูชันคลาวด์และ AI แก่กลุ่มลูกค้าองค์กรขนาดใหญ่ วางกลยุทธ์ Digital Transformation ร่วมกับผู้บริหารระดับสูง",
    skills: ["B2B Enterprise Sales", "Cloud Strategy", "Negotiation", "Account Management", "Solution Selling"],
  },
  {
    id: "biz-lineman-growth",
    companyId: "lineman",
    title: "Digital Growth & Performance Marketer",
    category: "Business",
    department: "Growth & User Acquisition",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿50K–80K",
    summary: "วางแผนแคมเปญกระตุ้นการเติบโตของผู้ใช้ใหม่และ Retention วิเคราะห์ Funnel & CAC/LTV และปรับงบโฆษณาด้วยข้อมูลจริง",
    skills: ["Performance Marketing", "Funnel Analytics", "SQL / Google Analytics", "A/B Testing", "Campaign ROI"],
  },
  {
    id: "biz-canva-brand",
    companyId: "canva",
    title: "Brand & Creator Marketing Specialist",
    category: "Business",
    department: "Regional Brand & Creator Community",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿45K–75K",
    summary: "ขับเคลื่อนการรับรู้แบรนด์ สร้างคอมมูนิตี้ Content Creator และร่วมมือกับพันธมิตรสร้างสรรค์เพื่อขยายการใช้งาน Canva ในไทย",
    skills: ["Brand Storytelling", "Creator Partnerships", "Content Strategy", "Social Media", "Community Growth"],
  },
  {
    id: "biz-if-bd",
    companyId: "ifdrink",
    title: "International Business Development Executive",
    category: "Business",
    department: "Global Export & Commercial",
    location: "Bangkok & Travel · Hybrid",
    type: "Full-time",
    salary: "฿55K–85K + Commission",
    summary: "ขยายตลาดส่งออกเครื่องดื่มน้ำมะพร้าวและน้ำผลไม้ IF สู่ต่างประเทศ เจรจากับคู่ค้าระหว่างประเทศและบริหาร Distributor ทั่วโลก",
    skills: ["International Trade", "Key Account Management", "Export Compliance", "Distributor Negotiation", "FMCG Commercial"],
  },

  // People (4 positions)
  {
    id: "people-mfec-ta",
    companyId: "mfec",
    title: "Technical Talent Acquisition Partner",
    category: "People",
    department: "People & Organization",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿45K–70K",
    summary: "วางแผนและดำเนินการสรรหาบุคลากรสายเทคโนโลยีระดับ Specialist สัมภาษณ์เชิงลึก และสร้าง Candidate Experience ที่ยอดเยี่ยม",
    skills: ["Tech Sourcing", "Competency Interviewing", "Employer Branding", "Candidate Experience", "Tech Talent Pipeline"],
  },
  {
    id: "people-canva-hrbp",
    companyId: "canva",
    title: "People & Culture Partner (HRBP)",
    category: "People",
    department: "People Operations",
    location: "Bangkok & Sydney · Hybrid",
    type: "Full-time",
    salary: "฿60K–95K",
    summary: "เป็นที่ปรึกษาเชิงกลยุทธ์ด้านบุคลากรแก่ผู้นำทีม ดูแล Culture, Employee Engagement, และการเติบโตของทีมตามค่านิยม Canva",
    skills: ["People Strategy", "Employee Engagement", "Coaching & Feedback", "DEI Programs", "Talent Management"],
  },
  {
    id: "people-spark-coach",
    companyId: "techspark",
    title: "Talent Development & Community Specialist",
    category: "People",
    department: "Learning & Community",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿40K–65K",
    summary: "ออกแบบโปรแกรมบ่มเพาะทักษะสายเทค จัดเวิร์กช็อป Mentorship และสร้างระบบสนับสนุนคนรุ่นใหม่สู่สายงานดิจิทัล",
    skills: ["Learning & Development", "Workshop Facilitation", "Mentorship Programs", "Community Building", "Talent Coaching"],
  },
  {
    id: "people-jobthai-er",
    companyId: "jobthai",
    title: "People Operations & Employee Experience Officer",
    category: "People",
    department: "Human Resources",
    location: "Bangkok · On-site / Hybrid",
    type: "Full-time",
    salary: "฿35K–55K",
    summary: "ดูแล Employee Lifecycle ตั้งแต่ Onboarding บริหารจัดการสวัสดิการ แรงงานสัมพันธ์ และสร้างสุขภาวะที่ดีในที่ทำงาน",
    skills: ["HR Operations", "Onboarding Design", "Labor Law Compliance", "Employee Relations", "HRIS & Benefits"],
  },

  // Operations (4 positions)
  {
    id: "ops-muvmi-fleet",
    companyId: "muvmi",
    title: "EV Fleet & City Operations Lead",
    category: "Operations",
    department: "Urban Mobility Operations",
    location: "Bangkok · On-site / Hybrid",
    type: "Full-time",
    salary: "฿50K–78K",
    summary: "บริหารจัดการฝูงรถตุ๊กตุ๊กไฟฟ้า สถานีชาร์จ และประสานงานทีมปฏิบัติการภาคสนามเพื่อความปลอดภัยและการเดินทางตรงเวลา",
    skills: ["Fleet Operations", "Route Optimization", "SLA Management", "Incident Response", "Process Improvement"],
  },
  {
    id: "ops-if-supply",
    companyId: "ifdrink",
    title: "Supply Chain & Logistics Operations Manager",
    category: "Operations",
    department: "Operations & Supply Chain",
    location: "Bangkok & Factory · Hybrid",
    type: "Full-time",
    salary: "฿50K–80K",
    summary: "ควบคุมการวางแผนการผลิต ห่วงโซ่อุปทาน คลังสินค้า และการขนส่งสินค้าส่งออกทั่วโลกให้ตรงตามมาตรฐานสากลและต้นทุนเหมาะสม",
    skills: ["Supply Chain Planning", "Logistics & Freight", "Warehouse Management", "Cost Optimization", "Export Operations"],
  },
  {
    id: "ops-lineman-cs",
    companyId: "lineman",
    title: "Customer Experience & Operations Lead",
    category: "Operations",
    department: "Customer Operations",
    location: "Bangkok · Hybrid",
    type: "Full-time",
    salary: "฿52K–82K",
    summary: "บริหารคุณภาพการให้บริการลูกค้าและร้านค้า ติดตาม SLA พัฒนาคู่มือแก้ไขปัญหา และประสานทีม Product เพื่อปรับระบบ",
    skills: ["Customer Service Excellence", "SLA & KPI Tracking", "Team Coaching", "Root Cause Analysis", "Process Re-engineering"],
  },
  {
    id: "ops-julian-spa",
    companyId: "julians",
    title: "Spa & Wellness Operations Manager",
    category: "Operations",
    department: "Hospitality & Operations",
    location: "Bangkok · On-site",
    type: "Full-time",
    salary: "฿42K–68K",
    summary: "ควบคุมมาตรฐานการให้บริการสปาระดับ 5 ดาว ดูแลสต็อกผลิตภัณฑ์ออร์แกนิก จัดตารางบุคลากร และควบคุมความพึงพอใจลูกค้า",
    skills: ["Hospitality Management", "Quality Assurance", "Inventory Management", "Staff Scheduling", "VIP Customer Care"],
  },
];

const sampleClaims =
  "มีประสบการณ์ React และ TypeScript 3 ปี เชื่อมต่อ REST/GraphQL API และเขียน Automated Testing ด้วย Vitest/Playwright เคยปรับ Performance แดชบอร์ดจน Response Time ลดลง 40% จัดการ State และ Error Handling อย่างเป็นระบบตามมาตรฐาน WCAG";

const categoryDescriptions: Record<string, string> = {
  Tech: "Software Engineering, Cloud, AI, Security และ Data Intelligence",
  Business: "Growth Marketing, Brand Community และ Enterprise Commercial",
  People: "Talent Acquisition, People Strategy (HRBP) และ Community Learning",
  Operations: "Fleet Logistics, Supply Chain, Customer Operations และ Hospitality",
};

const jobDetails: Record<
  string,
  { overview: string; responsibilities: string[]; qualifications: string[]; benefits: string[] }
> = {
  "tech-msft-ai": {
    overview:
      "ร่วมทีม Enterprise Cloud & AI เพื่อออกแบบและวางสถาปัตยกรรมระดับคลาวด์บน Microsoft Azure ให้กับองค์กรชั้นนำในไทย โดยมุ่งเน้นการนำ Azure OpenAI, Copilot Studio, และ Modern Cloud-native Architecture ไปใช้งานจริงอย่างปลอดภัยและคุ้มค่า",
    responsibilities: [
      "ออกแบบและให้คำปรึกษาด้าน Enterprise Cloud & Generative AI Architecture",
      "วางแผนความปลอดภัยตามเฟรมเวิร์ก Microsoft Cloud Security Benchmark",
      "ทำงานร่วมกับลูกค้าองค์กรในการทำ Proof-of-Concept และขึ้น Production",
      "เป็น Technical Evangelist ถ่ายทอด Best Practice แก่ทีมวิศวกรภายนอก",
    ],
    qualifications: [
      "ประสบการณ์ Cloud Architecture หรือ AI Integration 3–5 ปีขึ้นไป",
      "คุ้นเคยกับ Microsoft Azure, Kubernetes, และ AI/LLM SDKs",
      "มีทักษะการสื่อสารเชิงกลยุทธ์ ถ่ายทอดโจทย์ธุรกิจสู่โซลูชันเทคนิคได้",
    ],
    benefits: [
      "Hybrid work ยืดหยุ่นสูงสุด",
      "งบสอบ Certifications และเรียนรู้ระดับสากลฟรี",
      "ประกันสุขภาพพรีเมียมครอบคลุมครอบครัว",
      "Wellness & Fitness Allowance รายปี",
    ],
  },
  "tech-lineman-fullstack": {
    overview:
      "ร่วมสร้าง Core Marketplace Platform ของ LINE MAN Wongnai ที่รองรับการสั่งอาหาร บริการเรียกรถ และ Mart ของคนไทยหลายล้านคนทุกวัน โดยเน้นระบบที่ทนทาน (High Availability) และขยายตัวได้รวดเร็ว (High Concurrency)",
    responsibilities: [
      "พัฒนาและดูแล Full-stack Services ด้วย React, TypeScript, Node.js และ Go",
      "ออกแบบ Database Schema, Transactions และ Caching Strategy บน PostgreSQL/Redis",
      "เขียน Unit & Integration Tests พร้อมทบทวน Code เพื่อรักษามาตรฐานความเสถียร",
      "ตรวจวัดและปรับแต่ง Latency และ System Reliability ใน Production",
    ],
    qualifications: [
      "ประสบการณ์ Full-stack Web Development 3 ปีขึ้นไป",
      "เข้าใจ Microservices, Message Queues และ High Concurrency Systems",
      "สามารถแก้ไขปัญหา Incident และคิดวิเคราะห์อย่างเป็นระบบด้วยข้อมูล",
    ],
    benefits: [
      "LINE MAN Credit สั่งอาหารฟรีทุกเดือน",
      "อาหารกลางวันและเครื่องดื่มฟรีที่ออฟฟิศ",
      "เวลาทำงานยืดหยุ่น & Hybrid work",
      "MacBook Pro สเปกท็อปสำหรับวิศวกร",
    ],
  },
  "tech-canva-frontend": {
    overview:
      "ออกแบบและพัฒนา Interactive Visual Canvas และเครื่องมือ AI-assisted Design ให้ผู้ใช้งานกว่า 170 ล้านคนทั่วโลก โดยผลักดันขีดจำกัดของ Web Graphics, WebGL, Real-time Collaboration และ Component Design Systems",
    responsibilities: [
      "พัฒนา Interactive Features บน Canvas โดยเน้น Frame-rate ที่ลื่นไหล (60fps)",
      "สร้าง Reusable UI Components และขยาย Design System ร่วมกับทีมนักออกแบบ",
      "บูรณาการ Magic Studio AI เข้าสู่ Workflow การออกแบบของผู้ใช้",
      "ดูแล Web Accessibility (a11y) และ Cross-platform Browser Compatibility",
    ],
    qualifications: [
      "ประสบการณ์ Frontend Engineering 3–5 ปี โดยเชี่ยวชาญ React & TypeScript",
      "มีความเข้าใจลึกซึ้งเรื่อง DOM Performance, Canvas API หรือ WebGL",
      "ใส่ใจใน Product Detail, Micro-animations และ User Experience",
    ],
    benefits: [
      "Canva Pro ฟรีตลอดชีพสำหรับตนเองและครอบครัว",
      "Home Office Stipend สำหรับจัดโต๊ะทำงาน",
      "Learning & Growth Fund รายปี",
      "วันลาดูแลสุขภาพจิต (Mental Health Days)",
    ],
  },
  "tech-mfec-security": {
    overview:
      "ประจำศูนย์ Security Operations Center (SOC) ดูแลความปลอดภัยโครงสร้างพื้นฐานระดับประเทศ ตรวจจับ วิเคราะห์ และตอบสนองต่อภัยคุกคามไซเบอร์ (Incident Response) ให้กับธนาคารและองค์กรภาครัฐ",
    responsibilities: [
      "เฝ้าระวังและวิเคราะห์ Security Alerts จาก SIEM, EDR และ Cloud Logs",
      "ดำเนินการ Incident Response, Root Cause Analysis และระงับเหตุฉุกเฉิน",
      "พัฒนา Detection Rules และ Threat Hunting Playbooks ใหม่ๆ",
      "ให้คำแนะนำแก่ทีมลูกค้าในการแก้ไขช่องโหว่ตามมาตรฐาน ISO 27001",
    ],
    qualifications: [
      "ประสบการณ์ SOC Analyst หรือ Cybersecurity 2 ปีขึ้นไป",
      "เข้าใจ Network Protocols, Cloud Security (AWS/Azure) และ Attack Frameworks",
      "มีทักษะคิดเชิงหลักฐาน (Evidence-based) และทำงานภายใต้ภาวะฉุกเฉินได้",
    ],
    benefits: [
      "สนับสนุนค่าสอบ Certificate สากล (CISSP, CEH, Sec+) เต็มจำนวน",
      "โบนัสตามผลงานและ Incentive โครงการ",
      "ประกันสุขภาพกลุ่มชั้นนำ",
      "กิจกรรมชมรมกีฬาและ Esports ภายใน",
    ],
  },
  "tech-muvmi-mobile": {
    overview:
      "พัฒนาแอปพลิเคชัน MuvMi สำหรับผู้โดยสารและแอปพลิเคชันสำหรับคนขับรถตุ๊กตุ๊กไฟฟ้า เชื่อมต่อกับระบบ Dynamic Routing และ Telemetry ของรถ EV แบบเรียลไทม์เพื่อสร้างประสบการณ์การเดินทางในเมืองที่ไร้รอยต่อ",
    responsibilities: [
      "พัฒนาฟีเจอร์จองรถ เรียกรถ และชำระเงินด้วย React Native และ TypeScript",
      "ปรับปรุงประสิทธิภาพ Real-time Map Rendering และตำแหน่ง GPS บนมือถือ",
      "จัดการ State, Offline Caching และ WebSocket Data Stream",
      "ทดสอบแอปพลิเคชันบนอุปกรณ์จริงและส่งขึ้น App Store / Play Store",
    ],
    qualifications: [
      "ประสบการณ์ Mobile App Development 2–4 ปี",
      "เชี่ยวชาญ React Native, Geolocation APIs, และ WebSockets",
      "มีความกระตือรือร้นในการแก้ปัญหาการเดินทางและสิ่งแวดล้อมในเมือง",
    ],
    benefits: [
      "สิทธิ์นั่ง MuvMi เดินทางในกรุงเทพฯ ฟรี",
      "กองทุนสนับสนุนการเดินทางพลังงานสะอาด",
      "เวลาทำงานยืดหยุ่นและการทำงานแบบ Hybrid",
      "ส่วนลดร้านอาหารย่านสามย่าน-บรรทัดทอง",
    ],
  },
  "tech-jobthai-data": {
    overview:
      "ยกระดับแพลตฟอร์ม JobThai ด้วย Big Data และ Machine Learning เพื่อสร้างระบบ Smart Candidate Matching และ Data Pipeline ที่ประมวลผลข้อมูลการสมัครงานนับล้านรายการ ให้เป็นแนวโน้มตลาดแรงงานที่มีคุณค่า",
    responsibilities: [
      "พัฒนา Data Pipeline และ ETL Workflow ด้วย Python และ Google BigQuery",
      "พัฒนาโมเดล AI Semantic Search และ Resume-JD Matcher",
      "สร้าง Data Dashboard สำหรับวิเคราะห์ Metrics พฤติกรรมผู้ใช้งาน",
      "ร่วมออกแบบ Database Architecture เพื่อรองรับการสืบค้นความเร็วสูง",
    ],
    qualifications: [
      "ประสบการณ์ Data Engineering หรือ Machine Learning 2 ปีขึ้นไป",
      "เชี่ยวชาญ Python, SQL, Cloud Data Warehouse และ ML Frameworks",
      "มีความคิดเชิงสถิติ เข้าใจ Data Validation และ Quality Control",
    ],
    benefits: [
      "Hybrid Work สัปดาห์ละ 2-3 วัน",
      "งบสัมมนาและคอร์สพัฒนาทักษะวิชาชีพ",
      "ประกันสุขภาพกลุ่มครอบคลุม OPD/IPD",
      "เงินช่วยเหลือพิเศษและโบนัสประจำปี",
    ],
  },

  // Business (4)
  "biz-msft-sales": {
    overview:
      "ขับเคลื่อนการเติบโตเชิงพาณิชย์ของ Microsoft Thailand โดยนำเสนอโซลูชัน Enterprise Cloud, Copilot AI และ Security แก่ผู้นำระดับ C-Level ของกลุ่มธุรกิจชั้นนำ",
    responsibilities: [
      "สร้างและบริหาร Sales Pipeline ลูกค้าองค์กรระดับ Enterprise",
      "นำเสนอ Strategic Solution Pitch ร่วมกับ Cloud Solution Architects",
      "เจรจาเงื่อนไขสัญญาเชิงพาณิชย์และปิดการขายตามเป้าหมายรายไตรมาส",
      "ดูแลรักษาความสัมพันธ์ระยะยาวในฐานะ Trusted Business Advisor",
    ],
    qualifications: [
      "ประสบการณ์ B2B Enterprise IT Solution Sales 3–6 ปี",
      "เข้าใจภาพรวม Cloud, Software Licensing และ Digital Transformation",
      "ทักษะการเจรจาต่อรองและการนำเสนอระดับมืออาชีพ",
    ],
    benefits: [
      "Incentive และค่าคอมมิชชันตามผลงาน",
      "งบสนับสนุนอุปกรณ์และค่าเดินทาง",
      "Hybrid work ยืดหยุ่นสูงสุด",
      "สวัสดิการระดับสากลครบครัน",
    ],
  },
  "biz-lineman-growth": {
    overview:
      "วางแผนและบริหารงบการตลาด Performance Marketing ของ LINE MAN ขับเคลื่อนการได้มาของผู้ใช้ใหม่ (User Acquisition) และการสั่งซื้อซ้ำ ผ่านการทดลองและวิเคราะห์ข้อมูลเชิงลึก",
    responsibilities: [
      "วางแผนและยิงแคมเปญโฆษณาบน Google, Meta, TikTok และ programmatic ads",
      "ติดตามและปรับปรุง CAC, LTV, Retention Rate และ Conversion Funnel",
      "ทำ A/B Testing สำหรับ Ad Creatives และ Landing Pages อย่างต่อเนื่อง",
      "สรุปข้อมูล ROI และเสนอแนะกลยุทธ์การเติบโตร่วมกับทีม Product",
    ],
    qualifications: [
      "ประสบการณ์ Performance Marketing หรือ Growth 2–4 ปี",
      "ใช้ Google Analytics, SQL, AppsFlyer และ Ads Manager ได้อย่างเชี่ยวชาญ",
      "คิดวิเคราะห์ด้วยตัวเลขและกล้าทดลองสิ่งใหม่",
    ],
    benefits: [
      "โบนัสตามผลงานและ Performance",
      "LINE MAN Credit สำหรับสั่งอาหาร",
      "งบ Upskill & Certification ด้านการตลาด",
      "บรรยากาศการทำงานแบบ Data-driven",
    ],
  },
  "biz-canva-brand": {
    overview:
      "สร้างแบรนด์ Canva ให้เป็นเครื่องมือการออกแบบอันดับหนึ่งในใจคนไทย ผ่านการสร้าง Creator Ecosystem แคมเปญสื่อสาร และกิจกรรมชุมชนครีเอทีฟ",
    responsibilities: [
      "วางกลยุทธ์การสื่อสารแบรนด์และบริหารจัดการ Content บนช่องทาง Social Media",
      "สร้างเครือข่ายความร่วมมือกับ Local Creators, Influencers และสถาบันการศึกษา",
      "วางแผนและจัดกิจกรรม Community Workshops ทั้งแบบ Online และ On-site",
      "วัดผล Brand Sentiment, Engagement และความผูกพันของผู้ใช้งาน",
    ],
    qualifications: [
      "ประสบการณ์ Brand Marketing หรือ Community Management 2–4 ปี",
      "มีความคิดสร้างสรรค์ เล่าเรื่องเก่ง และเข้าใจพฤติกรรมคนรุ่นใหม่ในไทย",
      "สื่อสารภาษาไทยและอังกฤษได้อย่างคล่องแคล่ว",
    ],
    benefits: [
      "Canva Pro ฟรี และงบสร้างสรรค์ผลงาน",
      "สวัสดิการ Home Office และสุขภาพจิต",
      "โอกาสร่วมงานกับทีมนานาชาติ",
      "วันลาพักผ่อนแบบยืดหยุ่น",
    ],
  },
  "biz-if-bd": {
    overview:
      "ขยายการเติบโตของแบรนด์เครื่องดื่มน้ำมะพร้าวและน้ำผลไม้ IF สู่ตลาดเอเชีย ยุโรป และอเมริกา โดยค้นหาและเจรจากับตัวแทนจำหน่ายระดับนานาชาติ",
    responsibilities: [
      "ค้นหาและคัดเลือกตัวแทนจำหน่าย (Distributor) ในตลาดต่างประเทศเป้าหมาย",
      "เจรจาข้อตกลงทางการค้า Incoterms, Pricing Structure และ Export Terms",
      "ประสานงานทีมผลิตและโลจิสติกส์เพื่อวางแผนการส่งมอบสินค้า",
      "เข้าร่วมงานแสดงสินค้านานาชาติ (Trade Fairs เช่น Thaifex, Gulfood)",
    ],
    qualifications: [
      "ประสบการณ์ International Trade หรือ Business Development ในธุรกิจ FMCG 2–5 ปี",
      "เข้าใจกฎหมายส่งออก ศุลกากร และเอกสารการค้าระหว่างประเทศ",
      "สื่อสารภาษาอังกฤษเชิงธุรกิจได้ดีเยี่ยม (หากได้ภาษาที่สามจะได้รับการพิจารณาเป็นพิเศษ)",
    ],
    benefits: [
      "Commission จากยอดขายส่งออก",
      "โอกาสเดินทางไปปฏิบัติงานและออกบูธต่างประเทศ",
      "เครื่องดื่มแบรนด์ IF ดื่มฟรีไม่อั้น",
      "ประกันสุขภาพและโบนัสประจำปี",
    ],
  },

  // People (4)
  "people-mfec-ta": {
    overview:
      "ดูแลกระบวนการสรรหาและคัดเลือกบุคลากรสายเทคโนโลยีระดับแนวหน้า (Software Engineer, Cloud, Security) เพื่อรองรับการขยายตัวของโครงการระดับประเทศ",
    responsibilities: [
      "วางแผนกลยุทธ์ Sourcing และค้นหาผู้สมัครสายไอทีจากช่องทางต่างๆ",
      "คัดกรองเบื้องต้นและสัมภาษณ์เชิงสมรรถนะ (Competency-based Interview)",
      "ประสานงานกับ Hiring Managers เพื่อจัดทำ Assessment และข้อเสนอจ้างงาน",
      "สร้าง Candidate Experience ที่อบอุ่น เป็นมืออาชีพ และโปร่งใส",
    ],
    qualifications: [
      "ประสบการณ์ Technical Recruiter หรือ Talent Acquisition 2–4 ปี",
      "เข้าใจ Tech Stack, ตำแหน่งงานด้านไอที และตลาดแรงงานสายเทคในไทย",
      "มีทักษะการเจรจาต่อรองและการสร้างความสัมพันธ์ที่ดี",
    ],
    benefits: [
      "สนับสนุนค่าอบรมและสอบใบรับรอง HR / Tech Recruiting",
      "Incentive ตามการปิดตำแหน่งงาน",
      "ประกันสุขภาพกลุ่มชั้นนำ",
      "Hybrid Work สัปดาห์ละ 2-3 วัน",
    ],
  },
  "people-canva-hrbp": {
    overview:
      "ทำงานร่วมกับผู้นำทีมในฐานะ People & Culture Partner ขับเคลื่อนวัฒนธรรมองค์กรที่เปิดกว้าง ดูแล Employee Engagement และพัฒนาศักยภาพของพนักงานตามค่านิยมของ Canva",
    responsibilities: [
      "เป็นที่ปรึกษาด้านการบริหารคน การประเมินผลงาน และการวางแผนกำลังคน",
      "ขับเคลื่อนโปรแกรม Diversity, Equity & Inclusion (DEI) ภายในองค์กร",
      "โค้ชผู้นำทีมในการให้ Feedback และการแก้ไขข้อขัดแย้งในทีม",
      "ออกแบบและวิเคราะห์แบบสำรวจความผูกพันของพนักงาน (Engagement Survey)",
    ],
    qualifications: [
      "ประสบการณ์ HR Business Partner หรือ People Operations 3–6 ปี",
      "เข้าใจ Modern People Practices ในบริษัท Tech / Creative",
      "มีทักษะ Empathy, Active Listening และการแก้ปัญหาเชิงสร้างสรรค์",
    ],
    benefits: [
      "Canva Pro ฟรีและสวัสดิการ Home Office",
      "งบดูแลสุขภาพจิตและ Wellbeing",
      "โอกาสเติบโตในสายงานระดับสากล",
      "บรรยากาศการทำงานที่สนับสนุนซึ่งกันและกัน",
    ],
  },
  "people-spark-coach": {
    overview:
      "ออกแบบและส่งมอบโปรแกรมพัฒนาทักษะสายเทคโนโลยี (Bootcamps & Mentorship) เพื่อช่วยให้คนรุ่นใหม่และผู้ที่ต้องการย้ายสายงานประสบความสำเร็จในอาชีพดิจิทัล",
    responsibilities: [
      "ออกแบบ Curriculum การเรียนรู้และเวิร์กช็อปร่วมกับ Tech Experts",
      "บริหารจัดการโครงการ Mentorship และจับคู่ผู้เรียนกับพี่เลี้ยงในวงการ",
      "จัดกิจกรรม Hackathon, Portfolio Clinic และ Mock Interview Sessions",
      "ติดตามและประเมินผลสัมฤทธิ์การได้งานของผู้เรียนในโครงการ",
    ],
    qualifications: [
      "ประสบการณ์ Learning & Development หรือ Tech Education 2 ปีขึ้นไป",
      "มีใจรักในการสอนและพัฒนาคน มีทักษะ Facilitation ที่ยอดเยี่ยม",
      "เข้าใจความต้องการของตลาดแรงงานสายเทคยุคใหม่",
    ],
    benefits: [
      "เข้าร่วมคอร์สและอีเวนต์สายเทคฟรีทั้งหมด",
      "งบซื้อหนังสือและคอร์สออนไลน์ระดับสากล",
      "เวลาทำงานยืดหยุ่น",
      "เครือข่ายคนในวงการเทคโนโลยีชั้นนำ",
    ],
  },
  "people-jobthai-er": {
    overview:
      "บริหารจัดการงาน People Operations และสร้างบรรยากาศการทำงานที่ดีให้กับพนักงาน JobThai ดูแลสิทธิประโยชน์ แรงงานสัมพันธ์ และสุขภาวะของพนักงาน",
    responsibilities: [
      "ดูแลกระบวนการ Onboarding พนักงานใหม่และจัดเตรียมเอกสารสัญญาจ้าง",
      "บริหารจัดการสวัสดิการ ประกันสุขภาพ และการลาของพนักงาน",
      "จัดกิจกรรม Employee Engagement และส่งเสริมสุขภาวะในที่ทำงาน",
      "ให้คำปรึกษาแก่พนักงานเกี่ยวกับนโยบายองค์กรและกฎหมายแรงงาน",
    ],
    qualifications: [
      "ประสบการณ์ HR Operations หรือ Employee Relations 1–3 ปี",
      "เข้าใจกฎหมายแรงงานและระเบียบการจ้างงานเบื้องต้น",
      "มีความละเอียดรอบคอบ และรักษาความลับของข้อมูลได้เป็นเลิศ",
    ],
    benefits: [
      "Hybrid Work สัปดาห์ละ 2-3 วัน",
      "ประกันสุขภาพกลุ่มครอบคลุม OPD/IPD",
      "โบนัสประจำปีและเงินช่วยเหลือพิเศษ",
      "บรรยากาศการทำงานที่มั่นคงและอบอุ่น",
    ],
  },

  // Operations (4)
  "ops-muvmi-fleet": {
    overview:
      "บริหารจัดการฝูงรถตุ๊กตุ๊กไฟฟ้า (EV Fleet) ประจำจุดบริการในกรุงเทพฯ ดูแลสถานีชาร์จ การบำรุงรักษา และการจัดกะคนขับ เพื่อส่งมอบบริการที่ปลอดภัยและตรงเวลา",
    responsibilities: [
      "วางแผนและควบคุมการกระจายรถ EV ให้สอดคล้องกับ Demand ของผู้โดยสาร",
      "ติดตาม SLA เวลาในการรอรถ และประสิทธิภาพการเดินทางผ่าน Dashboard",
      "ประสานงานทีมช่างและคนขับเมื่อเกิดเหตุขัดข้องบนท้องถนน",
      "ปรับปรุงมาตรฐานความปลอดภัยและขั้นตอนการทำงานของทีมปฏิบัติการ",
    ],
    qualifications: [
      "ประสบการณ์ Fleet Operations, Logistics หรือ On-site Operations 2–4 ปี",
      "สามารถแก้ไขปัญหาเฉพาะหน้าได้อย่างรวดเร็วและใจเย็น",
      "ใช้ข้อมูลในการวางแผนและจัดสรรทรัพยากรได้อย่างมีประสิทธิภาพ",
    ],
    benefits: [
      "สิทธิ์นั่ง MuvMi เดินทางในกรุงเทพฯ ฟรี",
      "กองทุนสนับสนุนการเดินทางด้วยพลังงานสะอาด",
      "ค่าตอบแทนและเบี้ยเลี้ยงตามหน้าที่",
      "ประกันอุบัติเหตุและสุขภาพกลุ่ม",
    ],
  },
  "ops-if-supply": {
    overview:
      "บริหารจัดการกระบวนการซัพพลายเชน คลังสินค้า และการขนส่งสินค้าเครื่องดื่ม IF สำหรับส่งออกไปยังกว่า 30 ประเทศทั่วโลก ให้ตรงตามเวลาและมาตรฐานคุณภาพสากล",
    responsibilities: [
      "วางแผนความต้องการสินค้า (Demand Planning) และประสานงานโรงงานผลิต",
      "บริหารจัดการพื้นที่คลังสินค้า และควบคุมการเบิกจ่ายสินค้าให้มีประสิทธิภาพ",
      "ประสานงานบริษัทขนส่ง (Freight Forwarders) และสายการเดินเรือ",
      "ควบคุมต้นทุนโลจิสติกส์และลดความสูญเสียในกระบวนการจัดเก็บ",
    ],
    qualifications: [
      "ประสบการณ์ Supply Chain, Logistics หรือ Warehouse Management ใน FMCG 3–5 ปี",
      "เข้าใจพิธีการส่งออก เอกสาร Bill of Lading และมาตรฐานการขนส่งอาหาร",
      "มีความสามารถในการเจรจาต่อรองและบริหารจัดการหลายโครงการพร้อมกัน",
    ],
    benefits: [
      "เครื่องดื่ม IF ดื่มฟรีไม่อั้น",
      "โบนัสตามผลประกอบการประจำปี",
      "ประกันสุขภาพและประกันอุบัติเหตุ",
      "โอกาสเติบโตในธุรกิจส่งออกระดับโลก",
    ],
  },
  "ops-lineman-cs": {
    overview:
      "นำทีม Customer Operations เพื่อส่งมอบการแก้ไขปัญหาที่รวดเร็วและเป็นธรรมแก่ผู้ใช้งาน ร้านอาหาร และไรเดอร์ พร้อมปรับปรุงกระบวนการเพื่อลดปัญหาซ้ำซ้อน",
    responsibilities: [
      "ติดตามและควบคุม SLA, CSAT และ First Contact Resolution (FCR)",
      "วิเคราะห์ Root Cause ของปัญหาที่เกิดขึ้นบ่อย และประสานทีม Product เพื่อแก้ไข",
      "พัฒนาคู่มือการปฏิบัติงาน (Standard Operating Procedures - SOP) สำหรับทีม Support",
      "โค้ชและพัฒนาศักยภาพของทีมงานบริการลูกค้า",
    ],
    qualifications: [
      "ประสบการณ์ Customer Operations หรือ Contact Center Management 3 ปีขึ้นไป",
      "มีทักษะการวิเคราะห์ข้อมูลเพื่อยกระดับกระบวนการบริการ",
      "มีความเห็นอกเห็นใจ (Empathy) และสามารถสื่อสารคลี่คลายสถานการณ์ตึงเครียดได้",
    ],
    benefits: [
      "LINE MAN Credit สำหรับสั่งอาหาร",
      "โบนัสตามผลงานและการรักษาคุณภาพ",
      "อาหารกลางวันและเครื่องดื่มฟรีที่ออฟฟิศ",
      "เวลาทำงานยืดหยุ่น & Hybrid work",
    ],
  },
  "ops-julian-spa": {
    overview:
      "ดูแลการบริหารจัดการภาพรวมของ Julian's The Spa เพื่อรักษามาตรฐานการบริการระดับ 5 ดาว ควบคุมสต็อกผลิตภัณฑ์ออร์แกนิก และสร้างความประทับใจสูงสุดแก่ผู้รับบริการ",
    responsibilities: [
      "ควบคุมดูแลมาตรฐานการต้อนรับและการทำทรีตเมนต์ของทีม Therapist",
      "บริหารตารางนัดหมายและการจัดกะการทำงานของพนักงานให้ราบรื่น",
      "จัดการสต็อกผลิตภัณฑ์ออร์แกนิกและอุปกรณ์สปาให้มีความพร้อมเสมอ",
      "ดูแลแก้ไขปัญหาเฉพาะหน้าและรับฟังคำติชมของลูกค้าคนสำคัญ",
    ],
    qualifications: [
      "ประสบการณ์บริหารงาน Spa, Hospitality หรือ Luxury Wellness 2–5 ปี",
      "มีความประณีต บุคลิกภาพดีเยี่ยม และมีจิตบริการระดับสูง",
      "มีทักษะการบริหารทีมงานและการควบคุมคุณภาพ",
    ],
    benefits: [
      "สิทธิ์ใช้บริการสปาทรีตเมนต์ฟรีทุกเดือน",
      "ส่วนลดผลิตภัณฑ์บำรุงผิวออร์แกนิก",
      "เครื่องแบบและอาหารประจำกะ",
      "โบนัสและการปรับเงินเดือนประจำปี",
    ],
  },
};

function scoreFor(job: Job, claims: string) {
  const normalized = claims.toLowerCase();
  const matched = job.skills.filter((skill) => normalized.includes(skill.toLowerCase()));
  const coverage = Math.round((matched.length / job.skills.length) * 100);
  const evidence = /ปี|%|โปรเจกต์|project|เคย|ผลลัพธ์|ลด|เพิ่ม|ms|latency|api|system|client|scale/i.test(normalized)
    ? 85
    : 50;
  return {
    matched,
    missing: job.skills.filter((skill) => !matched.includes(skill)),
    score: Math.round(coverage * 0.65 + evidence * 0.35),
    evidence,
  };
}

function shuffleDeterministic<T>(array: T[], seed: number): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = (seed * 11 + i * 17 + 5) % (i + 1);
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

function generateSmartFallbackAssessment(job: Job, claimsText: string): AssessmentQuestion[] {
  const skillList = job.skills;
  const rawTemplates = [
    {
      skillIdx: 0,
      q: `ในสถานการณ์ที่ระบบต้องการความเสถียรสูงสุดขณะใช้งาน ${skillList[0]} สำหรับงาน ${job.title} ข้อใดคือแนวทางจัดการที่ถูกต้องตาม Best Practice?`,
      correct: `ออกแบบโครงสร้างให้แยกส่วน (Decoupled), มี Circuit Breaker และรองรับ Graceful Degradation`,
      d1: `รวมการทำงานทั้งหมดไว้ใน Process เดียวเพื่อลด Network Overhead ทั้งหมด`,
      d2: `ปิดการตรวจสอบ Error และ Validation ชั่วคราวในช่วงที่มี Traffic สูงเพื่อประหยัด CPU`,
      d3: `ตั้งค่า Timeout ของการเชื่อมต่อให้ยาวขึ้นเรื่อยๆ เมื่อระบบปลายทางเริ่มตอบสนองช้า`,
      exp: `การแยกส่วนระบบและการใช้ Circuit Breaker ช่วยป้องกัน Cascading Failure เมื่อเกิดปัญหาใน Service ใด Service หนึ่ง`,
    },
    {
      skillIdx: 1 % skillList.length,
      q: `หากตรวจพบปัญหาคอขวด (Bottleneck) หรือความล่าช้าในการประมวลผลที่เกี่ยวข้องกับ ${skillList[1 % skillList.length]} ควรเริ่มแก้ไขที่จุดใดเป็นอันดับแรก?`,
      correct: `รวบรวม Telemetry และ Profiling Data เพื่อระบุ Root Cause ที่แท้จริงก่อนลงมือ Optimize`,
      d1: `เพิ่มสเปกฮาร์ดแวร์เซิร์ฟเวอร์ (Vertical Scaling) สูงสุดทันทีโดยไม่ต้องตรวจ Log`,
      d2: `ล้างฐานข้อมูลและแคชทั้งหมดออกจากระบบเพื่อให้เริ่มประมวลผลใหม่จากศูนย์`,
      d3: `เปลี่ยนภาษาการเขียนโปรแกรมหรือเฟรมเวิร์กของระบบใหม่ทั้งหมดทันที`,
      exp: `การวัดผลด้วย Profiler และ Metrics ที่ชัดเจนเป็นก้าวแรกที่สำคัญที่สุดในการแก้ปัญหา Performance อย่างแม่นยำ`,
    },
    {
      skillIdx: 2 % skillList.length,
      q: `เมื่อต้องรักษาความปลอดภัยและความถูกต้องของข้อมูลที่เกี่ยวกับ ${skillList[2 % skillList.length]} ข้อใดเป็นการปฏิบัติตามหลัก Least Privilege?`,
      correct: `จำกัดสิทธิ์การเข้าถึงเฉพาะ Resource และ Action ที่จำเป็นต่อบทบาทการทำงานเท่านั้น`,
      d1: `ให้สิทธิ์ระดับ Root/Superadmin แก่ทุกคนในทีมพัฒนาเพื่อความรวดเร็วในการ Debug งาน`,
      d2: `จัดเก็บ API Keys และ Database Passwords ไว้ในไฟล์ Config สาธารณะใน Git Repository`,
      d3: `ปิดการบันทึก Audit Logging เพื่อประหยัดพื้นที่จัดเก็บข้อมูลและลด I/O Overhead`,
      exp: `หลักการ Least Privilege กำหนดให้ผู้ใช้และเซอร์วิสมีสิทธิ์เฉพาะที่จำเป็นต่องานเท่านั้น เพื่อจำกัดผลกระทบหากเกิดการรั่วไหล`,
    },
    {
      skillIdx: 3 % skillList.length,
      q: `ในการทดสอบและยืนยันคุณภาพที่เชื่อมโยงกับ ${skillList[3 % skillList.length]} ข้อใดแสดงถึงกลยุทธ์การทดสอบที่มีประสิทธิภาพสูงสุด?`,
      correct: `สร้าง Automated Regression Suite พร้อม Mock External Dependencies ในระดับที่เหมาะสม`,
      d1: `พึ่งพาเฉพาะการทดสอบด้วยมือ (Manual Testing) ในวันสุดท้ายก่อนขึ้น Production`,
      d2: `เขียนเทสเฉพาะ Happy Path กรณีเดียวและละเว้น Edge Cases และ Error Cases ทั้งหมด`,
      d3: `รัน Automated Tests เฉพาะเมื่อผู้ใช้งานจริงรายงานปัญหาความผิดพลาดเข้ามา`,
      exp: `Automated Regression Testing ช่วยให้สามารถส่งมอบงานได้อย่างต่อเนื่องและมั่นใจโดยไม่กระทบฟีเจอร์เดิม`,
    },
    {
      skillIdx: 4 % skillList.length,
      q: `หากต้องตัดสินใจเลือก Trade-off ระหว่างความเร็วในการส่งมอบงาน (Speed) และความยั่งยืนของระบบ (Maintainability) ในบริบท ${job.title} ข้อใดเหมาะสมที่สุด?`,
      correct: `กำหนด Minimal Viable Architecture ที่มี Clean Interfaces พร้อมบันทึก Technical Debt ที่ต้องแก้ไข`,
      d1: `ละทิ้งเอกสารประกอบ (Documentation) และ Unit Tests ทั้งหมดเพื่อให้ทัน Deadline`,
      d2: `ออกแบบสถาปัตยกรรมแบบ Over-engineered ซับซ้อนเกินความจำเป็นจริงโดยไม่คำนึงถึงกรอบเวลาเปิดตัว`,
      d3: `ไม่แจ้งข้อจำกัดทางเทคนิคและผลกระทบระยะยาวให้ฝ่ายธุรกิจและผู้มีส่วนได้ส่วนเสียรับทราบ`,
      exp: `การส่งมอบที่มีประสิทธิภาพต้องสร้างรากฐานที่สะอาด มี Documentation และจัดการ Technical Debt อย่างโปร่งใส`,
    },
    {
      skillIdx: 0,
      q: `ผู้สมัครระบุว่าเคยปรับปรุงระบบจนได้ผลลัพธ์ที่ดีขึ้น ข้อใดคือวิธีตรวจสอบความถูกต้องของการวัดผล (Measurement Validation)?`,
      correct: `เปรียบเทียบ Baseline ก่อนและหลังการปรับปรุงด้วยเครื่องมือวัดผลแบบเดียวกันในสภาพแวดล้อมจริง`,
      d1: `ประเมินความเร็วและความลื่นไหลด้วยความรู้สึกส่วนบุคคลของผู้พัฒนา`,
      d2: `วัดผลเพียงครั้งเดียวทันทีหลัง Deploy โดยไม่สังเกตพฤติกรรมและความเปลี่ยนแปลงในระยะยาว`,
      d3: `อ้างอิงเฉพาะค่าตัวเลขที่วัดได้บนเครื่องคอมพิวเตอร์ Local ของผู้พัฒนาเท่านั้น`,
      exp: `การวัดผลที่น่าเชื่อถือต้องเทียบกับ Baseline ที่ชัดเจนและใช้เครื่องมือที่ได้มาตรฐานในสภาพแวดล้อมการใช้งานจริง`,
    },
    {
      skillIdx: 1 % skillList.length,
      q: `ในการรับมือกับความผิดพลาดของระบบภายนอก (Third-party Dependency Failure) ข้อใดคือวิธีการสร้าง Resilience ที่ดีที่สุด?`,
      correct: `ใช้ Retry Mechanism แบบ Exponential Backoff ร่วมกับ Fallback Response ที่ปลอดภัย`,
      d1: `ยิงคำขอซ้ำๆ ทันทีแบบ Infinite Loop รัวๆ จนกว่าระบบปลายทางจะยอมตอบกลับ`,
      d2: `ปล่อยให้ Application หยุดทำงาน (Crash) ทันทีเพื่อให้ระบบ Monitoring แจ้งเตือน`,
      d3: `ไม่ดักจับ Exception และปล่อยให้ผู้ใช้งานเห็นหน้าต่าง Error Stack Trace แบบดิบ`,
      exp: `Exponential Backoff ป้องกันไม่ให้เกิด Thundering Herd Problem และ Fallback ช่วยให้ผู้ใช้ยังสามารถใช้งานระบบส่วนอื่นได้`,
    },
    {
      skillIdx: 2 % skillList.length,
      q: `เมื่อต้องทำงานร่วมกับ Stakeholders หลากหลายฝ่ายในโครงการ ${job.title} ข้อใดช่วยลดความเข้าใจคลาดเคลื่อนได้ดีที่สุด?`,
      correct: `จัดทำ Service Level Agreement (SLA) และ Data Contract ที่มีนิยามชัดเจนและตรวจสอบได้`,
      d1: `ใช้การพูดคุยปากเปล่าโดยไม่มีบันทึกหรือข้อตกลงที่เป็นลายลักษณ์อักษร`,
      d2: `ปรับเปลี่ยนข้อกำหนดระหว่างทางตามใจชอบโดยไม่ต้องสื่อสารให้ทีมที่เกี่ยวข้องทราบ`,
      d3: `คาดเดาความต้องการของระบบเองทั้งหมดโดยไม่สอบถามความคิดเห็นจากผู้ใช้งานจริง`,
      exp: `Data Contracts และ SLAs ที่เป็นลายลักษณ์อักษรช่วยให้ทีมทำงานประสานกันได้อย่างราบรื่นและลดข้อผิดพลาดในการเชื่อมต่อ`,
    },
    {
      skillIdx: 3 % skillList.length,
      q: `ข้อใดคือสัญญาณเตือน (Red Flag) ที่บ่งบอกว่ากระบวนการทำงานหรือสถาปัตยกรรมกำลังสูญเสียความสามารถในการดูแลรักษา (Loss of Maintainability)?`,
      correct: `การแก้ไข Code เพียงจุดเดียวส่งผลกระทบให้เกิด Bug ที่คาดไม่ถึงในจุดอื่นๆ ของระบบอย่างต่อเนื่อง`,
      d1: `มีการทำ Code Review อย่างเข้มงวดและมีระบบ Automated Linting ตรวจสอบสไตล์โค้ด`,
      d2: `มี Coverage ของ Unit Tests ครอบคลุมฟังก์ชันการทำงานหลักของระบบอย่างครบถ้วน`,
      d3: `มีการวางแผนและลงมือทำ Refactoring โค้ดเก่าอย่างเป็นระบบสม่ำเสมอ`,
      exp: `Tightly-coupled code และการขาด encapsulation มักทำให้การแก้ไขจุดหนึ่งกระทบจุดอื่นโดยไม่ตั้งใจ (Regression)`,
    },
    {
      skillIdx: 4 % skillList.length,
      q: `เพื่อเตรียมความพร้อมสำหรับ Scaling ในอนาคตของตำแหน่ง ${job.title} ข้อใดคือขั้นตอนการวางแผนเชิงรุก (Proactive Planning)?`,
      correct: `ทำ Capacity Planning, กำหนด Auto-scaling Policies และจำลอง Load Test เสมือนจริง`,
      d1: `รอให้เซิร์ฟเวอร์ล่มจากปริมาณผู้ใช้งานมหาศาลก่อนแล้วค่อยสั่งซื้ออุปกรณ์เพิ่มเติมฉุกเฉิน`,
      d2: `ปิดกั้นไม่ให้ผู้ใช้งานใหม่สามารถลงทะเบียนเข้าใช้งานระบบเพื่อลดภาระงาน`,
      d3: `ปิดระบบเพื่อซ่อมบำรุงทุกครั้งที่มีผู้ใช้งานพร้อมกันเกินเกณฑ์ปกติโดยไม่แจ้งล่วงหน้า`,
      exp: `การทำ Load Testing และวาง Capacity Planning ล่วงหน้าช่วยให้ระบบรองรับการเติบโตของธุรกิจได้อย่างราบรื่น`,
    },
  ];

  const mcqQuestions: AssessmentQuestion[] = rawTemplates.map((tpl, i) => {
    const rawChoices = [
      { text: tpl.correct, isCorrect: true },
      { text: tpl.d1, isCorrect: false },
      { text: tpl.d2, isCorrect: false },
      { text: tpl.d3, isCorrect: false },
    ];
    // Shuffle deterministic based on index and job title
    const shuffled = shuffleDeterministic(rawChoices, i * 7 + job.title.length + 3);
    const options = shuffled.map((c) => c.text) as [string, string, string, string];
    const correctIndex = shuffled.findIndex((c) => c.isCorrect);

    return {
      id: `smart-scenario-${i + 1}`,
      type: "multiple_choice",
      skill: skillList[tpl.skillIdx] ?? job.skills[0]!,
      question: tpl.q,
      options,
      correctIndex: correctIndex >= 0 ? correctIndex : 0,
      explanation: tpl.exp,
    };
  });

  const subjectiveQuestion: AssessmentQuestion = {
    id: `smart-scenario-11-subjective`,
    type: "subjective",
    skill: skillList[0] ?? job.skills[0]!,
    question: `[ข้อเขียนอัตนัย] ในการทำงานจริงสำหรับตำแหน่ง ${job.title} หากทีมต้องเผชิญกับสถานการณ์ฉุกเฉินหรือความท้าทายด้าน ${skillList[0] || "การทำงาน"} คุณจะมีลำดับขั้นตอนการวิเคราะห์ปัญหา การสื่อสารกับทีม และแนวทางการแก้ไขอย่างไร?`,
    explanation: "ประเมินวิธีคิดเชิงตรรกะ ทักษะการสื่อสาร และการแก้ปัญหาเฉพาะหน้า เพื่อประกอบการตัดสินใจสัมภาษณ์ของ HR",
    placeholder: "พิมพ์อธิบายลำดับขั้นตอนการวิเคราะห์ปัญหา แนวทางการแก้ปัญหา และข้อควรระวังในมุมมองของคุณ...",
  };

  return [...mcqQuestions, subjectiveQuestion];
}

export function RecruiterDemoPage() {
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"Tech" | "Business" | "People" | "Operations" | "">("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedCompanyForModal, setSelectedCompanyForModal] = useState<Company | null>(null);
  const [query, setQuery] = useState("");
  const [fileName, setFileName] = useState("");
  const [claims, setClaims] = useState("");
  const [editClaimsOpen, setEditClaimsOpen] = useState(false);
  const [claimsDraft, setClaimsDraft] = useState("");
  const [stage, setStage] = useState<"intake" | "assessment" | "interview" | "decision">("intake");
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [subjectiveAnswer, setSubjectiveAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiLoadingLabel, setAiLoadingLabel] = useState("");
  const [aiLiveLog, setAiLiveLog] = useState("");
  const [apiNote, setApiNote] = useState("");
  const [showAnalysisConfirm, setShowAnalysisConfirm] = useState(false);

  // Stage 2: 15-Minute Assessment Modal State (One Question at a Time)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(900); // 15 minutes = 900s
  const [timerExpired, setTimerExpired] = useState(false);
  const [agreeAssessmentRules, setAgreeAssessmentRules] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [proctoringLogs, setProctoringLogs] = useState<
    Array<{
      id: string;
      timestamp: string;
      questionNumber: number;
      timeRemaining: number;
      message: string;
    }>
  >([]);
  const [showTabWarningModal, setShowTabWarningModal] = useState(false);
  const questionCardRef = useRef<HTMLDivElement>(null);

  // Stage 4: Decision Arena State
  const [decisionTurn, setDecisionTurn] = useState<"candidate" | "recruiter" | "revealed">("candidate");
  const [recruiterDecision, setRecruiterDecision] = useState<"APPROVE" | "REJECT" | null>(null);
  const [candidateDecision, setCandidateDecision] = useState<"APPROVE" | "REJECT" | null>(null);

  // Candidate Final Contact Submission (Mutual Match)
  const [candidateContact, setCandidateContact] = useState<{
    fullName: string;
    email: string;
    phone: string;
    note: string;
  }>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });
  const [isContactSubmitted, setIsContactSubmitted] = useState(false);
  const [submittedContactData, setSubmittedContactData] = useState<{
    fullName: string;
    email: string;
    phone: string;
    note: string;
    submittedAt: string;
  } | null>(null);
  const [contactSubmitError, setContactSubmitError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const jdPanelRef = useRef<HTMLElement>(null);
  const candidateCardRef = useRef<HTMLDivElement>(null);
  const recruiterCardRef = useRef<HTMLDivElement>(null);
  const reflectionSectionRef = useRef<HTMLElement>(null);

  const selectedJob = useMemo(() => jobs.find((job) => job.id === selectedJobId) ?? jobs[0]!, [selectedJobId]);
  const selectedCompany = useMemo(
    () => sponsorCompanies[selectedJob.companyId] ?? sponsorCompanies.microsoft!,
    [selectedJob],
  );
  const analysis = useMemo(() => scoreFor(selectedJob, claims), [selectedJob, claims]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchCat = !selectedCategory || job.category === selectedCategory;
      const company = sponsorCompanies[job.companyId];
      const matchQuery =
        !query ||
        `${job.title} ${job.department} ${company?.name ?? ""} ${job.skills.join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, query]);

  const mcqQuestions = useMemo(() => questions.filter((q) => q.type !== "subjective"), [questions]);
  const mcqAnsweredCount = answers.slice(0, mcqQuestions.length).filter((answer) => answer !== undefined).length;
  const isSubjectiveAnswered = subjectiveAnswer.trim().length > 0;
  const hasSubjective = questions.some((q) => q.type === "subjective");
  const completedAnswers = mcqAnsweredCount + (hasSubjective && isSubjectiveAnswered ? 1 : 0);
  const correctAnswers = mcqQuestions.filter((question, index) => answers[index] === question.correctIndex).length;
  const knowledgeScore = mcqQuestions.length ? Math.round((correctAnswers / mcqQuestions.length) * 100) : 0;
  const finalScore = Math.round(analysis.score * 0.55 + knowledgeScore * 0.45);

  // Categorized Competency Analytics for Interactive Infographics
  const competencyData = useMemo(() => {
    const mcqs = questions.filter((q) => q.type !== "subjective");
    
    const getDimScore = (startIndex: number, defaultOffset = 0) => {
      const subset = mcqs.filter((_, i) => i % 4 === startIndex);
      if (subset.length === 0) return Math.min(100, Math.max(50, finalScore + defaultOffset));
      const correct = subset.filter((q) => {
        const originalIdx = questions.indexOf(q);
        return answers[originalIdx] === q.correctIndex;
      }).length;
      return Math.round((correct / subset.length) * 100);
    };

    const d1Score = getDimScore(0, 5);
    const d2Score = getDimScore(1, -3);
    const d3Score = analysis.score;
    const d4Score = Math.min(100, Math.round((d1Score * 0.4 + d2Score * 0.3 + (tabSwitchCount === 0 ? 100 : 70) * 0.3)));

    const dimensions = [
      {
        id: "architecture",
        title: "สถาปัตยกรรม & เทคโนโลยีหลัก",
        subtitle: "Architecture, Systems & Core Stack",
        score: d1Score,
        color: "#10b981", // Emerald Neon
        badge: d1Score >= 80 ? "⭐ Mastery (ชำนาญการ)" : d1Score >= 60 ? "✓ Competent (ผ่านเกณฑ์)" : "📈 Needs Review (ควรพัฒนา)",
        insight: d1Score >= 75 ? "เข้าใจโครงสร้างระบบและสถาปัตยกรรมได้อย่างถูกต้องแม่นยำ" : "ควรทบทวนแนวทางการจัดการ State และโครงสร้าง Scalability เพิ่มเติม",
      },
      {
        id: "problem_solving",
        title: "การแก้ปัญหา & กู้วิกฤตหน้างาน",
        subtitle: "Incident Handling & Diagnostics",
        score: d2Score,
        color: "#38bdf8", // Sky Blue
        badge: d2Score >= 80 ? "⭐ High Precision (เฉียบคม)" : d2Score >= 60 ? "✓ Strong (แก้ปัญหาได้ดี)" : "📈 Needs Review (ควรพัฒนา)",
        insight: d2Score >= 75 ? "วิเคราะห์ Root Cause และตัดสินใจแก้ปัญหาเฉพาะหน้าได้เฉียบคม" : "แนะนำให้ศึกษา Trade-off ของ Edge Cases และ Latency Optimization",
      },
      {
        id: "domain_tools",
        title: "เครื่องมือเฉพาะทาง & ความตรงสเปก JD",
        subtitle: "Domain Tooling & Job Requirements",
        score: d3Score,
        color: "#a855f7", // Purple Neon
        badge: d3Score >= 70 ? "🎯 High Match (ตรงสเปก)" : "✓ Moderate Fit (สอดคล้อง)",
        insight: `ตรงเป้าหมายสเปกงาน ${analysis.matched.length}/${selectedJob.skills.length} ทักษะหลักของ ${selectedCompany.name}`,
      },
      {
        id: "integrity_quality",
        title: "คุณภาพโค้ด & ความโปร่งใส",
        subtitle: "Code Standards, Security & Integrity",
        score: d4Score,
        color: "#f59e0b", // Amber/Gold
        badge: tabSwitchCount === 0 ? "🛡️ 100% Verified (โปร่งใสสมบูรณ์)" : "⚠️ Audited (มีบันทึกตรวจทาน)",
        insight: tabSwitchCount === 0 ? "ผ่านการประเมิน 100% ต่อเนื่องในหน้าจอเดียว ไร้การสลับแท็บ" : `บันทึกประวัติการสลับหน้าจอ ${tabSwitchCount} ครั้งใน Audit Trail`,
      },
    ];

    const grade = finalScore >= 85 ? "A+" : finalScore >= 75 ? "A" : finalScore >= 60 ? "B+" : "B";
    const gradeText = finalScore >= 85 ? "EXCEPTIONAL FIT · ชั้นยอดเยี่ยม" : finalScore >= 70 ? "HIGH POTENTIAL · มีศักยภาพสูง" : "QUALIFIED · ผ่านเกณฑ์มาตรฐาน";

    return {
      dimensions,
      grade,
      gradeText,
    };
  }, [questions, answers, analysis, selectedJob, selectedCompany, finalScore, tabSwitchCount]);

  useEffect(() => {
    if (!loading) return;
    const timer = window.setInterval(
      () =>
        setAiProgress((current) =>
          current >= 92 ? current : Math.min(92, current + Math.max(1, Math.round((92 - current) * 0.12))),
        ),
      260,
    );
    return () => window.clearInterval(timer);
  }, [loading]);

  useEffect(() => {
    if (!selectedJobId || !jdPanelRef.current) return;
    gsap.fromTo(
      jdPanelRef.current,
      { autoAlpha: 0, x: 50, scale: 0.98 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out", clearProps: "transform" },
    );
  }, [selectedJobId]);

  // Stage 2: 10-Minute Timer
  useEffect(() => {
    if (stage !== "assessment") {
      return;
    }
    const interval = window.setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  // Stage 2: Anti-Cheat & Proctoring (Tab Switch & Window Blur Detection)
  useEffect(() => {
    if (stage !== "assessment") {
      return;
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab was hidden / minimized / switched away
        const now = new Date();
        const timeStr = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          setProctoringLogs((logs) => [
            ...logs,
            {
              id: `log-${Date.now()}-${nextCount}`,
              timestamp: timeStr,
              questionNumber: currentQuestionIndex + 1,
              timeRemaining: timerSeconds,
              message: `สลับแท็บ / ย่อหน้าต่างครั้งที่ ${nextCount} ขณะทำข้อที่ ${currentQuestionIndex + 1} (เวลาเหลือ ${formatTimer(timerSeconds)})`,
            },
          ]);
          return nextCount;
        });
      } else {
        // User switched back into the assessment tab -> show warning modal popup
        setShowTabWarningModal(true);
      }
    };

    const handleWindowBlur = () => {
      // Trigger when browser window loses focus (e.g. alt-tab to another application)
      if (!document.hidden) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
        setTabSwitchCount((prev) => {
          const nextCount = prev + 1;
          setProctoringLogs((logs) => [
            ...logs,
            {
              id: `log-${Date.now()}-${nextCount}`,
              timestamp: timeStr,
              questionNumber: currentQuestionIndex + 1,
              timeRemaining: timerSeconds,
              message: `เปลี่ยนโฟกัสไปแอปอื่น (App Switch) ครั้งที่ ${nextCount} ขณะทำข้อที่ ${currentQuestionIndex + 1}`,
            },
          ]);
          return nextCount;
        });
      }
    };

    const handleWindowFocus = () => {
      if (!document.hidden) {
        setShowTabWarningModal(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [stage, currentQuestionIndex, timerSeconds]);

  // Stage 2: GSAP slide animation on question switch
  useEffect(() => {
    if (stage !== "assessment" || !questionCardRef.current) return;
    gsap.fromTo(
      questionCardRef.current,
      { autoAlpha: 0, x: 20 },
      { autoAlpha: 1, x: 0, duration: 0.28, ease: "power2.out" },
    );
  }, [stage, currentQuestionIndex]);

  // Handle stage 4 turn transitions with GSAP
  useEffect(() => {
    if (stage !== "decision") return;
    if (decisionTurn === "candidate" && candidateCardRef.current) {
      gsap.fromTo(
        candidateCardRef.current,
        { autoAlpha: 0, y: 30, scale: 0.95 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" },
      );
    } else if (decisionTurn === "recruiter" && recruiterCardRef.current) {
      gsap.fromTo(
        recruiterCardRef.current,
        { autoAlpha: 0, y: 40, scale: 0.94, rotateY: 15 },
        { autoAlpha: 1, y: 0, scale: 1, rotateY: 0, duration: 0.5, ease: "back.out(1.3)" },
      );
    } else if (decisionTurn === "revealed" && reflectionSectionRef.current) {
      const ctx = gsap.context(() => {
        // Stagger in metric cards and infographics
        gsap.fromTo(
          ".infographic-meter-card, .competency-dimension-card, .reflection-strengths-box, .reflection-growth-box, .reflection-subjective-card, .reflection-integrity-box",
          { autoAlpha: 0, y: 24, scale: 0.98 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.06, ease: "power3.out" },
        );

        // Animate circular meters
        gsap.fromTo(
          ".meter-circle-progress",
          { strokeDashoffset: 283 },
          {
            strokeDashoffset: (i, target) => {
              const val = Number(target.getAttribute("data-value") || 0);
              return 283 - (283 * val) / 100;
            },
            duration: 1.1,
            ease: "power2.out",
          },
        );

        // Animate dimension progress bars
        gsap.fromTo(
          ".dimension-bar-fill",
          { width: "0%" },
          {
            width: (i, target) => target.getAttribute("data-width") || "0%",
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          },
        );
      }, reflectionSectionRef);

      return () => ctx.revert();
    }
  }, [stage, decisionTurn]);

  const finishAiLoading = async () => {
    setAiProgress(100);
    await new Promise((resolve) => window.setTimeout(resolve, 220));
    setLoading(false);
    setAiLoadingLabel("");
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setClaims("");
    if (file.type === "application/pdf") {
      const startTime = Date.now();
      const timeNow = () => new Date().toLocaleTimeString("th-TH");
      setAiProgress(10);
      setAiLoadingLabel("กำลังอ่านและสกัดหลักฐานจาก Resume ด้วย AI");
      setAiLiveLog(`[${timeNow()}] ⚡ อ่านไฟล์ "${file.name}" (${(file.size / 1024).toFixed(1)} KB) พร้อมเข้ารหัส Privacy Shield`);
      setLoading(true);
      try {
        setAiProgress(35);
        setAiLiveLog(`[${timeNow()}] 📤 กำลังส่ง Binary PDF ไปยังระบบ AI Engine...`);
        const result = await analyzeResume(file);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        setAiProgress(92);
        setAiLiveLog(`[${timeNow()}] 📥 สกัดข้อมูลสำเร็จใน ${elapsed}s (ตรวจพบ ${result.skills.length} ทักษะสำคัญ)`);
        setClaims(result.recruiterSummary || result.candidateSummary);
        setApiNote(`✨ AI สกัดหลักฐานจากเรซูเม่สำเร็จใน ${elapsed}s`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "AI API ไม่ตอบสนอง";
        console.error("[Resume Analysis Error]", err);
        setClaims(sampleClaims);
        setAiLiveLog(`[${timeNow()}] ⚠️ AI Error: ${errorMsg} — สลับใช้ชุดข้อมูลสังเคราะห์จำลอง`);
        setApiNote(`⚠️ สลับใช้ข้อความสังเคราะห์จำลอง (${errorMsg})`);
      } finally {
        await finishAiLoading();
      }
    }
  };

  const createAssessment = async () => {
    const startTime = Date.now();
    const timeNow = () => new Date().toLocaleTimeString("th-TH");
    setAiProgress(12);
    setAiLoadingLabel("กำลังประมวลผลผ่าน AI เพื่อสร้างข้อสอบ Scenario 11 ข้อ");
    setAiLiveLog(`[${timeNow()}] ⚡ รวบรวม JD (${selectedJob.title}) และหลักฐานเพื่อออกแบบข้อสอบ...`);
    setLoading(true);
    setApiNote("");
    try {
      setAiProgress(40);
      setAiLiveLog(`[${timeNow()}] 📤 กำลังส่ง Prompt 11 ข้อไปยังระบบ AI Engine...`);
      const items = await generateAssessment({
        jobTitle: selectedJob.title,
        jobSummary: selectedJob.summary,
        requiredSkills: selectedJob.skills,
        resumeEvidence: claims,
      });
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      setAiProgress(95);
      setAiLiveLog(`[${timeNow()}] 📥 AI ออกข้อสอบ 10 ช้อยส์ + 1 อัตนัยเสร็จสมบูรณ์ใน ${elapsed}s (สุ่ม Choice ไร้แพทเทิร์น)`);
      setQuestions(items);
      setAnswers(Array(items.length).fill(undefined));
      setSubjectiveAnswer("");
      setApiNote(`✨ สร้างจาก AI สำเร็จใน ${elapsed}s (Scenario เฉพาะบุคคล 11 ข้อ)`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "AI API ไม่ตอบสนอง";
      console.error("[Assessment Generation Error]", err);
      const fallback = generateSmartFallbackAssessment(selectedJob, claims);
      setAiLiveLog(`[${timeNow()}] ⚠️ AI Error: ${errorMsg} — สลับใช้ชุดข้อสอบ Fallback จำลอง`);
      setQuestions(fallback);
      setAnswers(Array(fallback.length).fill(undefined));
      setSubjectiveAnswer("");
      setApiNote(`⚠️ สลับใช้ Scenario จำลอง (${errorMsg})`);
    } finally {
      await finishAiLoading();
      setShowAnalysisConfirm(true);
    }
  };

  const reset = () => {
    setSelectedJobId("");
    setSelectedCategory("");
    setShowApplicationModal(false);
    setSelectedCompanyForModal(null);
    setFileName("");
    setClaims("");
    setClaimsDraft("");
    setEditClaimsOpen(false);
    setAnswers([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setTimerSeconds(900);
    setTimerExpired(false);
    setRecruiterDecision(null);
    setCandidateDecision(null);
    setDecisionTurn("candidate");
    setCandidateContact({ fullName: "", email: "", phone: "", note: "" });
    setIsContactSubmitted(false);
    setSubmittedContactData(null);
    setContactSubmitError("");
    setStage("intake");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateContact.fullName.trim()) {
      setContactSubmitError("กรุณากรอกชื่อและนามสกุล");
      return;
    }
    if (!candidateContact.email.trim() || !candidateContact.email.includes("@")) {
      setContactSubmitError("กรุณากรอกอีเมลที่ถูกต้อง (เช่น yourname@email.com)");
      return;
    }
    if (!candidateContact.phone.trim() || candidateContact.phone.trim().length < 8) {
      setContactSubmitError("กรุณากรอกเบอร์โทรศัพท์ที่ติดต่อได้ (เช่น 081-234-5678)");
      return;
    }
    setContactSubmitError("");
    setSubmittedContactData({
      fullName: candidateContact.fullName.trim(),
      email: candidateContact.email.trim(),
      phone: candidateContact.phone.trim(),
      note: candidateContact.note.trim(),
      submittedAt: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    });
    setIsContactSubmitted(true);
  };

  // Swiping mechanics for Candidate
  const handleCandidateSwipe = (decision: "APPROVE" | "REJECT") => {
    setCandidateDecision(decision);
    setDecisionTurn("recruiter");

    if (candidateCardRef.current) {
      const cardEl = candidateCardRef.current;
      const targetX = decision === "APPROVE" ? (window.innerWidth > 600 ? 550 : 380) : (window.innerWidth > 600 ? -550 : -380);
      const targetRot = decision === "APPROVE" ? 22 : -22;

      const likeBadge = cardEl.querySelector<HTMLElement>(".swipe-stamp.like");
      const nopeBadge = cardEl.querySelector<HTMLElement>(".swipe-stamp.nope");
      if (decision === "APPROVE" && likeBadge) likeBadge.style.opacity = "1";
      if (decision === "REJECT" && nopeBadge) nopeBadge.style.opacity = "1";

      gsap.to(cardEl, {
        x: targetX,
        rotation: targetRot,
        autoAlpha: 0,
        duration: 0.32,
        ease: "power2.in",
      });
    }
  };

  // Swiping mechanics for Recruiter
  const handleRecruiterSwipe = (decision: "APPROVE" | "REJECT") => {
    setRecruiterDecision(decision);
    setDecisionTurn("revealed");

    if (recruiterCardRef.current) {
      const cardEl = recruiterCardRef.current;
      const targetX = decision === "APPROVE" ? (window.innerWidth > 600 ? 550 : 380) : (window.innerWidth > 600 ? -550 : -380);
      const targetRot = decision === "APPROVE" ? 22 : -22;

      const likeBadge = cardEl.querySelector<HTMLElement>(".swipe-stamp.like");
      const nopeBadge = cardEl.querySelector<HTMLElement>(".swipe-stamp.nope");
      if (decision === "APPROVE" && likeBadge) likeBadge.style.opacity = "1";
      if (decision === "REJECT" && nopeBadge) nopeBadge.style.opacity = "1";

      gsap.to(cardEl, {
        x: targetX,
        rotation: targetRot,
        autoAlpha: 0,
        duration: 0.32,
        ease: "power2.in",
      });
    }
  };


  // Drag tracking ref for high performance touch & pointer dragging
  const dragTracker = useRef<{
    isDragging: boolean;
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    targetEl: HTMLDivElement | null;
    onSwipe: ((decision: "APPROVE" | "REJECT") => void) | null;
  }>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    targetEl: null,
    onSwipe: null,
  });

  const onCardPointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    onSwipe: (decision: "APPROVE" | "REJECT") => void
  ) => {
    if (typeof e.button === "number" && e.button !== 0) return;
    const target = e.currentTarget;
    dragTracker.current = {
      isDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      currentX: 0,
      currentY: 0,
      targetEl: target,
      onSwipe,
    };
    try {
      target.setPointerCapture(e.pointerId);
    } catch (_) {}
    target.style.transition = "none";
    target.style.cursor = "grabbing";
  };

  const onCardPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const dt = dragTracker.current;
    if (!dt.isDragging || !dt.targetEl) return;
    const dx = e.clientX - dt.startX;
    const dy = e.clientY - dt.startY;
    dt.currentX = dx;
    dt.currentY = dy;

    const rot = Math.max(-25, Math.min(25, dx * 0.075));
    dt.targetEl.style.transform = `translate3d(${dx}px, ${dy * 0.25}px, 0) rotate(${rot}deg)`;

    const likeBadge = dt.targetEl.querySelector<HTMLElement>(".swipe-stamp.like");
    const nopeBadge = dt.targetEl.querySelector<HTMLElement>(".swipe-stamp.nope");
    if (likeBadge) {
      likeBadge.style.opacity = String(Math.max(0, Math.min(1, (dx - 15) / 65)));
    }
    if (nopeBadge) {
      nopeBadge.style.opacity = String(Math.max(0, Math.min(1, (-dx - 15) / 65)));
    }
  };

  const onCardPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const dt = dragTracker.current;
    if (!dt.isDragging || !dt.targetEl) return;
    dt.isDragging = false;
    try {
      dt.targetEl.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const dx = Math.abs(dt.currentX) > 0 ? dt.currentX : (typeof e.clientX === "number" && dt.startX ? e.clientX - dt.startX : dt.currentX);
    const cardEl = dt.targetEl;
    cardEl.style.cursor = "grab";

    const SWIPE_THRESHOLD = 85;

    if (dx > SWIPE_THRESHOLD) {
      dt.onSwipe?.("APPROVE");
    } else if (dx < -SWIPE_THRESHOLD) {
      dt.onSwipe?.("REJECT");
    } else {
      gsap.to(cardEl, {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.45,
        ease: "elastic.out(1, 0.45)",
        onComplete: () => {
          cardEl.style.transform = "";
          cardEl.style.transition = "";
        },
      });
      const likeBadge = cardEl.querySelector<HTMLElement>(".swipe-stamp.like");
      const nopeBadge = cardEl.querySelector<HTMLElement>(".swipe-stamp.nope");
      if (likeBadge) likeBadge.style.opacity = "0";
      if (nopeBadge) nopeBadge.style.opacity = "0";
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const details = jobDetails[selectedJob.id] ?? {
    overview: selectedJob.summary,
    responsibilities: [
      `รับผิดชอบงานในส่วน ${selectedJob.department}`,
      `ประยุกต์ใช้ ${selectedJob.skills.join(", ")} เพื่อส่งมอบผลลัพธ์`,
    ],
    qualifications: [`มีประสบการณ์ตรง 2 ปีขึ้นไป`, `สื่อสารและทำงานเป็นทีมได้ดี`],
    benefits: [`สวัสดิการตามมาตรฐานองค์กร`, `Hybrid Work`, `ประกันสุขภาพ`],
  };

  const currentQuestion = questions[currentQuestionIndex] ?? questions[0];

  return (
    <div className="rec-demo-root">
      <a className="skip-link" href="#main-content">
        ข้ามไปเนื้อหาหลัก
      </a>

      {/* Header */}
      <header className="rec-demo-header">
        <div className="rec-demo-brand">
          <span>MM</span>
          <div>
            <strong>MaskedMatch</strong>
            <small>Recruiter Intelligence & Sponsor Jobboard</small>
          </div>
        </div>
        <div className="rec-demo-header-actions">
          <span className="demo-badge">LOCAL SYNTHETIC DEMO</span>
          <button type="button" onClick={reset}>
            <RotateCcw /> เริ่มเดโม่ใหม่
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main id="main-content" className="rec-demo-main">
        {/* Hero Section */}
        <section className="rec-demo-hero">
          <div>
            <span className="eyebrow">Recruiter-only workspace</span>
            <h1>
              ตรวจคนให้ตรงงาน
              <br />
              <em>ด้วยหลักฐาน ไม่ใช่แค่คีย์เวิร์ด</em>
            </h1>
            <p>
              รวบรวมตำแหน่งงานจากสปอนเซอร์ชั้นนำ วิเคราะห์สิ่งที่ผู้สมัครระบุในเรซูเม่ เทียบกับ JD
              และสร้างแบบประเมินสถานการณ์เฉพาะบุคคล (11 ข้อ · 15 นาที) เพื่อยืนยันว่ามีความรู้และทักษะตรงตามที่ระบุจริง
            </p>
          </div>
          <div className="rec-demo-metrics">
            <div>
              <BriefcaseBusiness />
              <strong>{jobs.length}</strong>
              <span>ตำแหน่งพร้อมเดโม่</span>
            </div>
            <div>
              <Building2 />
              <strong>{Object.keys(sponsorCompanies).length}</strong>
              <span>องค์กรและสปอนเซอร์</span>
            </div>
            <div>
              <ShieldCheck />
              <strong>100%</strong>
              <span>ข้อมูลจำลองแบบ Masked</span>
            </div>
          </div>
        </section>

        {/* Sponsor Banner */}
        <section className="rec-sponsor-strip">
          <span className="eyebrow">พันธมิตรและสปอนเซอร์องค์กร</span>
          <div className="sponsor-marquee">
            {Object.values(sponsorCompanies).map((company) => (
              <button
                type="button"
                key={company.id}
                className="sponsor-pill"
                onClick={() => setSelectedCompanyForModal(company)}
              >
                <span className={`company-tag-badge ${company.tone}`}>{company.badge}</span>
                <strong>{company.shortName}</strong>
              </button>
            ))}
          </div>
        </section>

        {/* Step Navigation */}
        <nav className="rec-demo-steps" aria-label="ขั้นตอนการประเมิน">
          {(
            [
              ["intake", "1", "Jobboard & CV Intake"],
              ["assessment", "2", "Quiz Popup (11 ข้อ · 15 นาที)"],
              ["interview", "3", "Masked 8-bit Call"],
              ["decision", "4", "Two-Sided Swipe Decision"],
            ] as const
          ).map(([key, num, label]) => (
            <button key={key} type="button" className={stage === key ? "active" : ""} disabled>
              <span>{num}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Layout Grid */}
        <div className={`rec-demo-layout ${!selectedJobId ? "catalog-only" : ""}`}>
          {/* Job Panel / Catalog */}
          <aside className="rec-job-panel">
            <div className="rec-section-title">
              <div>
                <span className="eyebrow">Job catalog</span>
                <h2>{selectedCategory ? `สายงาน ${selectedCategory}` : "เลือกหมวดหมู่งาน"}</h2>
              </div>
              <span>
                {selectedCategory
                  ? `${filteredJobs.length} ตำแหน่ง`
                  : `${Object.keys(categoryDescriptions).length} หมวดหมู่ (${jobs.length} ตำแหน่ง)`}
              </span>
            </div>

            {!selectedCategory ? (
              <div className="job-category-grid">
                {Object.entries(categoryDescriptions).map(([category, description]) => {
                  const count = jobs.filter((job) => job.category === category).length;
                  return (
                    <button
                      type="button"
                      key={category}
                      onClick={() =>
                        setSelectedCategory(category as "Tech" | "Business" | "People" | "Operations")
                      }
                    >
                      <span className="category-count-badge">{count} ตำแหน่งเปิดรับ</span>
                      <strong>{category}</strong>
                      <p>{description}</p>
                      <ArrowRight />
                    </button>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="rec-job-panel-pinned-top">
                  <div className="category-header-row">
                    <button
                      type="button"
                      className="category-back"
                      onClick={() => {
                        setSelectedCategory("");
                        setSelectedJobId("");
                      }}
                    >
                      ← หมวดหมู่ทั้งหมด
                    </button>
                    <span className="category-active-label">{selectedCategory}</span>
                  </div>

                  <label className="rec-search">
                    <Search />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="ค้นหาตำแหน่ง, ทักษะ หรือชื่อบริษัท..."
                      aria-label="ค้นหาตำแหน่งงาน"
                      style={{
                        background: "transparent",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        color: "#f1f8fc",
                      }}
                    />
                  </label>
                </div>

                <div className="rec-job-list">
                  {filteredJobs.map((job) => {
                    const comp = sponsorCompanies[job.companyId] ?? sponsorCompanies.microsoft!;
                    const isSelected = selectedJobId === job.id;
                    return (
                      <button
                        type="button"
                        key={job.id}
                        className={`rec-job-card-item ${isSelected ? "selected" : ""}`}
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setStage("intake");
                        }}
                      >
                        <div className="job-card-top">
                          <span className={`company-mini-badge ${comp.tone}`}>{comp.shortName}</span>
                          <span className="job-card-salary-badge">{job.salary}</span>
                        </div>
                        <strong className="job-card-title">{job.title}</strong>
                        <div className="job-card-subtitle">
                          <span className="job-comp-name">{comp.name}</span>
                          <span className="job-dept-name">· {job.department}</span>
                        </div>
                        <div className="job-card-skills">
                          {job.skills.slice(0, 3).map((s) => (
                            <span key={s}>{s}</span>
                          ))}
                          {job.skills.length > 3 && <span className="skill-more">+{job.skills.length - 3}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </aside>

          {/* Work Panel */}
          {selectedJobId && (
            <section className="rec-work-panel" ref={jdPanelRef}>
              {/* Job Header Info */}
              <div className="rec-job-detail">
                {/* Showcase Banner for Selected Company with Company Details Button */}
                <div className="job-company-showcase-bar">
                  <div className="showcase-left">
                    <span className={`company-tag-badge ${selectedCompany.tone}`}>{selectedCompany.badge}</span>
                    <div className="showcase-company-info">
                      <strong>{selectedCompany.name}</strong>
                      <span>{selectedCompany.industry} · {selectedCompany.location}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="company-profile-cta-btn"
                    onClick={() => setSelectedCompanyForModal(selectedCompany)}
                    title="ดูข้อมูลองค์กร ค่านิยม วัฒนธรรม และสวัสดิการ"
                  >
                    <Building2 size={15} /> ดูข้อมูลบริษัท & Culture <ChevronRight size={14} />
                  </button>
                </div>

                <div className="job-title-summary-block">
                  <h2>{selectedJob.title}</h2>
                  <p>{selectedJob.summary}</p>
                </div>

                <div className="rec-job-meta">
                  <span>
                    <MapPin size={14} /> {selectedJob.location}
                  </span>
                  <span>{selectedJob.type}</span>
                  <span className="job-dept-tag">{selectedJob.department}</span>
                  <strong>{selectedJob.salary}</strong>
                </div>
              </div>

              {/* Skills required */}
              <div className="rec-skill-row">
                <span className="skill-label-prefix">ทักษะสำคัญ:</span>
                {selectedJob.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              {/* STAGE 1: Intake & Detailed JD */}
              {stage === "intake" && (
                <div className="detailed-jd-content">
                  <section>
                    <span className="eyebrow">เกี่ยวกับตำแหน่งและเป้าหมาย</span>
                    <p>{details.overview}</p>
                  </section>

                  <div className="jd-detail-columns">
                    <section>
                      <h3>หน้าที่ความรับผิดชอบหลัก</h3>
                      <ul>
                        {details.responsibilities.map((item) => (
                          <li key={item}>
                            <Check /> {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section>
                      <h3>คุณสมบัติที่กำลังมองหา</h3>
                      <ul>
                        {details.qualifications.map((item) => (
                          <li key={item}>
                            <Check /> {item}
                          </li>
                        ))}
                      </ul>
                    </section>
                  </div>

                  <section className="jd-benefits">
                    <h3>สวัสดิการและสิ่งที่องค์กรส่งมอบ</h3>
                    <div>
                      {details.benefits.map((item) => (
                        <span key={item}>{item}</span>
                      ))}
                    </div>
                  </section>

                  <div className="jd-interest-bar">
                    <div>
                      <strong>สนใจสมัครหรือทดสอบคัดกรองตำแหน่งนี้?</strong>
                      <span>แนบ Resume เพื่อวิเคราะห์ความสอดคล้องกับ JD และสร้างแบบประเมินเฉพาะตัว</span>
                    </div>
                    <div className="jd-interest-actions">
                      <button
                        type="button"
                        className="rec-secondary"
                        onClick={() => setSelectedCompanyForModal(selectedCompany)}
                      >
                        <Building2 /> ดูวัฒนธรรมองค์กร
                      </button>
                      <button
                        className="rec-primary"
                        type="button"
                        onClick={() => setShowApplicationModal(true)}
                      >
                        แนบเรซูเม่และวิเคราะห์ <ArrowRight />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 2: Interactive 10-Minute Assessment Modal Popup (Focused Fullscreen Dialog) */}
              {stage === "assessment" && (
                <div className="assessment-modal-backdrop top-layer" role="dialog" aria-modal="true" aria-labelledby="assessment-modal-title">
                  <div className="assessment-modal-dialog">
                    {/* TOP PINNED SECTION: Header + Progress Bar + Pinned Question Statement */}
                    <div className="assessment-modal-top-pinned">
                      {/* Top Assessment Header */}
                      <div className="assessment-quiz-header">
                        <div className="quiz-header-titles">
                          <span className="eyebrow">
                            Live Assessment · {selectedJob.title} @ {selectedCompany.shortName}
                          </span>
                          <h3 id="assessment-modal-title">Scenario Skills & Solution Check ({questions.length || 11} ข้อ)</h3>
                          <p>{apiNote || "10 ข้อสถานการณ์ปรนัย + 1 ข้อเขียนอัตนัย ไร้แพทเทิร์น"}</p>
                        </div>

                        <div className="quiz-header-right-badges">
                          {/* Live Anti-Cheat & Proctoring Status */}
                          <div className="quiz-proctor-status-pill">
                            {tabSwitchCount === 0 ? (
                              <span className="proctor-badge clean" title="ระบบ Anti-Cheat กำลังตรวจจับการสลับหน้าจอ (ไม่พบการสลับแท็บ)">
                                <ShieldCheck size={14} /> Anti-Cheat: 100% Verified
                              </span>
                            ) : (
                              <span className="proctor-badge warning" title="ตรวจพบการสลับหน้าต่างและบันทึก Log แล้ว">
                                <AlertTriangle size={14} /> สลับแท็บ {tabSwitchCount} ครั้ง (มีบันทึก Log)
                              </span>
                            )}
                          </div>

                          {/* 10-Minute Live Countdown Timer */}
                          <div
                            className={`quiz-timer-badge ${
                              timerSeconds <= 60
                                ? "timer-critical"
                                : timerSeconds <= 180
                                  ? "timer-warning"
                                  : "timer-normal"
                            }`}
                            role="timer"
                            aria-live="polite"
                          >
                            <Clock size={18} />
                            <div>
                              <span>เวลาที่เหลือ (จาก 15:00 นาที)</span>
                              <strong>{formatTimer(timerSeconds)}</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Progress Tracker Bar */}
                      <div className="quiz-progress-panel">
                        <div className="quiz-progress-stats">
                          <span className="quiz-stat-pill">
                            <strong>ข้อที่ {currentQuestionIndex + 1}</strong> จาก {questions.length || 11} ข้อ
                          </span>
                          <span className="quiz-stat-pill done">
                            <Check size={14} /> ตอบแล้ว <strong>{completedAnswers}</strong> ข้อ
                          </span>
                          <span className="quiz-stat-pill remain">
                            เหลืออีก <strong>{(questions.length || 11) - completedAnswers}</strong> ข้อ
                          </span>
                        </div>

                        <div className="quiz-progress-track-bg">
                          <div
                            className="quiz-progress-track-fill"
                            style={{ width: `${(completedAnswers / (questions.length || 11)) * 100}%` }}
                          />
                        </div>

                        {/* 11 Numbered Jump Pills */}
                        <div className="quiz-jump-pills" aria-label="เลือกลัดไปยังข้อสอบ">
                          {questions.map((q, idx) => {
                            const isSubjective = q.type === "subjective";
                            const isAnswered = isSubjective
                              ? subjectiveAnswer.trim().length > 0
                              : answers[idx] !== undefined;
                            const isCurrent = currentQuestionIndex === idx;
                            return (
                              <button
                                type="button"
                                key={q.id || idx}
                                className={`quiz-jump-btn ${isCurrent ? "current" : ""} ${
                                  isAnswered ? "answered" : ""
                                } ${isSubjective ? "subjective-pill" : ""}`}
                                onClick={() => setCurrentQuestionIndex(idx)}
                                title={`ข้อที่ ${idx + 1}: ${isSubjective ? "ข้อเขียนอัตนัย" : q.skill} (${
                                  isAnswered ? "ตอบแล้ว" : "ยังไม่ได้ตอบ"
                                })`}
                              >
                                <span>{idx + 1}{isSubjective ? " ✍️" : ""}</span>
                                {isAnswered && <Check size={10} className="jump-check-icon" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Pinned Question Statement (โจทย์ที่ตรึงไว้ด้านบนเสมอ) */}
                      {currentQuestion && (
                        <div className="quiz-pinned-question-statement">
                          <div className="single-q-meta">
                            <span className="single-q-number-tag">
                              ข้อที่ {currentQuestionIndex + 1}/{questions.length || 11} {currentQuestion.type === "subjective" ? "· ✍️ ข้อเขียนอัตนัย (พิมพ์ตอบ)" : "· ปรนัย (4 ตัวเลือก)"}
                            </span>
                            <span className="single-q-skill-tag">
                              🎯 ทักษะที่วัด: <strong>{currentQuestion.skill}</strong>
                            </span>
                          </div>

                          <h4 className="single-q-statement">{currentQuestion.question}</h4>
                        </div>
                      )}
                    </div>

                    {/* MIDDLE SCROLLABLE BODY: Only this middle section scrolls! */}
                    <div className="assessment-modal-scrollable-body" ref={questionCardRef}>
                      {/* Timer Expired Warning */}
                      {timerExpired && (
                        <div className="quiz-expired-banner">
                          <ShieldAlert size={20} />
                          <div>
                            <strong>หมดเวลาทำข้อสอบแล้ว (15:00 นาที)!</strong>
                            <p>ระบบได้บันทึกคำตอบทั้งหมดที่คุณได้ทำไว้แล้ว กรุณากดปุ่มด้านล่างเพื่อเข้าสู่ขั้นตอนสัมภาษณ์</p>
                          </div>
                        </div>
                      )}

                      {/* If Subjective Question (Item 11) */}
                      {currentQuestion?.type === "subjective" ? (
                        <div className="quiz-subjective-box">
                          <div className="subjective-tip-banner">
                            <Sparkles size={16} />
                            <span>ข้อนี้เป็นคำถามสถานการณ์ข้อเขียน (อัตนัย) — ไม่มีการตัดคะแนนอัตโนมัติ โดยระบบจะส่งคำตอบของคุณตรงถึง HR / Recruiter เพื่อประกอบการพิจารณาคัดเลือก</span>
                          </div>

                          <div className="subjective-textarea-wrapper">
                            <textarea
                              className="quiz-subjective-textarea"
                              placeholder={currentQuestion.placeholder || "พิมพ์อธิบายลำดับขั้นตอนการวิเคราะห์ปัญหา แนวทางการแก้ปัญหา และข้อควรระวังในมุมมองของคุณ..."}
                              value={subjectiveAnswer}
                              onChange={(e) => setSubjectiveAnswer(e.target.value)}
                              rows={6}
                            />
                            <div className="subjective-meta-row">
                              <span className="subjective-char-count">
                                📝 {subjectiveAnswer.length} ตัวอักษร {subjectiveAnswer.length > 0 ? "· บันทึกคำตอบแล้ว" : "· (พิมพ์สรุปแนวทางหรืออธิบายสั้นๆ ตามความเหมาะสม)"}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* If Multiple-Choice Question (Items 1-10) */
                        currentQuestion && currentQuestion.options && (
                          <div className="single-q-choices-list">
                            {currentQuestion.options.map((option, optIdx) => {
                              const isSelected = answers[currentQuestionIndex] === optIdx;
                              return (
                                <label
                                  key={option}
                                  className={`quiz-choice-card ${isSelected ? "selected" : ""}`}
                                  onClick={() => {
                                    setAnswers((curr) => {
                                      const next = [...curr];
                                      next[currentQuestionIndex] = optIdx;
                                      return next;
                                    });
                                  }}
                                >
                                  <div className="choice-left-group">
                                    <div className="choice-letter-badge">
                                      {String.fromCharCode(65 + optIdx)}
                                    </div>
                                    <div className="choice-text-content">{option}</div>
                                  </div>
                                  <div className="choice-radio-indicator" />
                                  <input
                                    type="radio"
                                    name={`q-${currentQuestionIndex}`}
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="sr-only"
                                  />
                                </label>
                              );
                            })}
                          </div>
                        )
                      )}
                    </div>

                    {/* BOTTOM PINNED FOOTER: Navigation & Submission */}
                    <div className="assessment-modal-bottom-pinned">
                      <div className="quiz-navigation-footer">
                        <button
                          type="button"
                          className="rec-secondary quiz-nav-prev"
                          disabled={currentQuestionIndex === 0}
                          onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                        >
                          <ChevronLeft size={18} /> ข้อก่อนหน้า
                        </button>

                        <div className="quiz-nav-counter">
                          <span>
                            ข้อที่ <strong>{currentQuestionIndex + 1}</strong> / {questions.length || 11}
                          </span>
                        </div>

                        <div className="quiz-nav-right-actions">
                          {currentQuestionIndex < (questions.length || 11) - 1 ? (
                            <button
                              type="button"
                              className="rec-primary quiz-nav-next"
                              onClick={() => setCurrentQuestionIndex((prev) => Math.min((questions.length || 11) - 1, prev + 1))}
                            >
                              ข้อถัดไป <ChevronRight size={18} />
                            </button>
                          ) : (
                            <button
                              className="rec-primary quiz-submit-btn"
                              type="button"
                              disabled={completedAnswers < (mcqQuestions.length || 10) && !timerExpired}
                              onClick={() => setStage("interview")}
                            >
                              <CheckCircle2 size={18} /> ส่งคำตอบและเข้าสัมภาษณ์ Masked ({completedAnswers}/{questions.length || 11}) <ArrowRight size={16} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: Masked 8-bit Video Call */}
              {stage === "interview" && (
                <div className="rec-stage-content">
                  <div className="mock-call-header">
                    <div>
                      <span className="mock-live-dot" /> MOCK INTERVIEW · 08:42
                    </div>
                    <span>Private Room #{selectedJob.id.toUpperCase().slice(0, 6)}</span>
                  </div>

                  <div className="masked-interview mock-video-grid">
                    <figure className="mock-video-participant">
                      <img
                        src="/interview/candidate-cat-video-call.png"
                        alt="ตัวละครแมว 8 บิต ผู้สมัครงาน กำลังวิดีโอคอลจากฉากหลังจำลอง"
                      />
                      <figcaption>
                        <div>
                          <strong>Candidate #7F2A</strong>
                          <span>Cat avatar · Masked feed</span>
                        </div>
                        <span className="mock-audio-bars" aria-label="กำลังพูด">
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      </figcaption>
                      <span className="mock-corner-label">YOU (JOB SEEKER)</span>
                    </figure>

                    <figure className="mock-video-participant recruiter">
                      <img
                        src="/interview/recruiter-fox-video-call.png"
                        alt="ตัวละครจิ้งจอก 8 บิต HR กำลังวิดีโอคอลจากสตูดิโอจำลอง"
                      />
                      <figcaption>
                        <div>
                          <strong>{selectedCompany.shortName} HR Lead</strong>
                          <span>Fox avatar · Masked feed</span>
                        </div>
                        <span className="mock-audio-bars" aria-label="กำลังพูด">
                          <i />
                          <i />
                          <i />
                          <i />
                        </span>
                      </figcaption>
                      <span className="mock-corner-label">HR RECRUITER</span>
                    </figure>
                  </div>

                  <div className="rec-ai-note">
                    <ShieldCheck />
                    <div>
                      <strong>Mock video call — จำลองการสัมภาษณ์แบบปิดบังตัวตน 100%</strong>
                      <p>
                        ตัวละครสัตว์ 8-bit และฉากหลังเสมือนจริงช่วยปกป้องความลับ ข้อมูลส่วนตัว
                        และการตัดสินบนพื้นฐานความสามารถ
                      </p>
                    </div>
                  </div>

                  <div className="interview-bottom-bar">
                    <button
                      type="button"
                      className="rec-secondary"
                      onClick={() => setSelectedCompanyForModal(selectedCompany)}
                    >
                      <Building2 /> ดู Culture บริษัทอีกครั้ง
                    </button>
                    <button
                      className="rec-primary"
                      type="button"
                      onClick={() => {
                        setStage("decision");
                        setDecisionTurn("candidate");
                      }}
                    >
                      <Check /> จบการสนทนาและไปหน้าตัดสินใจ (Swipe Deck) <ArrowRight />
                    </button>
                  </div>
                </div>
              )}

              {/* STAGE 4: Interactive Two-Sided Swipe Arena */}
              {stage === "decision" && (
                <div className="rec-stage-content swipe-arena-section">
                  <div className="rec-stage-heading">
                    <span>
                      <ShieldCheck />
                    </span>
                    <div>
                      <h3>Two-Sided Private Swipe Decision</h3>
                      <p>
                        {decisionTurn === "candidate" &&
                          "ขั้นตอน 1/2: การตัดสินใจฝั่งผู้สมัคร (Job Seeker Turn) — ปัดการ์ดหรือคลิกปุ่ม"}
                        {decisionTurn === "recruiter" &&
                          "ขั้นตอน 2/2: การตัดสินใจฝั่งนายจ้าง (Recruiter Turn) — ประเมินผลและตัดสินใจ"}
                        {decisionTurn === "revealed" && "ผลลัพธ์การตัดสินใจแบบสองฝั่ง (Mutual Reveal Result)"}
                      </p>
                    </div>
                  </div>

                  {/* TURN 1: CANDIDATE SWIPE CARD */}
                  {decisionTurn === "candidate" && (
                    <div className="swipe-arena-container">
                      <div className="swipe-turn-indicator candidate-turn">
                        <UserCheck size={18} />
                        <span>ฝั่งผู้สมัคร (คุณ): สัมภาษณ์กับ {selectedCompany.name} แล้ว สนใจไปต่อหรือไม่?</span>
                      </div>

                      <div className="swipe-card-wrapper">
                        <div
                          className="swipe-card candidate-card"
                          ref={candidateCardRef}
                          onPointerDown={(e) => onCardPointerDown(e, handleCandidateSwipe)}
                          onPointerMove={onCardPointerMove}
                          onPointerUp={onCardPointerUp}
                          onPointerCancel={onCardPointerUp}
                        >
                          {/* Swipe Stamp Badges */}
                          <div className="swipe-stamp like">MATCH! สนใจ</div>
                          <div className="swipe-stamp nope">PASS ข้าม</div>

                          {/* Card Content */}
                          <div className="card-badge-header">
                            <span className={`company-tag-badge ${selectedCompany.tone}`}>
                              {selectedCompany.badge}
                            </span>
                            <span className="card-company-industry">{selectedCompany.industry}</span>
                          </div>

                          <h3 className="card-job-title">{selectedJob.title}</h3>
                          <div className="card-company-name">
                            <Building2 size={16} /> {selectedCompany.name}
                          </div>

                          <div className="card-highlight-grid">
                            <div>
                              <span>ช่วงเงินเดือน</span>
                              <strong>{selectedJob.salary}</strong>
                            </div>
                            <div>
                              <span>สถานที่ปฏิบัติงาน</span>
                              <strong>{selectedJob.location}</strong>
                            </div>
                          </div>

                          <div className="card-values-preview">
                            <span className="card-section-label">ค่านิยมองค์กร (Company Values)</span>
                            <div className="card-values-tags">
                              {selectedCompany.values.map((v) => (
                                <span key={v.title} title={v.desc}>
                                  ⭐ {v.title}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="card-interview-note">
                            <strong>ความประทับใจจากการสัมภาษณ์ Masked:</strong>
                            <p>
                              ทีมงานเปิดกว้าง วัฒนธรรมมุ่งเน้นผลงานและความคิดสร้างสรรค์
                              ตรงกับเป้าหมายการเติบโตของคุณ
                            </p>
                          </div>

                          <div className="swipe-card-drag-hint">
                            <span>↔ ลากการ์ดซ้าย-ขวา หรือกดปุ่มด้านล่าง</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons below Candidate Card */}
                      <div className="swipe-action-controls">
                        <button
                          type="button"
                          className="swipe-btn reject-btn"
                          title="ไม่ไปต่อ (Swipe Left)"
                          onClick={() => handleCandidateSwipe("REJECT")}
                        >
                          <X size={26} />
                          <span>ไม่ไปต่อ / PASS</span>
                        </button>

                        <button
                          type="button"
                          className="swipe-btn info-btn"
                          title="ดูข้อมูลบริษัทแบบเต็ม"
                          onClick={() => setSelectedCompanyForModal(selectedCompany)}
                        >
                          <Building2 size={20} />
                          <span>ข้อมูลบริษัท</span>
                        </button>

                        <button
                          type="button"
                          className="swipe-btn approve-btn"
                          title="สนใจร่วมงาน (Swipe Right)"
                          onClick={() => handleCandidateSwipe("APPROVE")}
                        >
                          <Heart size={26} />
                          <span>สนใจไปต่อ / MATCH</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TURN 2: RECRUITER SWIPE CARD */}
                  {decisionTurn === "recruiter" && (
                    <div className="swipe-arena-container">
                      <div className="swipe-turn-indicator recruiter-turn">
                        <BriefcaseBusiness size={18} />
                        <span>ฝั่งนายจ้าง ({selectedCompany.shortName} HR): ประเมินผล Candidate #7F2A</span>
                      </div>

                      <div className="swipe-card-wrapper">
                        <div
                          className="swipe-card recruiter-card"
                          ref={recruiterCardRef}
                          onPointerDown={(e) => onCardPointerDown(e, handleRecruiterSwipe)}
                          onPointerMove={onCardPointerMove}
                          onPointerUp={onCardPointerUp}
                          onPointerCancel={onCardPointerUp}
                        >
                          {/* Swipe Stamp Badges */}
                          <div className="swipe-stamp like">ACCEPT รับเข้า</div>
                          <div className="swipe-stamp nope">REJECT ปฏิเสธ</div>

                          <div className="card-badge-header">
                            <span className="candidate-id-badge">CANDIDATE #7F2A (MASKED)</span>
                            <span className="candidate-applied-for">สมัคร: {selectedJob.title}</span>
                          </div>

                          <div className="card-candidate-header">
                            <img
                              src="/interview/candidate-cat-video-call.png"
                              alt="Avatar Candidate"
                              className="candidate-avatar-thumb"
                            />
                            <div>
                              <h4>Candidate #7F2A</h4>
                              <small>Cat Avatar · Anonymous Assessment</small>
                            </div>
                            <div className="candidate-score-badge">
                              <span>Match Score</span>
                              <strong>{finalScore}%</strong>
                            </div>
                          </div>

                          <div className="recruiter-evaluation-stats">
                            <div>
                              <span>Resume ↔ JD</span>
                              <strong>{analysis.score}%</strong>
                              <small>ตรง {analysis.matched.length}/{selectedJob.skills.length} ทักษะ</small>
                            </div>
                            <div>
                              <span>Knowledge Check</span>
                              <strong>{knowledgeScore}%</strong>
                              <small>ตอบถูก {correctAnswers}/10 ข้อ</small>
                            </div>
                          </div>

                          {/* Anti-Cheat & Integrity Check on Recruiter Card */}
                          {/* Anti-Cheat & Integrity Check on Recruiter Card */}
                          <div className={`card-proctoring-summary-pill ${tabSwitchCount === 0 ? "clean" : "flagged"}`}>
                            {tabSwitchCount === 0 ? (
                              <span className="integrity-clean">
                                <ShieldCheck size={14} /> Integrity Verified: 100% (ไม่พบประวัติสลับหน้าจอ)
                              </span>
                            ) : (
                              <span className="integrity-flagged">
                                <AlertTriangle size={14} /> Security Flag: ตรวจพบสลับแท็บ {tabSwitchCount} ครั้ง (บันทึกใน Audit Log)
                              </span>
                            )}
                          </div>

                          {/* Subjective Candidate Written Response for HR review */}
                          {subjectiveAnswer && (
                            <div className="card-subjective-snippet-box">
                              <div className="subjective-snippet-label">
                                <Sparkles size={13} />
                                <strong>คำตอบข้อเขียนอัตนัย (เพื่อประกอบการตัดสินใจของ HR):</strong>
                              </div>
                              <p className="subjective-snippet-text">"{subjectiveAnswer}"</p>
                            </div>
                          )}

                          <div className="card-evidence-box">
                            <strong>จุดแข็งและหลักฐานที่ยืนยันได้:</strong>
                            <p>{analysis.matched.join(" · ") || "มีพื้นฐานและทักษะที่เกี่ยวข้องกับตำแหน่ง"}</p>
                          </div>

                          <div className="swipe-card-drag-hint">
                            <span>↔ ลากการ์ดซ้าย-ขวา หรือกดปุ่มเพื่อตัดสินใจ</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons below Recruiter Card */}
                      <div className="swipe-action-controls">
                        <button
                          type="button"
                          className="swipe-btn reject-btn"
                          title="ไม่ผ่านเกณฑ์ (Swipe Left)"
                          onClick={() => handleRecruiterSwipe("REJECT")}
                        >
                          <X size={26} />
                          <span>ไม่ผ่าน / REJECT</span>
                        </button>

                        <button
                          type="button"
                          className="swipe-btn approve-btn"
                          title="ผ่านเข้ารอบถัดไป (Swipe Right)"
                          onClick={() => handleRecruiterSwipe("APPROVE")}
                        >
                          <Check size={26} />
                          <span>ผ่านสัมภาษณ์ / ACCEPT</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TURN 3: REVEALED / MUTUAL RESULT */}
                  {decisionTurn === "revealed" && (
                    <div className="reveal-result-wrapper">
                      <div className="rec-score-grid decision-summary-grid">
                        <div>
                          <span>Candidate Decision</span>
                          <strong>{candidateDecision === "APPROVE" ? "💚 สนใจไปต่อ" : "⚪ ไม่ไปต่อ"}</strong>
                        </div>
                        <div>
                          <span>Recruiter Decision</span>
                          <strong>{recruiterDecision === "APPROVE" ? "💚 สนใจร่วมงาน" : "⚪ ไม่ผ่านเกณฑ์"}</strong>
                        </div>
                        <div>
                          <span>สถานะการ Match</span>
                          <strong className={recruiterDecision === "APPROVE" && candidateDecision === "APPROVE" ? "match-success" : "match-closed"}>
                            {recruiterDecision === "APPROVE" && candidateDecision === "APPROVE"
                              ? "🎉 Mutual Match!"
                              : "🔒 No Match (Private)"}
                          </strong>
                        </div>
                      </div>

                      <div className={`rec-result-hero ${recruiterDecision === "APPROVE" && candidateDecision === "APPROVE" ? "is-mutual" : "is-closed"}`}>
                        <span>
                          {recruiterDecision === "APPROVE" && candidateDecision === "APPROVE" ? (
                            <CheckCircle2 />
                          ) : (
                            <ShieldCheck />
                          )}
                        </span>
                        <div>
                          <h3>
                            {recruiterDecision === "APPROVE" && candidateDecision === "APPROVE"
                              ? "ทั้งสองฝ่ายสนใจตรงกัน! ยินดีด้วย"
                              : "จบกระบวนการคัดเลือกอย่างเป็นส่วนตัว"}
                          </h3>
                          <p>
                            {recruiterDecision === "APPROVE" && candidateDecision === "APPROVE"
                              ? `ยินดีด้วย! ทั้งคุณและ ${selectedCompany.name} ต่างเห็นพ้องต้องกัน พร้อมเข้าสู่ขั้นตอนเปิดเผยข้อมูลติดต่อและสัมภาษณ์รอบไฟนอล`
                              : "ระบบรักษาความเป็นส่วนตัวอย่างสมบูรณ์ ไม่เปิดเผยว่าฝ่ายใดเลือกไม่ไปต่อ และไม่มีการเก็บประวัติที่เชื่อมโยงตัวตนจริง"}
                          </p>
                        </div>
                        <strong className="rec-final-score">
                          {finalScore}
                          <small>/100</small>
                        </strong>
                      </div>

                      {/* Mutual Match: Candidate Final Contact & Unmask Submission */}
                      {recruiterDecision === "APPROVE" && candidateDecision === "APPROVE" && (
                        <div className="mutual-contact-submission-section">
                          {!isContactSubmitted ? (
                            <form className="candidate-contact-form-card" onSubmit={handleContactSubmit}>
                              <div className="contact-form-header">
                                <div className="contact-icon-wrapper">
                                  <PartyPopper size={24} />
                                </div>
                                <div>
                                  <h4>ปลดล็อกตัวตนและส่งข้อมูลติดต่อให้ HR ({selectedCompany.name})</h4>
                                  <p>
                                    ทั้งสองฝ่ายสนใจตรงกันแล้ว! กรุณากรอกชื่อ-นามสกุล และช่องทางติดต่อ เพื่อให้ทีม HR ดำเนินการนัดสัมภาษณ์และติดต่อกลับโดยตรง
                                  </p>
                                </div>
                              </div>

                              {contactSubmitError && (
                                <div className="contact-form-error-alert">
                                  <AlertTriangle size={16} />
                                  <span>{contactSubmitError}</span>
                                </div>
                              )}

                              <div className="contact-inputs-grid">
                                <div className="form-field-group">
                                  <label htmlFor="candidate-fullname">
                                    <User size={15} /> ชื่อ - นามสกุล <span className="req">*</span>
                                  </label>
                                  <input
                                    id="candidate-fullname"
                                    type="text"
                                    placeholder="เช่น สมชาย มุ่งมั่นใจ (Somchai Mungmunjai)"
                                    value={candidateContact.fullName}
                                    onChange={(e) => {
                                      setCandidateContact({ ...candidateContact, fullName: e.target.value });
                                      if (contactSubmitError) setContactSubmitError("");
                                    }}
                                    required
                                  />
                                </div>

                                <div className="form-field-group">
                                  <label htmlFor="candidate-email">
                                    <Mail size={15} /> อีเมลสำหรับติดต่อ <span className="req">*</span>
                                  </label>
                                  <input
                                    id="candidate-email"
                                    type="email"
                                    placeholder="เช่น somchai.dev@gmail.com"
                                    value={candidateContact.email}
                                    onChange={(e) => {
                                      setCandidateContact({ ...candidateContact, email: e.target.value });
                                      if (contactSubmitError) setContactSubmitError("");
                                    }}
                                    required
                                  />
                                </div>

                                <div className="form-field-group">
                                  <label htmlFor="candidate-phone">
                                    <Phone size={15} /> เบอร์โทรศัพท์ <span className="req">*</span>
                                  </label>
                                  <input
                                    id="candidate-phone"
                                    type="tel"
                                    placeholder="เช่น 081-234-5678"
                                    value={candidateContact.phone}
                                    onChange={(e) => {
                                      setCandidateContact({ ...candidateContact, phone: e.target.value });
                                      if (contactSubmitError) setContactSubmitError("");
                                    }}
                                    required
                                  />
                                </div>

                                <div className="form-field-group full-width">
                                  <label htmlFor="candidate-note">
                                    <Clock size={15} /> หมายเหตุหรือช่วงเวลาที่สะดวกให้ติดต่อ (ตัวเลือก)
                                  </label>
                                  <input
                                    id="candidate-note"
                                    type="text"
                                    placeholder="เช่น สะดวกรับสายช่วง 14:00 - 18:00 หรือติดต่อทางอีเมลเป็นหลัก"
                                    value={candidateContact.note}
                                    onChange={(e) =>
                                      setCandidateContact({ ...candidateContact, note: e.target.value })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="contact-form-actions">
                                <button type="submit" className="contact-submit-btn">
                                  <Send size={18} />
                                  <span>ส่งข้อมูลให้ HR และจบเซสชั่นอย่างสมบูรณ์</span>
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="contact-submitted-success-card">
                              <div className="success-receipt-header">
                                <CheckCircle2 size={32} className="success-icon" />
                                <div>
                                  <span className="receipt-badge">SESSION COMPLETE · ส่งมอบข้อมูลติดต่อสำเร็จ</span>
                                  <h4>ส่งข้อมูลติดต่อให้ทีม HR ของ {selectedCompany.name} เรียบร้อยแล้ว!</h4>
                                  <p>
                                    ทีม Recruiter ได้รับข้อมูลติดต่อและประวัติการประเมินทักษะของคุณเรียบร้อยแล้ว และจะติดต่อกลับตามช่องทางที่ระบุไว้
                                  </p>
                                </div>
                              </div>

                              <div className="submitted-receipt-grid">
                                <div>
                                  <span>ชื่อ - นามสกุล</span>
                                  <strong>{submittedContactData?.fullName}</strong>
                                </div>
                                <div>
                                  <span>อีเมลติดต่อ</span>
                                  <strong>{submittedContactData?.email}</strong>
                                </div>
                                <div>
                                  <span>เบอร์โทรศัพท์</span>
                                  <strong>{submittedContactData?.phone}</strong>
                                </div>
                                <div>
                                  <span>ตำแหน่งงาน</span>
                                  <strong>{selectedJob.title} ({selectedCompany.shortName})</strong>
                                </div>
                                {submittedContactData?.note && (
                                  <div className="receipt-note-item">
                                    <span>ช่วงเวลาที่สะดวก</span>
                                    <p>{submittedContactData.note}</p>
                                  </div>
                                )}
                              </div>

                              <div className="receipt-footer-status">
                                <span>🔒 สิ้นสุดกระบวนการคัดเลือกแบบไม่ระบุตัวตน (Masked Phase) → เข้าสู่ขั้นตอนสัมภาษณ์รอบ Final ต่อไป</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Reflection Breakdown - Interactive Infographic Dashboard */}
                      <section className="assessment-reflection infographic-reflection-section" ref={reflectionSectionRef}>
                        <div className="reflection-hero-header">
                          <div>
                            <span className="eyebrow">
                              <Sparkles size={14} /> Interactive Competency & Assessment Analytics
                            </span>
                            <h3>ผลการประเมินทักษะเชิงลึกแบบจำแนกหมวดหมู่</h3>
                            <p>
                              วิเคราะห์ความพร้อมรอบด้านจากการจับคู่หลักฐานเรซูเม่ (CV Evidence) และการทดสอบสถานการณ์จริง (Scenario Check)
                            </p>
                          </div>
                          <div className="executive-grade-badge">
                            <span className="grade-label">Overall Match Grade</span>
                            <strong className="grade-val">{competencyData.grade}</strong>
                            <small className="grade-desc">{competencyData.gradeText}</small>
                          </div>
                        </div>

                        {/* Top 3 Circular Infographic Gauges */}
                        <div className="infographic-meters-grid">
                          <div className="infographic-meter-card">
                            <div className="circular-infographic-meter">
                              <svg viewBox="0 0 100 100" className="meter-svg">
                                <circle cx="50" cy="50" r="45" className="meter-bg-circle" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  className="meter-circle-progress stroke-emerald"
                                  data-value={finalScore}
                                  strokeDasharray="283"
                                  strokeDashoffset="283"
                                />
                              </svg>
                              <div className="meter-content">
                                <span className="meter-number">{finalScore}</span>
                                <span className="meter-unit">%</span>
                              </div>
                            </div>
                            <div className="meter-info">
                              <span className="meter-title">คะแนนรวมความพร้อมสุทธิ</span>
                              <strong>Composite Match Score</strong>
                              <p>ถ่วงน้ำหนัก CV 55% + Scenario 45%</p>
                            </div>
                          </div>

                          <div className="infographic-meter-card">
                            <div className="circular-infographic-meter">
                              <svg viewBox="0 0 100 100" className="meter-svg">
                                <circle cx="50" cy="50" r="45" className="meter-bg-circle" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  className="meter-circle-progress stroke-sky"
                                  data-value={knowledgeScore}
                                  strokeDasharray="283"
                                  strokeDashoffset="283"
                                />
                              </svg>
                              <div className="meter-content">
                                <span className="meter-number">{knowledgeScore}</span>
                                <span className="meter-unit">%</span>
                              </div>
                            </div>
                            <div className="meter-info">
                              <span className="meter-title">ความแม่นยำสถานการณ์</span>
                              <strong>Scenario Precision</strong>
                              <p>ตอบถูกต้อง {correctAnswers}/10 ข้อ (ปรนัย)</p>
                            </div>
                          </div>

                          <div className="infographic-meter-card">
                            <div className="circular-infographic-meter">
                              <svg viewBox="0 0 100 100" className="meter-svg">
                                <circle cx="50" cy="50" r="45" className="meter-bg-circle" />
                                <circle
                                  cx="50"
                                  cy="50"
                                  r="45"
                                  className="meter-circle-progress stroke-purple"
                                  data-value={analysis.score}
                                  strokeDasharray="283"
                                  strokeDashoffset="283"
                                />
                              </svg>
                              <div className="meter-content">
                                <span className="meter-number">{analysis.score}</span>
                                <span className="meter-unit">%</span>
                              </div>
                            </div>
                            <div className="meter-info">
                              <span className="meter-title">ความตรงสเปกตำแหน่งงาน</span>
                              <strong>CV ↔ JD Alignment</strong>
                              <p>ตรง {analysis.matched.length}/{selectedJob.skills.length} ทักษะสำคัญของตำแหน่ง</p>
                            </div>
                          </div>
                        </div>

                        {/* 4 Categorized Competency Dimension Bars */}
                        <div className="competency-matrix-section">
                          <div className="section-head-bar">
                            <span className="section-title">
                              <Layers size={16} /> การประเมินรายด้าน (4 Core Competency Dimensions)
                            </span>
                            <span className="section-tag">Interactive Analytics</span>
                          </div>

                          <div className="competency-dimensions-grid">
                            {competencyData.dimensions.map((dim) => (
                              <div key={dim.id} className="competency-dimension-card">
                                <div className="dimension-card-head">
                                  <div className="dimension-icon-badge" style={{ color: dim.color, borderColor: dim.color }}>
                                    {dim.id === "architecture" && <Cpu size={18} />}
                                    {dim.id === "problem_solving" && <Zap size={18} />}
                                    {dim.id === "domain_tools" && <Target size={18} />}
                                    {dim.id === "integrity_quality" && <ShieldCheck size={18} />}
                                  </div>
                                  <div className="dimension-title-group">
                                    <h4>{dim.title}</h4>
                                    <span>{dim.subtitle}</span>
                                  </div>
                                  <div className="dimension-score-badge">
                                    <strong>{dim.score}%</strong>
                                  </div>
                                </div>

                                <div className="dimension-bar-track">
                                  <div
                                    className="dimension-bar-fill"
                                    data-width={`${dim.score}%`}
                                    style={{
                                      backgroundColor: dim.color,
                                      boxShadow: `0 0 12px ${dim.color}80`,
                                    }}
                                  />
                                </div>

                                <div className="dimension-card-footer">
                                  <span className="dimension-status-badge" style={{ color: dim.color, borderColor: `${dim.color}40`, backgroundColor: `${dim.color}15` }}>
                                    {dim.badge}
                                  </span>
                                  <p className="dimension-insight-text">{dim.insight}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Subjective Candidate Written Response Review */}
                        {subjectiveAnswer && (
                          <div className="reflection-subjective-card">
                            <div className="subjective-card-head">
                              <Sparkles size={16} />
                              <strong>ข้อเขียนอัตนัยของผู้สมัคร (Subjective Response Review):</strong>
                            </div>
                            <p className="reflection-subjective-q">
                              {questions.find((q) => q.type === "subjective")?.question || "ข้อเขียนอัตนัย"}
                            </p>
                            <blockquote className="reflection-subjective-ans">
                              "{subjectiveAnswer}"
                            </blockquote>
                          </div>
                        )}

                        {/* Strengths & Growth Roadmap Side-by-Side Infographic */}
                        <div className="reflection-insights-split-grid">
                          <div className="reflection-strengths-box">
                            <div className="box-head">
                              <Award size={18} className="text-emerald" />
                              <h4>จุดแข็งที่โดดเด่นและพิสูจน์แล้ว (Verified Strengths)</h4>
                            </div>
                            <ul className="strengths-list">
                              {analysis.matched.slice(0, 4).map((skill, idx) => (
                                <li key={idx}>
                                  <CheckCircle2 size={16} className="text-emerald" />
                                  <span>{skill} — มีหลักฐานประสบการณ์และทำคะแนนได้ดีเยี่ยม</span>
                                </li>
                              ))}
                              {analysis.matched.length === 0 && (
                                <li>
                                  <CheckCircle2 size={16} className="text-emerald" />
                                  <span>มีความเข้าใจในโครงสร้างระบบและกระบวนการทำงาน</span>
                                </li>
                              )}
                            </ul>
                          </div>

                          <div className="reflection-growth-box">
                            <div className="box-head">
                              <TrendingUp size={18} className="text-sky" />
                              <h4>แผนพัฒนาทักษะต่อยอด (Learning & Growth Roadmap)</h4>
                            </div>
                            <ul className="growth-list">
                              {questions
                                .filter((q, idx) => q.type !== "subjective" && answers[idx] !== q.correctIndex)
                                .slice(0, 3)
                                .map((q, idx) => (
                                  <li key={idx}>
                                    <div className="growth-skill-tag">{q.skill}</div>
                                    <p>{q.explanation}</p>
                                  </li>
                                ))}
                              {!questions.some((q, idx) => q.type !== "subjective" && answers[idx] !== q.correctIndex) && (
                                <li>
                                  <div className="growth-skill-tag">Mastery Level</div>
                                  <p>คะแนนเต็มในทุกหมวดข้อสอบ แนะนำให้ต่อยอดสู่ระดับ System Leadership และ Mentorship</p>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>

                        {/* Anti-Cheat & Proctoring Audit Summary Box */}
                        <div className="reflection-integrity-box">
                          <div className="reflection-integrity-head">
                            <ShieldCheck size={18} className="integrity-icon" />
                            <strong>สรุปการตรวจสอบความโปร่งใส (Anti-Cheat & Proctoring Audit)</strong>
                          </div>
                          <p>
                            {tabSwitchCount === 0
                              ? "✓ ผ่านเกณฑ์: ผู้สมัครทำข้อสอบต่อเนื่องในหน้าต่างเดียว ไม่พบประวัติการสลับแท็บหรือย่อหน้าจอ (Integrity 100%)"
                              : `⚠️ ตรวจพบการสลับหน้าจอทั้งหมด ${tabSwitchCount} ครั้ง ซึ่งระบบได้บันทึกรายละเอียดไว้ใน Audit Log สำหรับ Recruiter และ Admin เรียบร้อยแล้ว`}
                          </p>
                          {proctoringLogs.length > 0 && (
                            <div className="reflection-audit-logs">
                              <span className="audit-logs-title">บันทึกเหตุการณ์ Audit Trail:</span>
                              <ul>
                                {proctoringLogs.map((log) => (
                                  <li key={log.id}>
                                    <span className="log-stamp">[{log.timestamp}]</span> {log.message}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        <p className="reflection-note">
                          🔒 ข้อมูลการประเมินถูกเข้ารหัสตามมาตรฐาน Privacy Invariant และจะส่งต่อให้ผู้ว่าจ้างเฉพาะเมื่อทั้งสองฝ่ายเกิด Mutual Match เท่านั้น
                        </p>
                      </section>

                      <div className="rec-actions">
                        <button type="button" className="rec-secondary" onClick={() => setDecisionTurn("candidate")}>
                          <RotateCcw size={16} /> ย้อนกลับไปทดลอง Swipe อีกครั้ง
                        </button>
                        <button className="rec-primary" type="button" onClick={reset}>
                          จบกระบวนการและทดสอบตำแหน่งใหม่ <ArrowRight />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {/* MODAL 1: Application CV Intake */}
      {showApplicationModal && stage === "intake" && (
        <div className="analysis-confirm-backdrop" role="presentation">
          <section
            className="analysis-confirm-dialog application-intake-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-intake-title"
          >
            <div className="application-dialog-head">
              <div>
                <span className="eyebrow">
                  สมัคร · {selectedJob.title} @ {selectedCompany.shortName}
                </span>
                <h2 id="application-intake-title">แนบ CV เพื่อเทียบกับ JD</h2>
                <p>
                  {selectedJob.department} · {selectedJob.location} · {selectedJob.salary}
                </p>
              </div>
              <button
                type="button"
                className="rec-secondary"
                onClick={() => setShowApplicationModal(false)}
                disabled={loading}
              >
                ปิด
              </button>
            </div>

            <div className="rec-skill-row">
              {selectedJob.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>

            <div className="sample-cv-quick-fill-row">
              <button
                type="button"
                className="rec-secondary sample-fill-btn"
                onClick={() => {
                  setFileName("Candidate_Senior_Resume.pdf");
                  setClaims(sampleClaims);
                  setApiNote("โหลดตัวอย่างข้อมูล Resume จำลองสำหรับทดสอบเดโม่");
                }}
              >
                <Sparkles size={14} /> ใช้ตัวอย่าง Resume จำลองสำหรับเดโม่
              </button>
            </div>

            <button
              className={`rec-upload ${fileName ? "has-file" : ""} ${loading ? "is-loading" : ""}`}
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={loading}
            >
              <input ref={inputRef} type="file" accept=".pdf" onChange={handleFile} />
              {loading ? (
                <LoaderCircle className="upload-loading-spinner" />
              ) : fileName ? (
                <CheckCircle2 />
              ) : (
                <FileText />
              )}
              <strong>{loading ? aiLoadingLabel : fileName || "เลือกไฟล์เรซูเม่ PDF"}</strong>
              <span>
                {loading
                  ? `กำลังประมวลผล ${aiProgress}%...`
                  : fileName
                    ? "แนบไฟล์แล้ว · พร้อมประมวลผล"
                    : "PDF ไม่เกิน 10 MB · ระบบไม่บันทึกไฟล์ต้นฉบับ"}
              </span>
            </button>

            {loading && (
              <div className="ai-progress-block" role="status" aria-live="polite">
                <div className="ai-progress-copy">
                  <span>
                    <Sparkles /> {aiLoadingLabel}
                  </span>
                  <strong>{aiProgress}%</strong>
                </div>
                <div
                  className="ai-progress-track"
                  role="progressbar"
                  aria-label={aiLoadingLabel}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={aiProgress}
                >
                  <span style={{ width: `${aiProgress}%` }} />
                </div>
                <div className="ai-time-estimate-pill">
                  <Clock size={13} />
                  <span>AI กำลังประมวลผลเชิงลึก ใช้เวลาประมาณ <strong>1–2 นาที</strong> กรุณาเปิดหน้านี้ทิ้งไว้</span>
                </div>
                {aiLiveLog && (
                  <div className="ai-live-oneline-ticker" role="log" aria-live="assertive">
                    <span className="ticker-pulse-dot" />
                    <span className="ticker-badge-tag">LIVE AI:</span>
                    <span className="ticker-log-msg">{aiLiveLog}</span>
                  </div>
                )}
                <small>
                  {aiProgress < 35
                    ? "กำลังเตรียมข้อมูลและตรวจรูปแบบไฟล์"
                    : aiProgress < 70
                      ? "AI กำลังสกัดหลักฐานและทักษะที่เกี่ยวข้อง"
                      : aiProgress < 100
                        ? "กำลังสร้าง Assessment 11 ข้อเชิงลึก"
                        : "เสร็จเรียบร้อย"}
                </small>
              </div>
            )}

            {apiNote && !loading && (
              <div className="rec-ai-note">
                <Sparkles />
                <div>{apiNote}</div>
              </div>
            )}

            {fileName && claims && !loading && (
              <section className="extracted-evidence-card">
                <div>
                  <div>
                    <span className="eyebrow">Resume Evidence</span>
                    <h4>หลักฐานที่สกัดจากเรซูเม่</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setClaimsDraft(claims);
                      setEditClaimsOpen(true);
                    }}
                  >
                    <Pencil /> แก้ไข
                  </button>
                </div>
                <p>{claims}</p>
                <small>ผลวิเคราะห์แบบ Masked ปิดบังชื่อ เบอร์โทร และที่อยู่</small>
              </section>
            )}

            {fileName && claims && !loading && (
              <>
                <div className="rec-analysis-preview">
                  <div>
                    <span>JD Coverage</span>
                    <strong>{analysis.score}%</strong>
                  </div>
                  <div>
                    <span>ตรงกับ JD</span>
                    <p>{analysis.matched.join(" · ") || "ยังไม่พบทักษะที่ตรง"}</p>
                  </div>
                  <div>
                    <span>ควรตรวจเพิ่ม</span>
                    <p>{analysis.missing.join(" · ") || "ครบทุกรายการหลัก"}</p>
                  </div>
                </div>

                <div className="rec-actions">
                  <button
                    className="rec-primary"
                    type="button"
                    disabled={claims.trim().length < 30 || loading}
                    onClick={createAssessment}
                  >
                    <Sparkles /> สร้าง Scenario Assessment 11 ข้อ (ใช้เวลา ~1–2 นาที) <ArrowRight />
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}

      {/* MODAL 2: Checkpoint Confirmation before Assessment */}
      {showAnalysisConfirm && (
        <div className="analysis-confirm-backdrop top-layer" role="presentation">
          <section
            className="analysis-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="analysis-confirm-title"
          >
            <div className="analysis-confirm-icon">
              <ClipboardCheck />
            </div>
            <span className="eyebrow">Resume analysis checkpoint</span>
            <h2 id="analysis-confirm-title">ยืนยันผลวิเคราะห์ก่อนเริ่ม Assessment</h2>
            <p>
              ตรวจดูว่าหลักฐานที่สกัดไม่ผิดคน และสอดคล้องกับเรซูเม่ของผู้สมัคร ก่อนเริ่มทำแบบทดสอบสถานการณ์ {questions.length || 11} ข้อ (ช้อยส์ 10 + อัตนัย 1 · จับเวลา 15 นาที)
            </p>

            <div className="analysis-confirm-summary">
              <div>
                <span>ตำแหน่ง</span>
                <strong>{selectedJob.title}</strong>
              </div>
              <div>
                <span>บริษัท</span>
                <strong>{selectedCompany.name}</strong>
              </div>
              <div>
                <span>คะแนนเทียบ JD</span>
                <strong>{analysis.score}%</strong>
              </div>
            </div>

            <div className="analysis-confirm-evidence">
              <strong>หลักฐานที่นำไปสร้างคำถาม Scenario</strong>
              <p>{claims}</p>
            </div>

            <div className="rec-skill-row">
              {analysis.matched.map((skill) => (
                <span key={skill}>✓ ตรง: {skill}</span>
              ))}
              {analysis.missing.map((skill) => (
                <span key={skill}>? ตรวจเพิ่ม: {skill}</span>
              ))}
            </div>

            {/* Rules & Integrity Policy before Start */}
            <div className="quiz-rules-card">
              <div className="quiz-rules-title-row">
                <Shield size={18} className="rules-shield-icon" />
                <strong>กฎระเบียบและข้อปฏิบัติก่อนเริ่มทำข้อสอบ (Assessment Rules)</strong>
              </div>
              <ul className="quiz-rules-list">
                <li>
                  <span className="rule-badge red">1. ห้ามทุจริต</span>
                  <p>ห้ามคัดลอก ค้นหาคำตอบจากอินเทอร์เน็ต หรือใช้เครื่องมือ AI และบุคคลภายนอกช่วยเหลือโดยเด็ดขาด</p>
                </li>
                <li>
                  <span className="rule-badge amber">2. สภาพแวดล้อม</span>
                  <p>ควรอยู่ในที่เงียบและไม่มีคนเดินผ่าน เห็นใบหน้าชัดเจน ไม่สวมหมวก แว่นตากันแดด หรือสิ่งปิดบังใบหน้า</p>
                </li>
                <li>
                  <span className="rule-badge cyan">3. ห้ามสลับแท็บ / เปลี่ยนแอป</span>
                  <p>ตลอดเวลา 15 นาที ระบบมี Anti-Cheat ตรวจจับการสลับแท็บ (Tab Switch) หากสลับแท็บจะมี Popup เตือนทันที</p>
                </li>
                <li>
                  <span className="rule-badge violet">4. บันทึก Security Audit Log</span>
                  <p>ทุกเหตุการณ์สลับหน้าต่างจะถูกบันทึกเวลาและส่งให้ Recruiter และ Admin ประกอบการพิจารณาคัดเลือก</p>
                </li>
              </ul>

              <label className="quiz-rules-agree-checkbox">
                <input
                  type="checkbox"
                  checked={agreeAssessmentRules}
                  onChange={(e) => setAgreeAssessmentRules(e.target.checked)}
                />
                <span>
                  ข้าพเจ้ารับทราบและยินยอมปฏิบัติตามกฎระเบียบการทดสอบ รวมถึงยินยอมให้ระบบบันทึก Audit Log การสลับหน้าจอ
                </span>
              </label>
            </div>

            <div className="rec-actions">
              <button
                type="button"
                className="rec-secondary"
                onClick={() => setShowAnalysisConfirm(false)}
              >
                กลับไปแก้ไขผลวิเคราะห์
              </button>
              <button
                type="button"
                className="rec-primary"
                disabled={!agreeAssessmentRules}
                onClick={() => {
                  setShowAnalysisConfirm(false);
                  setShowApplicationModal(false);
                  setCurrentQuestionIndex(0);
                  setTimerSeconds(900);
                  setTimerExpired(false);
                  setTabSwitchCount(0);
                  setProctoringLogs([]);
                  setShowTabWarningModal(false);
                  setStage("assessment");
                }}
              >
                <Check /> เริ่มทำแบบทดสอบ {questions.length || 11} ข้อ (15 นาที)
              </button>
            </div>
          </section>
        </div>
      )}

      {/* MODAL 3: Edit Claims */}
      {editClaimsOpen && (
        <div className="analysis-confirm-backdrop" role="presentation">
          <section
            className="analysis-confirm-dialog evidence-edit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-evidence-title"
          >
            <div className="analysis-confirm-icon">
              <Pencil />
            </div>
            <span className="eyebrow">Manual correction</span>
            <h2 id="edit-evidence-title">แก้ไขผลวิเคราะห์ Resume</h2>
            <p>
              แก้เฉพาะข้อมูลที่มีหลักฐานอยู่ใน CV ระบบจะนำข้อความที่บันทึกไปคำนวณความตรงกับ JD และสร้างคำถามใหม่
            </p>
            <label className="rec-claims">
              <span>หลักฐานที่สกัดจากเรซูเม่</span>
              <textarea
                value={claimsDraft}
                onChange={(event) => setClaimsDraft(event.target.value)}
                rows={8}
                autoFocus
              />
            </label>
            <div className="rec-actions">
              <button
                type="button"
                className="rec-secondary"
                onClick={() => {
                  setEditClaimsOpen(false);
                  setClaimsDraft("");
                }}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="rec-primary"
                disabled={claimsDraft.trim().length < 30}
                onClick={() => {
                  setClaims(claimsDraft.trim());
                  setEditClaimsOpen(false);
                  setApiNote("บันทึกการแก้ไขผลวิเคราะห์แล้ว");
                }}
              >
                <Check /> บันทึกการแก้ไข
              </button>
            </div>
          </section>
        </div>
      )}

      {/* MODAL 4: Company Profile Modal (Culture, Values, Products, Perks) */}
      {selectedCompanyForModal && (
        <div
          className="company-modal-backdrop"
          role="presentation"
          onClick={() => setSelectedCompanyForModal(null)}
        >
          <section
            className="company-profile-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="comp-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="company-modal-header">
              <div className="company-modal-brand">
                <span className={`company-modal-badge ${selectedCompanyForModal.tone}`}>
                  {selectedCompanyForModal.badge}
                </span>
                <div>
                  <span className="company-modal-industry">{selectedCompanyForModal.industry}</span>
                  <h2 id="comp-modal-title">{selectedCompanyForModal.name}</h2>
                  <p className="company-modal-tagline">"{selectedCompanyForModal.tagline}"</p>
                </div>
              </div>
              <button
                type="button"
                className="company-modal-close-btn"
                aria-label="ปิดหน้าต่าง"
                onClick={() => setSelectedCompanyForModal(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="company-modal-body">
              {/* Description */}
              <section className="comp-modal-section">
                <p className="comp-modal-desc">{selectedCompanyForModal.description}</p>
                <div className="comp-modal-meta-row">
                  <span>
                    <MapPin size={15} /> {selectedCompanyForModal.location}
                  </span>
                  <a
                    href={selectedCompanyForModal.website}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="comp-website-link"
                  >
                    เว็บไซต์ทางการ <ExternalLink size={14} />
                  </a>
                </div>
              </section>

              {/* 1. Values */}
              <section className="comp-modal-section">
                <div className="section-title-with-icon">
                  <Sparkles size={18} />
                  <h3>ค่านิยมหลักขององค์กร (Core Values)</h3>
                </div>
                <div className="comp-values-grid">
                  {selectedCompanyForModal.values.map((val) => (
                    <div key={val.title} className="comp-value-card">
                      <strong>{val.title}</strong>
                      <p>{val.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 2. Culture */}
              <section className="comp-modal-section">
                <div className="section-title-with-icon">
                  <Users size={18} />
                  <h3>วัฒนธรรมและบรรยากาศการทำงาน (Work Culture)</h3>
                </div>
                <ul className="comp-culture-list">
                  {selectedCompanyForModal.culture.map((c) => (
                    <li key={c}>
                      <ChevronRight size={16} /> {c}
                    </li>
                  ))}
                </ul>
              </section>

              {/* 3. Products & Services */}
              <section className="comp-modal-section">
                <div className="section-title-with-icon">
                  <BriefcaseBusiness size={18} />
                  <h3>ผลิตภัณฑ์และบริการหลัก (Products & Services)</h3>
                </div>
                <div className="comp-products-tags">
                  {selectedCompanyForModal.products.map((p) => (
                    <span key={p}>📦 {p}</span>
                  ))}
                </div>
              </section>

              {/* 4. Perks & Benefits */}
              <section className="comp-modal-section">
                <div className="section-title-with-icon">
                  <Heart size={18} />
                  <h3>สวัสดิการและสภาพแวดล้อม (Perks & Environment)</h3>
                </div>
                <div className="comp-perks-tags">
                  {selectedCompanyForModal.perks.map((perk) => (
                    <span key={perk}>🎁 {perk}</span>
                  ))}
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="company-modal-footer">
              <span className="open-jobs-count-text">
                มีตำแหน่งเปิดรับในระบบ {jobs.filter((j) => j.companyId === selectedCompanyForModal.id).length} ตำแหน่ง
              </span>
              <div className="footer-action-buttons">
                <button
                  type="button"
                  className="rec-secondary"
                  onClick={() => setSelectedCompanyForModal(null)}
                >
                  ปิด
                </button>
                <button
                  type="button"
                  className="rec-primary"
                  onClick={() => {
                    const companyJobs = jobs.filter((j) => j.companyId === selectedCompanyForModal.id);
                    if (companyJobs.length > 0) {
                      setSelectedCategory(companyJobs[0]!.category);
                      setSelectedJobId(companyJobs[0]!.id);
                    }
                    setSelectedCompanyForModal(null);
                  }}
                >
                  ดูตำแหน่งของบริษัทนี้ <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* MODAL 5: Tab Switch & Proctoring Warning Alert Dialog */}
      {showTabWarningModal && (
        <div className="tab-warning-backdrop top-layer" role="alertdialog" aria-modal="true" aria-labelledby="tab-warning-title">
          <section className="tab-warning-dialog">
            <div className="tab-warning-icon">
              <AlertTriangle size={36} />
            </div>
            <span className="warning-eyebrow">ANTI-CHEAT & PROCTORING ALERT</span>
            <h2 id="tab-warning-title">ตรวจพบการสลับหน้าจอ / ออกจากแอป!</h2>
            <p className="tab-warning-desc">
              ระบบตรวจพบว่าคุณได้ <strong>สลับแท็บ ย่อเบราว์เซอร์ หรือเปลี่ยนไปใช้งานแอปพลิเคชันอื่น</strong> (ตรวจพบครั้งที่ <strong>{tabSwitchCount}</strong>)
            </p>

            <div className="tab-warning-box">
              <div className="warning-notice-item">
                <ShieldAlert size={20} />
                <div>
                  <strong>พฤติกรรมนี้ถูกบันทึกประวัติ (Audit Log) แล้ว</strong>
                  <p>
                    ระบบได้ส่งประวัติการสลับหน้าต่าง เวลาที่เกิดเหตุ และข้อที่กำลังทำ ({currentQuestionIndex + 1}) ไปยัง <strong>Recruiter และ Admin</strong> ของ {selectedCompany.name} เรียบร้อยแล้ว
                  </p>
                </div>
              </div>
              <div className="warning-notice-item">
                <EyeOff size={20} />
                <div>
                  <strong>คำเตือนเรื่องความโปร่งใส (Integrity Score)</strong>
                  <p>
                    การสลับหน้าจอซ้ำอาจส่งผลกระทบต่อคะแนนความน่าเชื่อถือ หรือทำให้ผลการประเมินถูกปฏิเสธ โปรดทำข้อสอบต่อโดยไม่สลับหน้าจอ
                  </p>
                </div>
              </div>
            </div>

            {proctoringLogs.length > 0 && (
              <div className="tab-warning-recent-logs">
                <span>บันทึกเหตุการณ์ Audit Trail ล่าสุด:</span>
                <ul>
                  {proctoringLogs.slice(-3).map((log) => (
                    <li key={log.id}>
                      <span className="log-time">[{log.timestamp}]</span> {log.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="tab-warning-actions">
              <button
                type="button"
                className="rec-primary tab-warning-ack-btn"
                onClick={() => setShowTabWarningModal(false)}
              >
                <Check size={18} /> รับทราบและกลับไปทำข้อสอบต่อ
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer className="rec-demo-footer">
        <span>
          <ShieldCheck /> Local demo · สังเคราะห์ข้อมูลเพื่อการประเมินทักษะอย่างเป็นธรรม
        </span>
        <span>
          Sponsor-backed job catalog · ปิดบังตัวตนและข้อมูลส่วนตัวจนกว่าทั้งสองฝ่ายจะ Mutual Match
        </span>
      </footer>
    </div>
  );
}
