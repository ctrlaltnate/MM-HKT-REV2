import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import {
  createBooth,
  changeLocalPassword,
  createFair,
  createJob,
  getDatabaseSnapshot,
  joinFair,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
  resetLocalDatabase,
  saveCandidateProfile,
  saveCompany,
  setFairStatus,
  subscribeDatabase,
  updateLocalUser,
} from "../domain/local-database";
import type { LocalDatabase, LocalUser } from "../domain/types";

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
    setFairStatus: typeof setFairStatus;
    joinFair: typeof joinFair;
    saveCompany: typeof saveCompany;
    createBooth: typeof createBooth;
    createJob: typeof createJob;
    updateUser: typeof updateLocalUser;
    changePassword: typeof changeLocalPassword;
  };
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: PropsWithChildren) {
  const database = useSyncExternalStore(subscribeDatabase, getDatabaseSnapshot, getDatabaseSnapshot);
  const user = database.users.find((candidate) => candidate.id === database.sessionUserId) ?? null;
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
        setFairStatus,
        joinFair,
        saveCompany,
        createBooth,
        createJob,
        updateUser: updateLocalUser,
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
