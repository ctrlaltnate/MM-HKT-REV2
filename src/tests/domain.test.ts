import { describe, it, expect } from 'vitest';
import {
  canTransitionQueue,
  transitionQueueTicket,
  canTransitionInterview,
  transitionInterviewSession,
  submitDecision
} from '../lib/state-machines';
import { parseAndRedactResume } from '../lib/resume-parser';
import { calculateSkillMatch } from '../lib/match-engine';
import { CANONICAL_CANDIDATE, CANONICAL_BOOTHS } from '../lib/fixtures';
import { QueueTicket, InterviewSession, DecisionCase } from '../types';

describe('1. State Machines', () => {
  it('should enforce valid queue ticket transitions', () => {
    expect(canTransitionQueue('QUEUED', 'READY_CHECK')).toBe(true);
    expect(canTransitionQueue('READY_CHECK', 'ACCEPTED')).toBe(true);
    expect(canTransitionQueue('ACCEPTED', 'CONNECTING')).toBe(true);
    expect(canTransitionQueue('CONNECTING', 'IN_SESSION')).toBe(true);
    expect(canTransitionQueue('IN_SESSION', 'COMPLETED')).toBe(true);

    // Invalid transition
    expect(canTransitionQueue('QUEUED', 'COMPLETED')).toBe(false);
  });

  it('should set 60s countdown on READY_CHECK transition and track snooze', () => {
    const ticket: QueueTicket = {
      id: 'qt_test_1',
      jobId: 'job-backend-01',
      boothId: 'company-cyber-orchard',
      companyName: 'Cyber Orchard Co.',
      jobTitle: 'Backend Developer',
      candidateId: 'cand_1',
      candidateCode: 'Candidate #8F3A',
      position: 1,
      estimatedWaitSeconds: 60,
      state: 'QUEUED',
      joinedAt: new Date().toISOString(),
      snoozeCount: 0,
      entityVersion: 1
    };

    const readyTicket = transitionQueueTicket(ticket, 'READY_CHECK');
    expect(readyTicket.state).toBe('READY_CHECK');
    expect(readyTicket.readyCheckExpiresAt).toBeDefined();

    const snoozedTicket = transitionQueueTicket(readyTicket, 'QUEUED');
    expect(snoozedTicket.state).toBe('QUEUED');
    expect(snoozedTicket.snoozeCount).toBe(1);
  });

  it('should accurately resolve double-blind decisions', () => {
    const initialCase: DecisionCase = {
      id: 'case_test_1',
      sessionId: 'sess_1',
      jobId: 'job-backend-01',
      boothId: 'company-cyber-orchard',
      companyName: 'Cyber Orchard Co.',
      jobTitle: 'Backend Developer',
      candidateCode: 'Candidate #8F3A',
      candidateDecision: null,
      recruiterDecision: null,
      state: 'AWAITING_DECISIONS',
      revealedFields: []
    };

    // 1. Candidate submits INTERESTED
    const candSubmitted = submitDecision(initialCase, 'candidate', 'INTERESTED');
    expect(candSubmitted.state).toBe('ONE_DECISION_SUBMITTED');
    expect(candSubmitted.candidateDecision).toBe('INTERESTED');
    expect(candSubmitted.recruiterDecision).toBeNull();

    // 2. Recruiter submits INTERESTED -> MUTUAL MATCH
    const mutualCase = submitDecision(candSubmitted, 'recruiter', 'INTERESTED');
    expect(mutualCase.state).toBe('MUTUAL_MATCH');
    expect(mutualCase.recruiterContactGrant).toBeDefined();

    // 3. One party submits PASS -> NO MATCH
    const noMatchCase = submitDecision(candSubmitted, 'recruiter', 'PASS');
    expect(noMatchCase.state).toBe('NO_MATCH');
  });
});

describe('2. PII Redaction & Parser Engine', () => {
  it('should detect and redact sensitive identity information', () => {
    const resumeText = `สมชาย ประเสริฐดี อีเมล somchai@example.test เบอร์ 081-234-5678 จบจาก King Mongkut's University ทำงานที่ TechCo Innovations`;
    const result = parseAndRedactResume(resumeText);

    expect(result.detectedPii.email).toBe('somchai@example.test');
    expect(result.sanitizedText).toContain('[REDACTED: EMAIL]');
    expect(result.sanitizedText).toContain('[REDACTED: PHONE]');
    expect(result.sanitizedText).not.toContain('somchai@example.test');
    expect(result.extractedSkills.length).toBeGreaterThan(0);
  });
});

describe('3. Explainable Match Scoring Engine', () => {
  it('should calculate accurate match score with reasons for Cyber Orchard job', () => {
    const job = CANONICAL_BOOTHS[0].activeJobs[0];
    const result = calculateSkillMatch(
      CANONICAL_CANDIDATE.skills,
      CANONICAL_CANDIDATE.evidence,
      job
    );

    expect(result.score).toBeGreaterThanOrEqual(80);
    expect(result.reasons.length).toBeGreaterThanOrEqual(2);
    expect(result.isEligible).toBe(true);
  });
});
