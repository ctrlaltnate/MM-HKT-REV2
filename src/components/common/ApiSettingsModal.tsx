import React, { useState, useEffect } from 'react';
import { DialogWindow } from './DialogWindow';
import { PixelButton } from './PixelButton';
import { IconSettings, IconLock, IconShieldCheck, IconSparkles } from './PixelIcons';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ApiConfigState {
  supabaseUrl: string;
  supabaseAnonKey: string;
  openaiApiKey: string;
  geminiApiKey: string;
  livekitUrl: string;
  livekitApiKey: string;
  livekitApiSecret: string;
  mongodbUri: string;
}

const API_CONFIG_STORAGE_KEY = 'maskedmatch_api_keys_v2.1';

export const getStoredApiConfig = (): ApiConfigState => {
  try {
    const cached = localStorage.getItem(API_CONFIG_STORAGE_KEY);
    if (cached) return JSON.parse(cached);
  } catch (e) {
    console.error(e);
  }
  return {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || '',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    openaiApiKey: '',
    geminiApiKey: '',
    livekitUrl: 'wss://demo.livekit.cloud',
    livekitApiKey: '',
    livekitApiSecret: '',
    mongodbUri: ''
  };
};

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({ isOpen, onClose }) => {
  const [config, setConfig] = useState<ApiConfigState>(getStoredApiConfig());
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getStoredApiConfig());
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(API_CONFIG_STORAGE_KEY, JSON.stringify(config));
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 1200);
  };

  return (
    <DialogWindow
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      headerColor="cyan"
      title={
        <div className="flex items-center gap-2 text-brand-cyan font-display">
          <IconSettings size={20} color="var(--brand-cyan)" />
          <span>ตั้งค่า Cloud API & เชื่อมต่อบริการจริง (Production API Settings)</span>
        </div>
      }
    >
      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-3.5 rounded-xl bg-[#0D1025] border border-brand-cyan/40 text-xs text-text-muted space-y-1 font-display">
          <div className="text-brand-cyan font-bold flex items-center gap-1.5">
            <IconShieldCheck size={16} color="var(--brand-cyan)" />
            <span>โหมดพร้อมต่อ API จริง (Pluggable Real API Support):</span>
          </div>
          <p>
            คุณสามารถใส่ API Keys จริงด้านล่างนี้ได้ทันที หรือปล่อยว่างไว้เพื่อใช้งานระบบ <strong>High-Fidelity Client-Side Engine (BroadcastChannel + WASM FaceMesh + Web Audio DSP)</strong> ได้อย่างสมบูรณ์แบบโดยไม่ต้องพึ่งพาเซิร์ฟเวอร์ภายนอก
          </p>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-lg bg-status-success/20 border border-status-success text-status-success text-xs font-display font-bold text-center animate-fade-in">
            ✓ บันทึกการตั้งค่า API Keys เรียบร้อยแล้ว!
          </div>
        )}

        <div className="space-y-4">
          {/* 1. Supabase Settings */}
          <div className="p-4 rounded-xl bg-[#0D1025] border border-[#352C5E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-brand-purple flex items-center gap-1.5">
                <span>1. Supabase (PostgreSQL & Realtime)</span>
              </span>
              <span className="text-[10px] font-mono text-brand-cyan">
                {config.supabaseUrl ? 'CUSTOM URL' : 'LOCAL SIMULATED'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-text-muted font-display block mb-1">
                  Supabase Project URL:
                </label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={config.supabaseUrl}
                  onChange={(e) => setConfig({ ...config, supabaseUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#17162E] border border-[#352C5E] text-xs font-mono text-text-primary focus:border-brand-purple outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-text-muted font-display block mb-1">
                  Supabase Anon Key:
                </label>
                <input
                  type="password"
                  placeholder="eyJhbGciOi..."
                  value={config.supabaseAnonKey}
                  onChange={(e) => setConfig({ ...config, supabaseAnonKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#17162E] border border-[#352C5E] text-xs font-mono text-text-primary focus:border-brand-purple outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. AI Model Settings */}
          <div className="p-4 rounded-xl bg-[#0D1025] border border-[#352C5E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-brand-pink flex items-center gap-1.5">
                <IconSparkles size={14} color="var(--brand-pink)" />
                <span>2. AI Engine (OpenAI / Google Gemini)</span>
              </span>
              <span className="text-[10px] font-mono text-text-muted">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-text-muted font-display block mb-1">
                  OpenAI API Key:
                </label>
                <input
                  type="password"
                  placeholder="sk-proj-..."
                  value={config.openaiApiKey}
                  onChange={(e) => setConfig({ ...config, openaiApiKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#17162E] border border-[#352C5E] text-xs font-mono text-text-primary focus:border-brand-pink outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-text-muted font-display block mb-1">
                  Google Gemini API Key:
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={config.geminiApiKey}
                  onChange={(e) => setConfig({ ...config, geminiApiKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#17162E] border border-[#352C5E] text-xs font-mono text-text-primary focus:border-brand-pink outline-none"
                />
              </div>
            </div>
          </div>

          {/* 3. LiveKit Cloud */}
          <div className="p-4 rounded-xl bg-[#0D1025] border border-[#352C5E] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-display font-bold text-brand-cyan">
                3. LiveKit Cloud (WebRTC Video Room)
              </span>
              <span className="text-[10px] font-mono text-text-muted">WebRTC SFU</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-text-muted font-display block mb-1">
                  LiveKit WebSocket URL:
                </label>
                <input
                  type="text"
                  placeholder="wss://your-project.livekit.cloud"
                  value={config.livekitUrl}
                  onChange={(e) => setConfig({ ...config, livekitUrl: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#17162E] border border-[#352C5E] text-xs font-mono text-text-primary focus:border-brand-cyan outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-text-muted font-display block mb-1">
                  LiveKit API Key:
                </label>
                <input
                  type="text"
                  placeholder="APIxxxxxxxxxxxx"
                  value={config.livekitApiKey}
                  onChange={(e) => setConfig({ ...config, livekitApiKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-[#17162E] border border-[#352C5E] text-xs font-mono text-text-primary focus:border-brand-cyan outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <PixelButton variant="ghost" size="md" type="button" onClick={onClose}>
            ยกเลิก
          </PixelButton>
          <PixelButton variant="accent" size="md" type="submit">
            บันทึกการตั้งค่า API 💾
          </PixelButton>
        </div>
      </form>
    </DialogWindow>
  );
};
