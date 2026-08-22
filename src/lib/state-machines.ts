import { QueueState, QueueTicket, InterviewState, InterviewSession, DecisionState, DecisionCase, DecisionChoice } from '../types';

// ==========================================
// 1. Queue Ticket State Transitions
// ==========================================

export function canTransitionQueue(current: QueueState, next: QueueState): boolean {
  const validTransitions: Record<QueueState, QueueState[]> = {
    QUEUED: ['PAUSED_BY_EVENT', 'READY_CHECK'],
    PAUSED_BY_EVENT: ['QUEUED'],
    READY_CHECK: ['ACCEPTED', 'QUEUED', 'EXPIRED'],
    ACCEPTED: ['CONNECTING', 'QUEUED'], // 'QUEUED' if recruiter disconnected (returned with priority)
    CONNECTING: ['IN_SESSION', 'ACCEPTED', 'EXPIRED'],
    IN_SESSION: ['COMPLETED'],
    COMPLETED: [],
    EXPIRED: ['REQUEUE_ELIGIBLE'],
    REQUEUE_ELIGIBLE: ['QUEUED']
  };

  return validTransitions[current]?.includes(next) ?? false;
}

export function transitionQueueTicket(ticket: QueueTicket, nextState: QueueState): QueueTicket {
  if (!canTransitionQueue(ticket.state, nextState)) {
    console.warn(`[Queue FSM] Invalid transition from ${ticket.state} to ${nextState}`);
    return ticket;
  }

  const updated: QueueTicket = {
    ...ticket,
    state: nextState,
    entityVersion: ticket.entityVersion + 1
  };

  if (nextState === 'READY_CHECK') {
    // 60-second ready check countdown
    const expires = new Date(Date.now() + 60 * 1000).toISOString();
    updated.readyCheckExpiresAt = expires;
  }

  if (nextState === 'QUEUED' && ticket.state === 'READY_CHECK') {
    updated.snoozeCount = ticket.snoozeCount + 1;
    delete updated.readyCheckExpiresAt;
  }

  return updated;
}

// ==========================================
// 2. Interview Session State Transitions
// ==========================================

export function canTransitionInterview(current: InterviewState, next: InterviewState): boolean {
  const validTransitions: Record<InterviewState, InterviewState[]> = {
    CREATED: ['PREFLIGHT'],
    PREFLIGHT: ['LOBBY'],
    LOBBY: ['CONNECTING', 'CANCELLED_TECHNICAL'],
    CONNECTING: ['LIVE', 'RECONNECTING'],
    LIVE: ['WRAP_UP', 'RECONNECTING', 'COMPLETED'],
    WRAP_UP: ['COMPLETED', 'RECONNECTING'],
    RECONNECTING: ['LIVE', 'CANCELLED_TECHNICAL'],
    CANCELLED_TECHNICAL: [],
    COMPLETED: []
  };

  return validTransitions[current]?.includes(next) ?? false;
}

export function transitionInterviewSession(session: InterviewSession, nextState: InterviewState): InterviewSession {
  if (!canTransitionInterview(session.state, nextState)) {
    console.warn(`[Interview FSM] Invalid transition from ${session.state} to ${nextState}`);
    return session;
  }

  return {
    ...session,
    state: nextState,
    startedAt: nextState === 'LIVE' && !session.startedAt ? new Date().toISOString() : session.startedAt
  };
}

// ==========================================
// 3. Double-Blind Decision Resolver
// ==========================================

export function submitDecision(
  currentCase: DecisionCase,
  actor: 'candidate' | 'recruiter',
  choice: DecisionChoice
): DecisionCase {
  const isCandidate = actor === 'candidate';
  const updated: DecisionCase = {
    ...currentCase,
    candidateDecision: isCandidate ? choice : currentCase.candidateDecision,
    recruiterDecision: !isCandidate ? choice : currentCase.recruiterDecision,
    submittedAtCandidate: isCandidate ? new Date().toISOString() : currentCase.submittedAtCandidate,
    submittedAtRecruiter: !isCandidate ? new Date().toISOString() : currentCase.submittedAtRecruiter
  };

  const cand = updated.candidateDecision;
  const rec = updated.recruiterDecision;

  if (cand !== null && rec !== null) {
    // Both submitted
    if (cand === 'INTERESTED' && rec === 'INTERESTED') {
      updated.state = 'MUTUAL_MATCH';
      updated.recruiterContactGrant = {
        recruiterName: 'Recruiter #R12 (Ploy)',
        recruiterEmail: 'careers@cyberorchard.test',
        recruiterRole: 'Head of Backend Engineering',
        nextStepsGuide: 'ขอแสดงความยินดีที่เกิด Mutual Match! ทีมงานจะติดต่อกลับผ่านอีเมลที่ท่านยินยอมเปิดเผยภายใน 2 วันทำการ เพื่อนัดหมายการทำ Technical Assessment รอบถัดไป'
      };
    } else {
      updated.state = 'NO_MATCH';
    }
  } else if (cand !== null || rec !== null) {
    updated.state = 'ONE_DECISION_SUBMITTED';
  }

  return updated;
}
