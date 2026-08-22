import { useState, useEffect } from 'react';
import {
  UserRole,
  MaskedCandidateProfile,
  QueueTicket,
  InterviewSession,
  DecisionCase,
  ExhibitorBooth,
  EventState,
  DecisionChoice,
  AvatarCustomizationConfig
} from '../types';
import {
  CANONICAL_CANDIDATE,
  CANONICAL_BOOTHS,
  INITIAL_EVENT_STATE
} from './fixtures';
import {
  transitionQueueTicket,
  transitionInterviewSession,
  submitDecision
} from './state-machines';

const STORAGE_KEY = 'maskedmatch_state_v2.1';
const CHANNEL_NAME = 'maskedmatch_channel_v2.1';

export interface AppState {
  userRole: UserRole;
  candidateProfile: MaskedCandidateProfile;
  activeTicket: QueueTicket | null;
  activeInterview: InterviewSession | null;
  activeDecisionCase: DecisionCase | null;
  booths: ExhibitorBooth[];
  eventState: EventState;
  activePreset: string;
}

const getInitialState = (): AppState => {
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage', e);
  }

  return {
    userRole: 'candidate',
    candidateProfile: { ...CANONICAL_CANDIDATE },
    activeTicket: null,
    activeInterview: null,
    activeDecisionCase: null,
    booths: [...CANONICAL_BOOTHS],
    eventState: { ...INITIAL_EVENT_STATE },
    activePreset: 'Happy Match'
  };
};

let globalState: AppState = getInitialState();
const listeners = new Set<(state: AppState) => void>();

let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
  broadcastChannel.onmessage = (event) => {
    if (event.data && typeof event.data === 'object') {
      globalState = event.data;
      listeners.forEach((listener) => listener(globalState));
    }
  };
} catch (e) {
  console.warn('BroadcastChannel not supported in this environment', e);
}

function persistAndBroadcast(nextState: AppState) {
  globalState = nextState;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  } catch (e) {
    console.error('LocalStorage write failed', e);
  }
  listeners.forEach((listener) => listener(globalState));
  if (broadcastChannel) {
    broadcastChannel.postMessage(globalState);
  }
}

export const useAppStore = () => {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const handleChange = (newState: AppState) => setState(newState);
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const setUserRole = (userRole: UserRole) => {
    persistAndBroadcast({ ...globalState, userRole });
  };

  const updateCandidateProfile = (updates: Partial<MaskedCandidateProfile>) => {
    const candidateProfile = { ...globalState.candidateProfile, ...updates };
    persistAndBroadcast({ ...globalState, candidateProfile });
  };

  const updateAvatarConfig = (avatarConfig: AvatarCustomizationConfig) => {
    const candidateProfile = {
      ...globalState.candidateProfile,
      avatarConfig
    };
    persistAndBroadcast({ ...globalState, candidateProfile });
  };

  const joinQueue = (jobId: string, boothId: string) => {
    const booth = globalState.booths.find((b) => b.id === boothId);
    const job = booth?.activeJobs.find((j) => j.id === jobId);
    if (!booth || !job) return;

    // Single active ticket invariant
    if (globalState.activeTicket && globalState.activeTicket.state !== 'COMPLETED' && globalState.activeTicket.state !== 'EXPIRED') {
      return;
    }

    const newTicket: QueueTicket = {
      id: 'qt_' + Math.random().toString(36).substr(2, 9),
      jobId,
      boothId,
      companyName: booth.companyName,
      jobTitle: job.title,
      candidateId: globalState.candidateProfile.candidateId,
      candidateCode: globalState.candidateProfile.candidateCode,
      position: booth.queueCount + 1,
      estimatedWaitSeconds: (booth.queueCount + 1) * 3 * 60,
      state: 'QUEUED',
      joinedAt: new Date().toISOString(),
      snoozeCount: 0,
      entityVersion: 1
    };

    const updatedBooths = globalState.booths.map((b) =>
      b.id === boothId ? { ...b, queueCount: b.queueCount + 1 } : b
    );

    const eventState = {
      ...globalState.eventState,
      activeQueues: globalState.eventState.activeQueues + 1
    };

    persistAndBroadcast({
      ...globalState,
      activeTicket: newTicket,
      booths: updatedBooths,
      eventState
    });
  };

  const leaveQueue = () => {
    if (!globalState.activeTicket) return;
    const boothId = globalState.activeTicket.boothId;
    const updatedBooths = globalState.booths.map((b) =>
      b.id === boothId ? { ...b, queueCount: Math.max(0, b.queueCount - 1) } : b
    );

    const eventState = {
      ...globalState.eventState,
      activeQueues: Math.max(0, globalState.eventState.activeQueues - 1)
    };

    persistAndBroadcast({
      ...globalState,
      activeTicket: null,
      booths: updatedBooths,
      eventState
    });
  };

  const respondReadyCheck = (action: 'ACCEPT' | 'SNOOZE' | 'DECLINE') => {
    if (!globalState.activeTicket) return;

    if (action === 'ACCEPT') {
      const updatedTicket = transitionQueueTicket(globalState.activeTicket, 'ACCEPTED');
      // Create Interview Session atomic
      const newSession: InterviewSession = {
        id: 'sess_' + Math.random().toString(36).substr(2, 9),
        ticketId: updatedTicket.id,
        candidateId: updatedTicket.candidateId,
        candidateCode: updatedTicket.candidateCode,
        recruiterId: 'rec_cyber_r12',
        recruiterName: 'Recruiter #R12 (Ploy)',
        companyName: updatedTicket.companyName,
        jobTitle: updatedTicket.jobTitle,
        state: 'PREFLIGHT',
        durationSeconds: 12 * 60,
        elapsedSeconds: 0,
        remainingSeconds: 12 * 60,
        mediaMode: 'REAL_MASK',
        isFailClosedActive: true,
        topic: 'แนวทางการออกแบบ High-Throughput Event Queue & IoT Pipeline',
        notes: ''
      };

      persistAndBroadcast({
        ...globalState,
        activeTicket: updatedTicket,
        activeInterview: newSession
      });
    } else if (action === 'SNOOZE') {
      const updatedTicket = transitionQueueTicket(globalState.activeTicket, 'QUEUED');
      persistAndBroadcast({
        ...globalState,
        activeTicket: updatedTicket
      });
    } else {
      // DECLINE
      leaveQueue();
    }
  };

  const recruiterCallNextCandidate = (jobId: string) => {
    if (globalState.activeTicket && globalState.activeTicket.jobId === jobId) {
      const updatedTicket = transitionQueueTicket(globalState.activeTicket, 'READY_CHECK');
      persistAndBroadcast({
        ...globalState,
        activeTicket: updatedTicket
      });
    }
  };

  const recruiterSetAvailability = (boothId: string, status: 'ONLINE' | 'BREAK' | 'OFFLINE') => {
    const updatedBooths = globalState.booths.map((b) =>
      b.id === boothId ? { ...b, recruiter: { ...b.recruiter, status } } : b
    );
    persistAndBroadcast({ ...globalState, booths: updatedBooths });
  };

  const updateInterviewState = (nextState: any) => {
    if (!globalState.activeInterview) return;
    const updated = transitionInterviewSession(globalState.activeInterview, nextState);
    
    // If completed, create DecisionCase
    let activeDecisionCase = globalState.activeDecisionCase;
    if (nextState === 'COMPLETED') {
      activeDecisionCase = {
        id: 'case_' + Math.random().toString(36).substr(2, 9),
        sessionId: updated.id,
        jobId: globalState.activeTicket?.jobId || 'job-backend-01',
        boothId: globalState.activeTicket?.boothId || 'company-cyber-orchard',
        companyName: updated.companyName,
        jobTitle: updated.jobTitle,
        candidateCode: updated.candidateCode,
        candidateDecision: null,
        recruiterDecision: null,
        state: 'AWAITING_DECISIONS',
        revealedFields: []
      };
    }

    persistAndBroadcast({
      ...globalState,
      activeInterview: updated,
      activeDecisionCase
    });
  };

  const submitPrivateDecision = (actor: 'candidate' | 'recruiter', choice: DecisionChoice) => {
    if (!globalState.activeDecisionCase) return;
    const updatedCase = submitDecision(globalState.activeDecisionCase, actor, choice);
    
    let eventState = globalState.eventState;
    if (updatedCase.state === 'MUTUAL_MATCH') {
      eventState = {
        ...eventState,
        mutualMatches: eventState.mutualMatches + 1
      };
    }

    persistAndBroadcast({
      ...globalState,
      activeDecisionCase: updatedCase,
      eventState
    });
  };

  const updateRevealConsent = (fields: Array<'email' | 'phone' | 'portfolio' | 'fullResume'>) => {
    if (!globalState.activeDecisionCase) return;
    const updatedCase: DecisionCase = {
      ...globalState.activeDecisionCase,
      revealedFields: fields,
      state: 'REVEALED'
    };
    persistAndBroadcast({
      ...globalState,
      activeDecisionCase: updatedCase
    });
  };

  const adminPauseEvent = (reason: string) => {
    persistAndBroadcast({
      ...globalState,
      eventState: {
        ...globalState.eventState,
        status: 'PAUSED',
        pauseReason: reason
      }
    });
  };

  const adminResumeEvent = () => {
    persistAndBroadcast({
      ...globalState,
      eventState: {
        ...globalState.eventState,
        status: 'LIVE',
        pauseReason: undefined
      }
    });
  };

  const adminBroadcast = (message: string, level: 'info' | 'warning' | 'urgent' = 'info') => {
    const newBroadcast = {
      id: 'bc_' + Math.random().toString(36).substr(2, 6),
      message,
      timestamp: new Date().toISOString(),
      level
    };
    persistAndBroadcast({
      ...globalState,
      eventState: {
        ...globalState.eventState,
        broadcasts: [newBroadcast, ...globalState.eventState.broadcasts]
      }
    });
  };

  const applyDemoPreset = (presetName: string) => {
    if (presetName === 'Happy Match') {
      const candTicket: QueueTicket = {
        id: 'qt_preset_01',
        jobId: 'job-backend-01',
        boothId: 'company-cyber-orchard',
        companyName: 'Cyber Orchard Co.',
        jobTitle: 'Backend Developer',
        candidateId: 'cand_demo_8f3a',
        candidateCode: 'Candidate #8F3A',
        position: 1,
        estimatedWaitSeconds: 30,
        state: 'READY_CHECK',
        joinedAt: new Date().toISOString(),
        readyCheckExpiresAt: new Date(Date.now() + 60000).toISOString(),
        snoozeCount: 0,
        entityVersion: 2
      };
      persistAndBroadcast({
        ...globalState,
        activeTicket: candTicket,
        activePreset: presetName
      });
    } else if (presetName === 'No Match') {
      const decisionCase: DecisionCase = {
        id: 'case_no_match',
        sessionId: 'sess_demo_nomatch',
        jobId: 'job-backend-01',
        boothId: 'company-cyber-orchard',
        companyName: 'Cyber Orchard Co.',
        jobTitle: 'Backend Developer',
        candidateCode: 'Candidate #8F3A',
        candidateDecision: 'INTERESTED',
        recruiterDecision: 'PASS',
        state: 'NO_MATCH',
        revealedFields: []
      };
      persistAndBroadcast({
        ...globalState,
        activeDecisionCase: decisionCase,
        activePreset: presetName
      });
    } else if (presetName === 'Queue Timeout') {
      const expTicket: QueueTicket = {
        id: 'qt_expired',
        jobId: 'job-backend-01',
        boothId: 'company-cyber-orchard',
        companyName: 'Cyber Orchard Co.',
        jobTitle: 'Backend Developer',
        candidateId: 'cand_demo_8f3a',
        candidateCode: 'Candidate #8F3A',
        position: 1,
        estimatedWaitSeconds: 0,
        state: 'EXPIRED',
        joinedAt: new Date().toISOString(),
        snoozeCount: 0,
        entityVersion: 3
      };
      persistAndBroadcast({
        ...globalState,
        activeTicket: expTicket,
        activePreset: presetName
      });
    } else {
      persistAndBroadcast({ ...globalState, activePreset: presetName });
    }
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    const freshState: AppState = {
      userRole: 'candidate',
      candidateProfile: { ...CANONICAL_CANDIDATE },
      activeTicket: null,
      activeInterview: null,
      activeDecisionCase: null,
      booths: [...CANONICAL_BOOTHS],
      eventState: { ...INITIAL_EVENT_STATE },
      activePreset: 'Happy Match'
    };
    persistAndBroadcast(freshState);
  };

  return {
    state,
    setUserRole,
    updateCandidateProfile,
    updateAvatarConfig,
    joinQueue,
    leaveQueue,
    respondReadyCheck,
    recruiterCallNextCandidate,
    recruiterSetAvailability,
    updateInterviewState,
    submitPrivateDecision,
    updateRevealConsent,
    adminPauseEvent,
    adminResumeEvent,
    adminBroadcast,
    applyDemoPreset,
    resetAllDemoData
  };
};
