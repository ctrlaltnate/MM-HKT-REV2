import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  createBooth,
  applyAutoScheduleTransitions,
  updateBooth,
  setBoothAssignedJobs,
  setBoothStatus,
  deleteBooth,
  changeLocalPassword,
  createFair,
  updateFair,
  deleteFair,
  createJob,
  updateJob,
  setJobStatus,
  deleteJob,
  getDatabaseSnapshot,
  joinFair,
  requestRecruiterFairAccess,
  inviteRecruiterToFair,
  reviewFairMembership,
  acceptFairInvitation,
  removeFairMembership,
  applyToJob,
  updateApplicationStatus,
  toggleApplicationRevealConsent,
  withdrawApplication,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
  resetLocalDatabase,
  saveCandidateProfile,
  saveCompany,
  setFairStatus,
  transitionFairStatus,
  subscribeDatabase,
  updateLocalUser,
  updateUserAvatar,
} from "../domain/local-database";
import type { AvatarConfig, LocalDatabase, LocalUser } from "../domain/types";

interface AppContextValue {
  database: LocalDatabase;
  user: LocalUser | null;
  actions: {
    register: typeof registerLocalUser;
    login: typeof loginLocalUser;
    logout: typeof logoutLocalUser;
    reset: typeof resetLocalDatabase;
    saveCandidateProfile: typeof saveCandidateProfile;
    createFair: typeof createFair;
    updateFair: typeof updateFair;
    deleteFair: typeof deleteFair;
    setFairStatus: typeof setFairStatus;
    transitionFairStatus: typeof transitionFairStatus;
    joinFair: typeof joinFair;
    requestRecruiterFairAccess: typeof requestRecruiterFairAccess;
    inviteRecruiterToFair: typeof inviteRecruiterToFair;
    reviewFairMembership: typeof reviewFairMembership;
    acceptFairInvitation: typeof acceptFairInvitation;
    removeFairMembership: typeof removeFairMembership;
    applyToJob: typeof applyToJob;
    updateApplicationStatus: typeof updateApplicationStatus;
    toggleApplicationRevealConsent: typeof toggleApplicationRevealConsent;
    withdrawApplication: typeof withdrawApplication;
    saveCompany: typeof saveCompany;
    createBooth: typeof createBooth;
    updateBooth: typeof updateBooth;
    setBoothAssignedJobs: typeof setBoothAssignedJobs;
    setBoothStatus: typeof setBoothStatus;
    deleteBooth: typeof deleteBooth;
    createJob: typeof createJob;
    updateJob: typeof updateJob;
    setJobStatus: typeof setJobStatus;
    deleteJob: typeof deleteJob;
    updateUser: typeof updateLocalUser;
    updateUserAvatar: typeof updateUserAvatar;
    changePassword: typeof changeLocalPassword;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const database = useSyncExternalStore(subscribeDatabase, getDatabaseSnapshot, getDatabaseSnapshot);
  const user = database.users.find((candidate) => candidate.id === database.sessionUserId) ?? null;
  useEffect(() => {
    const evaluate = () => applyAutoScheduleTransitions();
    evaluate();
    const timer = window.setInterval(evaluate, 30_000);
    document.addEventListener("visibilitychange", evaluate);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", evaluate);
    };
  }, []);
  const value = useMemo<AppContextValue>(
    () => ({
      database,
      user,
      actions: {
        register: registerLocalUser,
        login: loginLocalUser,
        logout: logoutLocalUser,
        reset: resetLocalDatabase,
        saveCandidateProfile,
        createFair,
        updateFair,
        deleteFair,
        setFairStatus,
        transitionFairStatus,
        joinFair,
        requestRecruiterFairAccess,
        inviteRecruiterToFair,
        reviewFairMembership,
        acceptFairInvitation,
        removeFairMembership,
        applyToJob,
        updateApplicationStatus,
        toggleApplicationRevealConsent,
        withdrawApplication,
        saveCompany,
        createBooth,
        updateBooth,
        setBoothAssignedJobs,
        setBoothStatus,
        deleteBooth,
        createJob,
        updateJob,
        setJobStatus,
        deleteJob,
        updateUser: updateLocalUser,
        updateUserAvatar,
        changePassword: changeLocalPassword,
      },
    }),
    [database, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error("useApp must be used inside AppProvider");
  return value;
}
