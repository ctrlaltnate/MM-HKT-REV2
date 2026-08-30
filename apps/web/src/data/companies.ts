export type CompanyValue = {
  title: string;
  desc: string;
};

export type Company = {
  id: string;
  name: string;
  shortName: string;
  badge: string;
  industry: string;
  tagline: string;
  description: string;
  location: string;
  website: string;
  tone: "cyan" | "violet" | "mango" | "green" | "coral";
  values: CompanyValue[];
  culture: string[];
  products: string[];
  perks: string[];
};

export const sponsorCompanies: Record<string, Company> = {
  microsoft: {
    id: "microsoft",
    name: "Microsoft (Thailand)",
    shortName: "Microsoft",
    badge: "MSFT",
    industry: "Enterprise Cloud & AI Technology",
    tagline: "Empowering every person and organization on the planet to achieve more",
    description:
      "ผู้นำเทคโนโลยีคลาวด์ ปัญญาประดิษฐ์ (Azure OpenAI / Copilot) และโซลูชันซอฟต์แวร์ระดับโลกที่ขับเคลื่อนการเปลี่ยนผ่านสู่ดิจิทัลขององค์กรชั้นนำทั่วโลก",
    location: "Bangkok · Hybrid (All Seasons Place, Wireless Rd.)",
    website: "https://www.microsoft.com/th-th",
    tone: "cyan",
    values: [
      { title: "Growth Mindset", desc: "เรียนรู้สิ่งใหม่ตลอดเวลา กล้าทดลอง และเปิดรับความคิดเห็นเพื่อการพัฒนาที่ไม่หยุดนิ่ง" },
      { title: "Customer Obsession", desc: "ฟังและเข้าใจลูกค้าอย่างลึกซึ้ง เพื่อสร้างนวัตกรรมที่แก้ปัญหาได้จริงและยั่งยืน" },
      { title: "Diversity & Inclusion", desc: "ยอมรับและให้เกียรติความหลากหลาย เปิดโอกาสให้ทุกคนแสดงศักยภาพสูงสุด" },
      { title: "One Microsoft", desc: "ร่วมมือกันข้ามทีมอย่างไร้รอยต่อ เพื่อมอบคุณค่าที่ยิ่งใหญ่ที่สุดให้กับผู้ใช้งาน" },
    ],
    culture: [
      "เน้น Psychological Safety และให้คุณค่ากับไอเดียของทุกคน",
      "การทำงานแบบ Flexible & Hybrid ที่เน้นผลลัพธ์ (Outcome-based)",
      "สัปดาห์ Hackathon ระดับโลกปีละครั้งเพื่อสร้างสรรค์นวัตกรรมใหม่",
      "โปรแกรม Mentorship และส่งเสริมการเรียนรู้ระดับสากล",
    ],
    products: [
      "Microsoft Azure & Azure OpenAI Service",
      "Microsoft 365 & Copilot for Enterprise",
      "GitHub & Developer Tools",
      "Microsoft Dynamics 365 & Power Platform",
    ],
    perks: [
      "Hybrid work ยืดหยุ่นสูงสุด",
      "งบอบรมและสอบใบรับรอง Microsoft Certifications ฟรีไม่จำกัด",
      "ประกันสุขภาพครอบคลุมครอบครัวและทันตกรรมระดับพรีเมียม",
      "Wellness & Fitness Allowance ประจำปี",
    ],
  },
  lineman: {
    id: "lineman",
    name: "LINE MAN Wongnai",
    shortName: "LINE MAN",
    badge: "LMNW",
    industry: "On-demand Food Delivery & Lifestyle Platform",
    tagline: "Help Thai People Live Better & Empower Local Businesses",
    description:
      "เทคคอมพานีสัญชาติไทย-ระดับยูนิคอร์น ผู้นำแพลตฟอร์ม On-demand Delivery สั่งอาหาร เรียกรถ ส่งพัสดุ บริการรีวิวร้านอาหารอันดับ 1 และโซลูชันร้านอาหาร Wongnai POS",
    location: "Bangkok · Hybrid (T-One Building, Thonglor)",
    website: "https://www.linemanwongnai.com",
    tone: "green",
    values: [
      { title: "Innovate Fast", desc: "คิดเร็ว ทำเร็ว ปรับตัวไว และกล้าทดลองสร้างสิ่งใหม่เพื่อผู้ใช้งานคนไทย" },
      { title: "Respect Everyone", desc: "เคารพเพื่อนร่วมงาน ลูกค้า ร้านค้า และไรเดอร์ รับฟังความคิดเห็นอย่างเท่าเทียม" },
      { title: "Passion for Impact", desc: "มุ่งมั่นสร้างผลกระทบเชิงบวกต่อชีวิตประจำวันของคนไทยและเศรษฐกิจท้องถิ่น" },
    ],
    culture: [
      "บรรยากาศ Startup พลังงานสูง ไร้ระบบลำดับขั้น (Flat hierarchy)",
      "ตัดสินใจด้วย Data & Experimentation จริง ไม่ใช้ความรู้สึก",
      "ทีมวิศวกรและ Product ทำงานร่วมกันแบบ Agile Squads",
      "เปิดรับ Feedback ตรงไปตรงมา (Radical Candor)",
    ],
    products: [
      "LINE MAN On-demand Super App (Food, Mart, Messenger, Taxi)",
      "Wongnai Restaurant Review & Lifestyle Community",
      "Wongnai POS โซลูชันระบบจัดการร้านอาหารอันดับ 1 ในไทย",
      "LINE MAN Ads & Merchant Solutions",
    ],
    perks: [
      "LINE MAN Credit เครดิตสั่งอาหารฟรีทุกเดือน",
      "สวัสดิการอาหารกลางวันและเครื่องดื่มฟรีที่ออฟฟิศ",
      "Flexible working hours และ Hybrid work",
      "MacBook Pro ประสิทธิภาพสูงสำหรับทีมวิศวกรทุกคน",
    ],
  },
  canva: {
    id: "canva",
    name: "Canva",
    shortName: "Canva",
    badge: "CANVA",
    industry: "Visual Communication & Design Platform",
    tagline: "Empowering the world to design anything and publish anywhere",
    description:
      "แพลตฟอร์มการออกแบบภาพและสื่อสร้างสรรค์ระดับโลกที่ปฏิวัติวงการครีเอทีฟ ด้วยเครื่องมือที่ทรงพลัง ใช้งานง่าย และเสริมพลังด้วย Magic AI",
    location: "Bangkok & Sydney · Hybrid",
    website: "https://www.canva.com",
    tone: "violet",
    values: [
      { title: "Make the World a Better Place", desc: "ใช้เทคโนโลยีและการเติบโตขององค์กรเป็นแรงผลักดันเพื่อสังคมที่ดีขึ้น" },
      { title: "Empower Others", desc: "สร้างสรรค์เครื่องมือที่ช่วยให้ทุกคนปลดปล่อยความคิดสร้างสรรค์ได้ง่ายดาย" },
      { title: "Set Crazy Big Goals", desc: "ตั้งเป้าหมายที่ยิ่งใหญ่ ท้าทาย และร่วมมือกันทำให้กลายเป็นจริง" },
      { title: "Be a Good Human", desc: "มีความเห็นอกเห็นใจ ทำงานด้วยความซื่อสัตย์ และสนับสนุนเพื่อนร่วมงานเสมอ" },
    ],
    culture: [
      "วัฒนธรรมการเฉลิมฉลองความสำเร็จและส่งเสริมความสุขในการทำงาน",
      "การทำงานแบบเน้นผู้ใช้เป็นศูนย์กลาง (User-obsessed UX)",
      "เปิดรับความหลากหลายและภูมิหลังที่แตกต่างจากทั่วโลก",
      "มีอิสระในการนำเสนอไอเดียและการออกแบบฟีเจอร์ใหม่ๆ",
    ],
    products: [
      "Canva Visual Suite (Docs, Presentations, Whiteboards, Video)",
      "Canva Magic Studio (Generative AI Design Tools)",
      "Canva for Teams & Enterprise",
      "Canva Print & Global Marketplace",
    ],
    perks: [
      "Canva Pro ฟรีตลอดชีพสำหรับพนักงานและครอบครัว",
      "งบสำหรับสร้าง Home Office และ Ergonomic Equipment",
      "Learning & Growth Stipend รายปี",
      "วันลาเพื่อการพักผ่อนและดูแลสุขภาพจิต (Mental Health Days)",
    ],
  },
  mfec: {
    id: "mfec",
    name: "MFEC Public Company Limited",
    shortName: "MFEC",
    badge: "MFEC",
    industry: "Enterprise IT Services & Cybersecurity",
    tagline: "Inspiring Future, Enhancing Life with Digital Solutions",
    description:
      "ผู้ให้บริการที่ปรึกษา พัฒนาระบบไอที ความปลอดภัยทางไซเบอร์ และคลาวด์โซลูชันชั้นนำของประเทศไทยที่ได้รับความไว้วางใจจากสถาบันการเงินและองค์กรยักษ์ใหญ่",
    location: "Bangkok · Hybrid (SJ Infinite One Complex, Chatuchak)",
    website: "https://www.mfec.co.th",
    tone: "cyan",
    values: [
      { title: "Customer Centricity", desc: "มุ่งมั่นส่งมอบโซลูชันที่ตรงโจทย์และสร้างมูลค่าสูงสุดให้กับพันธมิตรธุรกิจ" },
      { title: "Continuous Learning", desc: "ไม่หยุดพัฒนาทักษะทางเทคโนโลยีให้ทันต่อความเปลี่ยนแปลงระดับโลก" },
      { title: "Teamwork & Integrity", desc: "ทำงานเป็นทีมด้วยความโปร่งใส ยึดมั่นในจริยธรรมวิชาชีพ" },
    ],
    culture: [
      "ศูนย์รวม Tech Experts และ Certified Engineers แถวหน้าของไทย",
      "เปิดกว้างให้ทดลองและสร้าง Solution ด้วยเทคโนโลยีใหม่ล่าสุด",
      "ส่งเสริมการแชร์ความรู้ผ่าน Tech Talk ภายในและ Knowledge Community",
      "การทำงานที่มุ่งเน้นคุณภาพ มาตรฐาน ISO และ Best Practices",
    ],
    products: [
      "Next-Gen Security Operations Center (SOC) & Cyber Defense",
      "Enterprise Cloud Migration & Infrastructure Automation",
      "Big Data Analytics & AI Platform Integration",
      "Custom Enterprise Software Development & DevOps Solutions",
    ],
    perks: [
      "สนับสนุนค่าสอบ Certificate สากล (AWS, Azure, CISSP, CEH) เต็มจำนวน",
      "โบนัสตามผลงานและ Incentive โครงการ",
      "ประกันสุขภาพกลุ่มและตรวจสุขภาพประจำปีชั้นนำ",
      "กิจกรรมชมรมกีฬา บอร์ดเกม และ Esports ภายใน",
    ],
  },
  muvmi: {
    id: "muvmi",
    name: "MuvMi (Urban Mobility Tech)",
    shortName: "muvmi",
    badge: "MVM",
    industry: "Clean Energy & Smart Micro-Transit",
    tagline: "Smart, Clean, Affordable Urban Mobility for Everyone",
    description:
      "สตาร์ทอัพเทคโนโลยีผู้บุกเบิกบริการรถตุ๊กตุ๊กไฟฟ้าแบบ On-demand รายแรกในไทย ขับเคลื่อนด้วยพลังงานสะอาด อัลกอริทึมแชร์เส้นทางอัจฉริยะ และลดมลพิษในเมือง",
    location: "Bangkok · Hybrid (Banthat Thong / Samyan)",
    website: "https://www.muvmi.co",
    tone: "green",
    values: [
      { title: "Sustainability First", desc: "มุ่งมั่นลดการปล่อยคาร์บอนและสร้างเมืองที่น่าอยู่ด้วยพลังงานสะอาด 100%" },
      { title: "Smart Mobility", desc: "ใช้อัลกอริทึมและข้อมูลเพื่อทำให้การเดินทางสะดวก ปลอดภัย และราคาเข้าถึงได้" },
      { title: "Community Impact", desc: "เชื่อมต่อชุมชน ระบบขนส่งมวลชน และสร้างคุณภาพชีวิตที่ดีขึ้นให้กับคนเมือง" },
    ],
    culture: [
      "Green Tech Startup ไฟแรง มุ่งมั่นแก้ปัญหาการจราจรและมลพิษในกรุงเทพฯ",
      "ผสานงานระหว่าง Software, IoT Hardware และ City Operations",
      "เปิดโอกาสให้ลงมือทำจริง เห็นผลกระทบของการเปลี่ยนแปลงได้ทันที",
      "ทำงานร่วมกันอย่างกระตือรือร้น ใกล้ชิด และเป็นกันเอง",
    ],
    products: [
      "MuvMi Ridesharing Mobile App (iOS / Android)",
      "Smart EV Fleet Dynamic Routing & Dispatch Algorithm",
      "IoT Telemetry & Battery Swapping Management Platform",
      "Corporate & Campus Green Transit Partnerships",
    ],
    perks: [
      "สิทธิ์นั่ง MuvMi เดินทางในกรุงเทพฯ ฟรี",
      "กองทุนสนับสนุนการเดินทางด้วยพลังงานสะอาด",
      "เวลาทำงานยืดหยุ่นและการทำงานแบบ Hybrid",
      "ส่วนลดร้านอาหารและคาเฟ่พาร์ตเนอร์ย่านสามย่าน-บรรทัดทอง",
    ],
  },
  jobthai: {
    id: "jobthai",
    name: "JobThai",
    shortName: "Jobthai",
    badge: "JOBTHAI",
    industry: "Career Platform & HR Technology",
    tagline: "Connecting Opportunities, Empowering Thai Workforce",
    description:
      "แพลตฟอร์มหางาน สมัครงาน และค้นหาบุคลากรอันดับหนึ่งของคนไทยที่อยู่คู่ตลาดแรงงานมากว่า 20 ปี พร้อมขับเคลื่อนด้วย AI Matching และ Career Intelligence",
    location: "Bangkok · Hybrid (Phayathai / Ari)",
    website: "https://www.jobthai.com",
    tone: "coral",
    values: [
      { title: "Trust & Transparency", desc: "สร้างความน่าเชื่อถือและเป็นตัวกลางที่โปร่งใสระหว่างผู้สมัครและผู้ประกอบการ" },
      { title: "Human Empowerment", desc: "เชื่อมั่นในศักยภาพของคน และมุ่งมั่นช่วยให้ทุกคนได้ทำงานที่ตรงกับความฝัน" },
      { title: "Continuous Innovation", desc: "ปรับปรุงเทคโนโลยีและประสบการณ์ใช้งานอย่างต่อเนื่องเพื่อตลาดแรงงานยุคใหม่" },
    ],
    culture: [
      "องค์กรที่มั่นคง ผสานความอบอุ่นแบบครอบครัวเข้ากับความทันสมัย",
      "ให้ความสำคัญกับ Work-Life Balance และสุขภาพจิตของพนักงาน",
      "รับฟังความคิดเห็นของคนรุ่นใหม่และเปิดรับเทคโนโลยีใหม่ๆ เสมอ",
      "มีความภาคภูมิใจที่ได้ช่วยเหลือคนไทยนับล้านให้มีงานทำ",
    ],
    products: [
      "JobThai Web & Mobile Application",
      "JobThai Career Insights & Salary Benchmark Data",
      "AI Talent Search & ATS for Enterprises",
      "JobThai Platform for Universities & Job Fairs",
    ],
    perks: [
      "Hybrid Work สัปดาห์ละ 2-3 วัน",
      "งบสัมมนาและคอร์สพัฒนาทักษะวิชาชีพ",
      "ตรวจสุขภาพประจำปีและประกันสุขภาพกลุ่มครอบคลุม OPD/IPD",
      "เงินช่วยเหลือพิเศษในโอกาสต่างๆ และโบนัสประจำปี",
    ],
  },
  ifdrink: {
    id: "ifdrink",
    name: "if (General Beverage)",
    shortName: "if Fruit Juice",
    badge: "IF",
    industry: "FMCG Natural Beverage & Global Export",
    tagline: "Pure Natural Taste, Refreshing the World with Thai Quality",
    description:
      "ผู้ผลิตและจัดจำหน่ายเครื่องดื่มน้ำผลไม้แท้และน้ำมะพร้าว 100% แบรนด์ 'if' ที่ได้รับความนิยมสูงสุด ส่งออกไปยังกว่า 30 ประเทศทั่วโลก",
    location: "Bangkok & Factory · On-site / Hybrid",
    website: "https://www.generalbeverage.co.th",
    tone: "coral",
    values: [
      { title: "Health & Quality First", desc: "คัดสรรวัตถุดิบธรรมชาติที่ดีที่สุดและรักษามาตรฐานความปลอดภัยอาหารระดับสากล" },
      { title: "Global Ambition", desc: "มุ่งมั่นนำรสชาติความเป็นไทยและสินค้าคุณภาพสูงไปสู่ผู้บริโภคทั่วทุกมุมโลก" },
      { title: "Consumer Obsession", desc: "ส่งมอบความสดชื่น รสชาติพรีเมียม และความพึงพอใจสูงสุดให้กับผู้บริโภค" },
    ],
    culture: [
      "องค์กรธุรกิจสากลที่เติบโตรวดเร็วและมีพลวัตสูง",
      "การทำงานข้ามวัฒนธรรมร่วมกับคู่ค้าในเอเชีย ยุโรป และอเมริกา",
      "มุ่งเน้นความเป็นมืออาชีพ ความคิดริเริ่ม และความแม่นยำในการปฏิบัติงาน",
      "ส่งเสริมความเป็นเจ้าของงาน (Ownership) ในทุกตำแหน่ง",
    ],
    products: [
      "if 100% Natural Coconut Water (Global Export Bestseller)",
      "if Local Fruit Juice & Herbal Drinks",
      "if Sparkling & Functional Wellness Beverages",
      "OEM & High-Standard Beverage Manufacturing Services",
    ],
    perks: [
      "เครื่องดื่มแบรนด์ if ดื่มฟรีไม่อั้นที่ออฟฟิศ",
      "โอกาสเดินทางไปปฏิบัติงานและดูงานต่างประเทศ",
      "ประกันสุขภาพ ประกันอุบัติเหตุ และโบนัสผลประกอบการ",
      "ส่วนลดสินค้าในเครือราคาพิเศษสำหรับพนักงาน",
    ],
  },
  julians: {
    id: "julians",
    name: "Julian's The Spa",
    shortName: "Julian's Spa",
    badge: "JSP",
    industry: "Luxury Wellness & Spa Hospitality",
    tagline: "Serenity, Holistic Care, and Exceptional Wellness Sanctuary",
    description:
      "สปาและศูนย์สุขภาพระดับลักชัวรีที่มอบการบำบัดฟื้นฟูร่างกายและจิตใจแบบองค์รวม ด้วยศาสตร์การนวดระดับพรีเมียมและผลิตภัณฑ์ออร์แกนิกชั้นเลิศ",
    location: "Bangkok (Sukhumvit / Silom)",
    website: "https://www.julians-spa.com",
    tone: "violet",
    values: [
      { title: "Exceptional Service", desc: "ส่งมอบความใส่ใจ ความประณีต และการดูแลลูกค้าอย่างอบอุ่นในทุกรายละเอียด" },
      { title: "Holistic Wellbeing", desc: "ผสานสมดุลระหว่างกายและใจเพื่อสุขภาพที่ยั่งยืนของผู้รับบริการ" },
      { title: "Organic & Sustainable", desc: "เลือกใช้ผลิตภัณฑ์ธรรมชาติที่ไม่ทำลายสิ่งแวดล้อมและปลอดภัยสูงสุด" },
    ],
    culture: [
      "สภาพแวดล้อมการทำงานที่เงียบสงบ สบายใจ และเต็มไปด้วยความเห็นอกเห็นใจ",
      "ฝึกอบรมมาตรฐานการบริการระดับ 5 ดาวอย่างต่อเนื่อง",
      "ให้เกียรติและสนับสนุนทีมงานด้านการบริการอย่างแท้จริง",
      "มุ่งเน้นความพึงพอใจและความผูกพันระยะยาวของลูกค้า",
    ],
    products: [
      "Signature Aromatherapy & Traditional Thai Healing Massages",
      "Organic Facial & Body Detox Treatments",
      "Julian's Private Wellness Retreats & VIP Suites",
      "Julian's Organic Spa & Skincare Product Line",
    ],
    perks: [
      "สิทธิ์ใช้บริการทรีตเมนต์สปาฟรีทุกเดือน",
      "ส่วนลดพิเศษสำหรับผลิตภัณฑ์บำรุงผิวและของใช้สปา",
      "หลักสูตรพัฒนาทักษะการบริหารงานสปาระดับพรีเมียม",
      "ยูนิฟอร์มและอาหารระหว่างกะการทำงาน",
    ],
  },
  techspark: {
    id: "techspark",
    name: "Tech Career Spark",
    shortName: "Tech Career Spark",
    badge: "SPARK",
    industry: "Tech Talent Community & Career Accelerator",
    tagline: "Igniting Tech Talents, Bridging the Digital Skills Gap",
    description:
      "คอมมูนิตี้และสถาบันบ่มเพาะทักษะสายเทคโนโลยีที่มุ่งเน้นการ Upskill/Reskill จัดกิจกรรม Hackathon และเชื่อมโยงคนรุ่นใหม่เข้าสู่สายงานดิจิทัล",
    location: "Bangkok · Hybrid (Siam / Samyan)",
    website: "https://www.techcareerspark.io",
    tone: "mango",
    values: [
      { title: "Empower Next-Gen", desc: "ปลดล็อกศักยภาพคนรุ่นใหม่ให้ก้าวสู่วงการเทคโนโลยีอย่างมั่นใจและเท่าเทียม" },
      { title: "Practical Learning", desc: "เรียนรู้จากการลงมือทำจริงด้วยโจทย์จริงจากภาคอุตสาหกรรม" },
      { title: "Community First", desc: "สร้างพื้นที่ปลอดภัยในการแลกเปลี่ยนความรู้ แบ่งปันประสบการณ์ และเป็นพี่เลี้ยงให้กัน" },
    ],
    culture: [
      "ชุมชนการเรียนรู้ที่เต็มไปด้วยพลัง ความกระตือรือร้น และความคิดสร้างสรรค์",
      "ทำงานใกล้ชิดกับบริษัทเทคชั้นนำและ Tech Leaders ระดับประเทศ",
      "เปิดรับการทดลองรูปแบบการสอนและอีเวนต์ใหม่ๆ เสมอ",
      "สนับสนุนการเติบโตของทุกคนโดยไม่จำกัดวุฒิการศึกษา",
    ],
    products: [
      "Tech Career Intensive Bootcamps & Workshops",
      "Industry Hackathon & Ideation Challenge Organizing",
      "1-on-1 Career Mentorship & Portfolio Clinics",
      "Tech Talent Community Platform & Networking Events",
    ],
    perks: [
      "เข้าร่วมคอร์สและเวิร์กช็อปสายเทคฟรีทั้งหมด",
      "โอกาสพบปะและสร้างคอนเนกชันกับ Tech Influencers ชั้นนำ",
      "เวลาทำงานยืดหยุ่น เหมาะกับ Life-long Learners",
      "งบหนังสือและคอร์สออนไลน์ระดับโลก (Coursera, Udemy, etc.)",
    ],
  },
  shakesphere: {
    id: "shakesphere",
    name: "SHAKESPHERE",
    shortName: "SHAKESPHERE",
    badge: "SHK",
    industry: "Innovative Fitness & Lifestyle Gear",
    tagline: "Engineered for Performance, Redefining Fitness Accessories",
    description:
      "แบรนด์อุปกรณ์ฟิตเนสและกระบอกเชคเกอร์ทรงแคปซูลระดับพรีเมียมที่ปฏิวัติการผสมโปรตีนด้วยดีไซน์ไร้ตะแกรงที่ได้รับรางวัลระดับโลก",
    location: "Bangkok & Global · Hybrid",
    website: "https://shakesphere.com",
    tone: "mango",
    values: [
      { title: "Engineering Excellence", desc: "ออกแบบทุกผลิตภัณฑ์ด้วยหลักวิทยาศาสตร์และวิศวกรรมเพื่อประสิทธิภาพสูงสุด" },
      { title: "Active Lifestyle", desc: "ส่งเสริมการมีสุขภาพที่ดีและการออกกำลังกายในชีวิตประจำวัน" },
      { title: "Uncompromising Quality", desc: "ใช้วัสดุเกรดพรีเมียม ทนทาน และเป็นมิตรต่อสิ่งแวดล้อม" },
    ],
    culture: [
      "ทีมงานที่หลงใหลในกีฬา สุขภาพ และดีไซน์ผลิตภัณฑ์",
      "การทำงานสไตล์ Fast-paced และเน้นความคิดสร้างสรรค์",
      "สนับสนุนให้พนักงานออกกำลังกายและมีไลฟ์สไตล์ที่แอคทีฟ",
      "ให้ความสำคัญกับ Product Feedback และความพึงพอใจของลูกค้า",
    ],
    products: [
      "SHAKESPHERE Capsule Tumbler & Protein Shakers",
      "Thermal Insulated Hydration Bottles",
      "Pro Athlete Gear & Fitness Storage Accessories",
      "Custom Co-Branding & Sports Merchandising",
    ],
    perks: [
      "Gym / Fitness Membership Allowance รายเดือน",
      "กระบอกน้ำและสินค้า SHAKESPHERE คอลเลกชันใหม่ฟรี",
      "เวลาทำงานยืดหยุ่น",
      "กิจกรรมออกกำลังกายและ Teambuilding สไตล์สายสปอร์ต",
    ],
  },
};
