export interface OccupationItem {
  id: string;
  title: string;
  titleTh: string;
  category: string;
  categoryTh: string;
  popular?: boolean;
}

export interface OccupationCategory {
  id: string;
  name: string;
  nameTh: string;
  iconName?: string;
}

export const OCCUPATION_CATEGORIES: OccupationCategory[] = [
  { id: "all", name: "All Categories", nameTh: "ทุกหมวดหมู่" },
  { id: "software", name: "Software & Engineering", nameTh: "วิศวกรรมซอฟต์แวร์ & ไอที" },
  { id: "data_ai", name: "Data & Artificial Intelligence", nameTh: "ข้อมูล & ปัญญาประดิษฐ์ (AI)" },
  { id: "product", name: "Product & Project Management", nameTh: "การบริหารผลิตภัณฑ์ & โครงการ" },
  { id: "design", name: "Design & Creative", nameTh: "ออกแบบ & ครีเอทีฟ" },
  { id: "marketing", name: "Marketing & Growth", nameTh: "การตลาด & สื่อสารองค์กร" },
  { id: "sales_bd", name: "Sales & Business Development", nameTh: "งานขาย & พัฒนาธุรกิจ" },
  { id: "customer", name: "Customer Success & Support", nameTh: "บริการลูกค้า & ดูแลความสัมพันธ์" },
  { id: "security", name: "Cyber Security & Governance", nameTh: "ความปลอดภัยไซเบอร์ & ตรวจสอบ" },
  { id: "finance_hr", name: "Finance, HR & Operations", nameTh: "การเงิน บัญชี & ทรัพยากรบุคคล" },
];

export const POPULAR_OCCUPATIONS: OccupationItem[] = [
  // Software & Engineering
  { id: "fullstack", title: "Full-Stack Developer", titleTh: "นักพัฒนาฟูลสแต็ก", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์", popular: true },
  { id: "frontend", title: "Frontend Developer", titleTh: "นักพัฒนาฟรอนต์เอนด์", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์", popular: true },
  { id: "backend", title: "Backend Developer", titleTh: "นักพัฒนาแบ็กเอนด์", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์", popular: true },
  { id: "mobile_dev", title: "Mobile App Developer (iOS/Android)", titleTh: "นักพัฒนาแอปมือถือ", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์", popular: true },
  { id: "devops", title: "DevOps Engineer", titleTh: "วิศวกรเดฟออปส์", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์", popular: true },
  { id: "cloud_arch", title: "Cloud Solutions Architect", titleTh: "สถาปนิกคลาวด์", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์" },
  { id: "qa_auto", title: "QA / Automation Test Engineer", titleTh: "วิศวกรทดสอบระบบอัตโนมัติ", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์", popular: true },
  { id: "embedded", title: "Embedded Systems & IoT Engineer", titleTh: "วิศวกรสมองกลฝังตัว & IoT", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์" },
  { id: "game_dev", title: "Game Developer (Unity / Unreal)", titleTh: "นักพัฒนาเกม", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์" },
  { id: "blockchain_dev", title: "Smart Contract / Web3 Developer", titleTh: "นักพัฒนาบล็อกเชน & Web3", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์" },
  { id: "sysadmin", title: "System & Network Administrator", titleTh: "ผู้ดูแลระบบและเครือข่าย", category: "software", categoryTh: "วิศวกรรมซอฟต์แวร์" },

  // Data & AI
  { id: "data_scientist", title: "Data Scientist", titleTh: "นักวิทยาศาสตร์ข้อมูล", category: "data_ai", categoryTh: "ข้อมูล & AI", popular: true },
  { id: "ml_engineer", title: "Machine Learning Engineer", titleTh: "วิศวกรแมชชีนเลิร์นนิง", category: "data_ai", categoryTh: "ข้อมูล & AI", popular: true },
  { id: "ai_engineer", title: "AI Application & Prompt Engineer", titleTh: "วิศวกรพัฒนาแอปพลิเคชัน AI", category: "data_ai", categoryTh: "ข้อมูล & AI", popular: true },
  { id: "data_analyst", title: "Data Analyst", titleTh: "นักวิเคราะห์ข้อมูล", category: "data_ai", categoryTh: "ข้อมูล & AI", popular: true },
  { id: "data_engineer", title: "Data Engineer", titleTh: "วิศวกรข้อมูล", category: "data_ai", categoryTh: "ข้อมูล & AI", popular: true },
  { id: "bi_analyst", title: "Business Intelligence (BI) Analyst", titleTh: "นักวิเคราะห์ระบบอัจฉริยะทางธุรกิจ", category: "data_ai", categoryTh: "ข้อมูล & AI" },
  { id: "computer_vision", title: "Computer Vision Specialist", titleTh: "ผู้เชี่ยวชาญด้านระบบประมวลผลภาพ", category: "data_ai", categoryTh: "ข้อมูล & AI" },
  { id: "nlp_engineer", title: "NLP / Large Language Model Engineer", titleTh: "วิศวกรประมวลผลภาษาธรรมชาติ", category: "data_ai", categoryTh: "ข้อมูล & AI" },

  // Product & Project
  { id: "product_manager", title: "Product Manager (PM)", titleTh: "ผู้จัดการผลิตภัณฑ์", category: "product", categoryTh: "การบริหารผลิตภัณฑ์", popular: true },
  { id: "product_owner", title: "Product Owner (PO)", titleTh: "เจ้าของผลิตภัณฑ์", category: "product", categoryTh: "การบริหารผลิตภัณฑ์", popular: true },
  { id: "business_analyst", title: "Business Analyst (BA)", titleTh: "นักวิเคราะห์ธุรกิจ", category: "product", categoryTh: "การบริหารผลิตภัณฑ์", popular: true },
  { id: "scrum_master", title: "Scrum Master / Agile Coach", titleTh: "ผู้เชี่ยวชาญกระบวนการ Agile", category: "product", categoryTh: "การบริหารผลิตภัณฑ์" },
  { id: "project_manager", title: "IT Project Manager (PMP)", titleTh: "ผู้จัดการโครงการไอที", category: "product", categoryTh: "การบริหารผลิตภัณฑ์", popular: true },
  { id: "operations_lead", title: "Technical Operations Specialist", titleTh: "ผู้เชี่ยวชาญการดำเนินงานเชิงเทคนิค", category: "product", categoryTh: "การบริหารผลิตภัณฑ์" },

  // Design & Creative
  { id: "ui_ux_designer", title: "UI/UX Designer", titleTh: "นักออกแบบประสบการณ์และส่วนติดต่อผู้ใช้", category: "design", categoryTh: "ออกแบบ & ครีเอทีฟ", popular: true },
  { id: "product_designer", title: "Product Designer", titleTh: "นักออกแบบผลิตภัณฑ์ดิจิทัล", category: "design", categoryTh: "ออกแบบ & ครีเอทีฟ", popular: true },
  { id: "graphic_designer", title: "Graphic & Brand Designer", titleTh: "นักออกแบบกราฟิกและแบรนด์", category: "design", categoryTh: "ออกแบบ & ครีเอทีฟ", popular: true },
  { id: "motion_designer", title: "Motion Graphics & Video Creator", titleTh: "นักสร้างสรรค์ภาพเคลื่อนไหวและวิดีโอ", category: "design", categoryTh: "ออกแบบ & ครีเอทีฟ" },
  { id: "3d_artist", title: "3D Artist / Modeler", titleTh: "นักออกแบบและสร้างโมเดล 3 มิติ", category: "design", categoryTh: "ออกแบบ & ครีเอทีฟ" },
  { id: "illustrator", title: "Digital Illustrator & Character Designer", titleTh: "นักวาดภาพประกอบและออกแบบคาแรกเตอร์", category: "design", categoryTh: "ออกแบบ & ครีเอทีฟ" },

  // Marketing & Growth
  { id: "digital_marketer", title: "Digital Marketing Specialist", titleTh: "ผู้เชี่ยวชาญการตลาดดิจิทัล", category: "marketing", categoryTh: "การตลาด", popular: true },
  { id: "growth_marketer", title: "Growth & Performance Marketer", titleTh: "นักการตลาดสายสร้างการเติบโต", category: "marketing", categoryTh: "การตลาด", popular: true },
  { id: "seo_specialist", title: "SEO / SEM Specialist", titleTh: "ผู้เชี่ยวชาญการตลาดผ่านเสิร์ชเอนจิน", category: "marketing", categoryTh: "การตลาด" },
  { id: "content_creator", title: "Content Strategist & Copywriter", titleTh: "นักวางกลยุทธ์คอนเทนต์และนักเขียน", category: "marketing", categoryTh: "การตลาด", popular: true },
  { id: "social_media", title: "Social Media Manager", titleTh: "ผู้จัดการโซเชียลมีเดีย", category: "marketing", categoryTh: "การตลาด" },
  { id: "brand_manager", title: "Brand Communication Manager", titleTh: "ผู้จัดการสื่อสารแบรนด์", category: "marketing", categoryTh: "การตลาด" },

  // Sales & BD
  { id: "bd_executive", title: "Business Development Manager", titleTh: "ผู้จัดการฝ่ายพัฒนาธุรกิจ", category: "sales_bd", categoryTh: "งานขาย & BD", popular: true },
  { id: "account_exec", title: "Account Executive (B2B SaaS / Tech)", titleTh: "เจ้าหน้าที่บริหารงานขายลูกค้าองค์กร", category: "sales_bd", categoryTh: "งานขาย & BD", popular: true },
  { id: "sales_engineer", title: "Pre-Sales / Solutions Consultant", titleTh: "ที่ปรึกษาโซลูชันด้านการขายเชิงเทคนิค", category: "sales_bd", categoryTh: "งานขาย & BD" },
  { id: "partnership_mgr", title: "Strategic Partnerships Manager", titleTh: "ผู้จัดการฝ่ายพันธมิตรเชิงกลยุทธ์", category: "sales_bd", categoryTh: "งานขาย & BD" },

  // Customer Success
  { id: "csm", title: "Customer Success Manager (CSM)", titleTh: "ผู้จัดการฝ่ายความสำเร็จของลูกค้า", category: "customer", categoryTh: "บริการลูกค้า", popular: true },
  { id: "tech_support", title: "Technical Support Engineer", titleTh: "วิศวกรซัพพอร์ตเชิงเทคนิค", category: "customer", categoryTh: "บริการลูกค้า" },
  { id: "client_onboard", title: "Client Onboarding Specialist", titleTh: "ผู้เชี่ยวชาญการเริ่มต้นใช้งานของลูกค้า", category: "customer", categoryTh: "บริการลูกค้า" },

  // Security & Governance
  { id: "cyber_sec", title: "Cyber Security Analyst", titleTh: "นักวิเคราะห์ความมั่นคงปลอดภัยไซเบอร์", category: "security", categoryTh: "ความปลอดภัยไซเบอร์", popular: true },
  { id: "pentester", title: "Penetration Tester / Security Researcher", titleTh: "ผู้ทดสอบการเจาะระบบ (White-hat)", category: "security", categoryTh: "ความปลอดภัยไซเบอร์" },
  { id: "soc_analyst", title: "SOC & Incident Response Analyst", titleTh: "นักวิเคราะห์ศูนย์เฝ้าระวังภัยคุกคาม", category: "security", categoryTh: "ความปลอดภัยไซเบอร์" },
  { id: "dpo", title: "Data Privacy & PDPA Specialist", titleTh: "ผู้เชี่ยวชาญด้านคุ้มครองข้อมูลส่วนบุคคล", category: "security", categoryTh: "ความปลอดภัยไซเบอร์" },

  // Finance & HR
  { id: "tech_recruiter", title: "Technical Recruiter / Talent Acquisition", titleTh: "สรรหาบุคลากรสายเทคโนโลยี", category: "finance_hr", categoryTh: "HR & Finance", popular: true },
  { id: "hrbp", title: "HR Business Partner (HRBP)", titleTh: "พันธมิตรธุรกิจฝ่ายทรัพยากรบุคคล", category: "finance_hr", categoryTh: "HR & Finance", popular: true },
  { id: "financial_analyst", title: "Financial & Investment Analyst", titleTh: "นักวิเคราะห์การเงินและการลงทุน", category: "finance_hr", categoryTh: "HR & Finance" },
  { id: "accountant", title: "Corporate Accountant & Auditor", titleTh: "นักบัญชีองค์กรและผู้ตรวจสอบบัญชี", category: "finance_hr", categoryTh: "HR & Finance" },
];
