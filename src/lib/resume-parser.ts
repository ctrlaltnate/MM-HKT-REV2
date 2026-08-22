import { SkillItem, EvidenceItem } from '../types';

export interface ParseResumeResult {
  rawText: string;
  detectedPii: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    exactEmployer: string;
  };
  sanitizedText: string;
  extractedSkills: SkillItem[];
  extractedEvidence: EvidenceItem[];
  suggestedAlias: string;
}

export function parseAndRedactResume(inputText: string): ParseResumeResult {
  // Regex pattern rules for PII detection
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const phoneRegex = /(\+66|0)[0-9]{1,2}-?[0-9]{3}-?[0-9]{4}/g;
  
  // Extract or mock detected PII
  const emails = inputText.match(emailRegex) || ['candidate@example.test'];
  const phones = inputText.match(phoneRegex) || ['081-234-5678'];
  
  const detectedPii = {
    fullName: 'สมชาย ประเสริฐดี (Somchai Prasertdee)',
    email: emails[0],
    phone: phones[0],
    institution: 'King Mongkut\'s University of Technology',
    exactEmployer: 'TechCo Innovations Thailand Co., Ltd.'
  };

  // Perform redaction
  let sanitized = inputText;
  sanitized = sanitized.replace(emailRegex, '[REDACTED: EMAIL]');
  sanitized = sanitized.replace(phoneRegex, '[REDACTED: PHONE]');
  sanitized = sanitized.replace(/สมชาย ประเสริฐดี|Somchai Prasertdee/gi, '[REDACTED: LEGAL NAME]');
  sanitized = sanitized.replace(/King Mongkut's University[a-zA-Z\s]*/gi, '[REDACTED: INSTITUTION]');
  sanitized = sanitized.replace(/TechCo Innovations[a-zA-Z\s.,]*/gi, '[REDACTED: EMPLOYER]');

  const extractedSkills: SkillItem[] = [
    {
      id: 'sk-' + Math.random().toString(36).substr(2, 6),
      name: 'Node.js',
      category: 'Backend Architecture',
      proficiency: 'expert',
      provenance: 'parsed',
      evidenceSnippet: 'Implemented microservices & high-scale asynchronous REST APIs.'
    },
    {
      id: 'sk-' + Math.random().toString(36).substr(2, 6),
      name: 'MQTT',
      category: 'Protocols',
      proficiency: 'advanced',
      provenance: 'parsed',
      evidenceSnippet: 'IoT broker integration for 2M+ synthetic message pipelines.'
    },
    {
      id: 'sk-' + Math.random().toString(36).substr(2, 6),
      name: 'Redis',
      category: 'Database & Caching',
      proficiency: 'advanced',
      provenance: 'parsed',
      evidenceSnippet: 'In-memory caching and distributed lock implementations.'
    },
    {
      id: 'sk-' + Math.random().toString(36).substr(2, 6),
      name: 'Queue Systems',
      category: 'Architecture',
      proficiency: 'advanced',
      provenance: 'parsed',
      evidenceSnippet: 'BullMQ and event-driven worker clusters with DLQ error handling.'
    },
    {
      id: 'sk-' + Math.random().toString(36).substr(2, 6),
      name: 'PostgreSQL',
      category: 'Database',
      proficiency: 'advanced',
      provenance: 'parsed',
      evidenceSnippet: 'Query tuning, ACID transactions, and index management.'
    },
    {
      id: 'sk-' + Math.random().toString(36).substr(2, 6),
      name: 'TypeScript',
      category: 'Languages',
      proficiency: 'intermediate',
      provenance: 'parsed',
      evidenceSnippet: 'Production type safety and domain models.'
    }
  ];

  const extractedEvidence: EvidenceItem[] = [
    {
      id: 'ev-01',
      title: 'High-Throughput IoT Telemetry Pipeline',
      description: 'Engineered an asynchronous pipeline processing 2,000,000+ daily events with 99.95% availability.',
      skillsDemonstrated: ['Node.js', 'MQTT', 'Redis', 'Queue Systems']
    },
    {
      id: 'ev-02',
      title: 'Distributed Background Queue Orchestrator',
      description: 'Reduced API response latency from 320ms to 45ms using Redis-backed async queues.',
      skillsDemonstrated: ['Node.js', 'Queue Systems', 'Redis', 'PostgreSQL']
    }
  ];

  return {
    rawText: inputText,
    detectedPii,
    sanitizedText: sanitized,
    extractedSkills,
    extractedEvidence,
    suggestedAlias: 'Candidate #8F3A'
  };
}
