export interface GameBoothData {
  id: string;
  fairId: string;
  companyId: string;
  companyName: string;
  companyIndustry?: string;
  companyLogo?: string;
  tableNumber: number;
  boothName: string;
  assignedJobIds: string[];
  jobCount: number;
  isRegistered?: boolean;
}

export interface PlayerAvatarConfig {
  skinTone?: string;
  hairStyle?: string;
  hairColor?: string;
  eyeStyle?: string;
  eyeColor?: string;
  shirtColor?: string;
  pantsColor?: string;
  accessory?: string;
  gender?: string;
}

export interface GameInitPayload {
  fairId: string;
  fairTitle: string;
  booths: GameBoothData[];
  playerAvatar?: PlayerAvatarConfig;
  playerName?: string;
}

export type GameEventCallback = (payload: any) => void;

class GameEventBridge {
  private listeners: Map<string, Set<GameEventCallback>> = new Map();

  on(event: string, callback: GameEventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    return () => {
      this.off(event, callback);
    };
  }

  off(event: string, callback: GameEventCallback): void {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  emit(event: string, payload?: any): void {
    const set = this.listeners.get(event);
    if (set) {
      set.forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`[GameEventBridge] Error in listener for event "${event}":`, err);
        }
      });
    }
  }

  clear(): void {
    this.listeners.clear();
  }
}

export const gameBridge = new GameEventBridge();
