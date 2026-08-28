import { useEffect, useRef, useState } from "react";
import * as Phaser from "phaser";
import {
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  Compass,
  Gamepad2,
  HelpCircle,
  MapPin,
  Send,
  Sparkles,
  Target,
  Users,
  X,
} from "lucide-react";

import { createGameConfig } from "./config";
import { gameBridge, type GameBoothData, type PlayerAvatarConfig } from "./bridge";
import { calculateLocalMatch } from "../domain/matching";
import type { AppUser, CandidateProfile, Company, JobPosting } from "../domain/types";
import { PixelButton, PixelSurface } from "../components/PixelUI";
import { useToast } from "../context/ToastContext";

interface PhaserGameHostProps {
  fairId: string;
  fairTitle: string;
  booths: Array<{
    id: string;
    fairId: string;
    companyId: string;
    tableNumber?: number;
    name: string;
    status: string;
    assignedJobIds?: string[];
  }>;
  companies: Company[];
  jobs: JobPosting[];
  user?: AppUser;
  profile?: CandidateProfile;
  applications?: any[];
  onApply: (job: JobPosting, boothId: string, companyId: string) => void;
  onSwitchToListMode?: () => void;
}

export function PhaserGameHost({
  fairId,
  fairTitle,
  booths,
  companies,
  jobs,
  user,
  profile,
  applications = [],
  onApply,
  onSwitchToListMode,
}: PhaserGameHostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<GameBoothData | null>(null);
  const [nearbyBooth, setNearbyBooth] = useState<GameBoothData | null>(null);
  const [showControlsModal, setShowControlsModal] = useState(false);
  const [isGameReady, setIsGameReady] = useState(false);
  const { toast } = useToast();

  // Prepare Booth Data for Phaser
  const gameBooths: GameBoothData[] = booths.map((b, idx) => {
    const comp = companies.find((c) => c.id === b.companyId);
    const assigned = b.assignedJobIds || [];
    const boothJobs = jobs.filter(
      (j) => (assigned.includes(j.id) || j.boothId === b.id) && j.status === "PUBLISHED"
    );

    return {
      id: b.id,
      fairId: b.fairId,
      companyId: b.companyId,
      companyName: comp?.name || b.name,
      companyIndustry: comp?.industry,
      tableNumber: b.tableNumber ?? idx + 1,
      boothName: b.name,
      assignedJobIds: assigned,
      jobCount: boothJobs.length,
    };
  });

  // Extract avatar config from AppUser avatarConfig
  const avatarConfig: PlayerAvatarConfig = (user?.avatarConfig as any) || {
    skinTone: "#D4956A",
    hairStyle: "short",
    hairColor: "#4A2E18",
    shirtColor: "#2563EB",
    pantsColor: "#1E293B",
    accessory: "backpack",
  };

  // 1. Initialize Phaser Game on Mount
  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy existing instance if any
    if (gameRef.current) {
      gameRef.current.destroy(true);
      gameRef.current = null;
    }

    const payload = {
      fairId,
      fairTitle,
      booths: gameBooths,
      playerAvatar: avatarConfig,
      playerName: user?.displayName || user?.email?.split("@")[0] || "Candidate",
    };

    const config = createGameConfig(containerRef.current, payload);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Listen for Game Events from Bridge
    const unsubReady = gameBridge.on("GAME_READY", () => {
      setIsGameReady(true);
    });

    const unsubInteract = gameBridge.on("BOOTH_INTERACT", (boothData: GameBoothData) => {
      setSelectedBooth(boothData);
      gameBridge.emit("SET_INTERACTING", true);
    });

    const unsubNearby = gameBridge.on("PLAYER_NEAR_BOOTH", (boothData: GameBoothData | null) => {
      setNearbyBooth(boothData);
    });

    return () => {
      unsubReady();
      unsubInteract();
      unsubNearby();
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [fairId]);

  // 2. React to avatar profile changes
  useEffect(() => {
    if (isGameReady && avatarConfig) {
      gameBridge.emit("UPDATE_AVATAR", avatarConfig);
    }
  }, [avatarConfig, isGameReady]);

  const handleCloseBoothDrawer = () => {
    setSelectedBooth(null);
    gameBridge.emit("SET_INTERACTING", false);
  };

  // Look up selected booth's company & jobs
  const selectedCompany = selectedBooth ? companies.find((c) => c.id === selectedBooth.companyId) : undefined;
  const selectedBoothJobs = selectedBooth
    ? jobs.filter(
        (j) =>
          (selectedBooth.assignedJobIds.includes(j.id) || j.boothId === selectedBooth.id) &&
          j.status === "PUBLISHED"
      )
    : [];

  return (
    <div
      className="phaser-game-host-wrapper"
      style={{
        position: "relative",
        width: "100%",
        borderRadius: "12px",
        overflow: "hidden",
        border: "2px solid var(--cyan)",
        boxShadow: "0 0 30px rgba(120, 219, 230, 0.15)",
        background: "#07101a",
      }}
    >
      {/* Top HUD Controls Bar */}
      <div
        className="game-hud-top"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          padding: "10px 16px",
          background: "linear-gradient(to bottom, rgba(7, 16, 26, 0.95), transparent)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: "0.82rem",
              background: "rgba(120, 219, 230, 0.15)",
              border: "1px solid var(--cyan)",
              padding: "3px 10px",
              borderRadius: "4px",
              color: "var(--cyan)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Gamepad2 size={14} /> 2D VIRTUAL EXPO (PHASER 4)
          </span>
          <span style={{ fontSize: "0.85rem", color: "var(--text)", fontWeight: 600 }}>
            {fairTitle}
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {onSwitchToListMode && (
            <PixelButton
              type="button"
              tone="neutral"
              onClick={onSwitchToListMode}
              style={{ fontSize: "0.8rem", padding: "4px 10px" }}
            >
              <Compass size={14} aria-hidden="true" /> สลับเป็น List Mode
            </PixelButton>
          )}

          <button
            type="button"
            className="icon-button"
            title="วิธีควบคุมตัวละคร"
            onClick={() => setShowControlsModal(true)}
            style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid var(--line)",
              color: "var(--text)",
              padding: "6px 10px",
              borderRadius: 6,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.8rem",
            }}
          >
            <HelpCircle size={15} /> วิธีเล่น
          </button>
        </div>
      </div>

      {/* Phaser Canvas Mount Container */}
      <div
        ref={containerRef}
        id="phaser-career-hall-canvas"
        tabIndex={0}
        onClick={(e) => {
          (e.currentTarget as HTMLElement).focus();
        }}
        style={{
          width: "100%",
          height: "560px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          outline: "none",
          cursor: "crosshair",
          imageRendering: "pixelated",
        }}
      />

      {/* Virtual D-Pad for Mobile & Easy Navigation */}
      <div
        className="virtual-touch-dpad"
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 30,
          display: "grid",
          gridTemplateColumns: "repeat(3, 42px)",
          gridTemplateRows: "repeat(3, 42px)",
          gap: 4,
          background: "rgba(10, 20, 35, 0.85)",
          padding: 6,
          borderRadius: 12,
          border: "1px solid rgba(120, 219, 230, 0.4)",
          backdropFilter: "blur(8px)",
          userSelect: "none",
          touchAction: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
        }}
      >
        <div />
        <button
          type="button"
          aria-label="เดินขึ้น"
          style={{
            background: "rgba(30, 58, 95, 0.9)",
            border: "1px solid var(--cyan)",
            color: "var(--cyan)",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 900,
            fontSize: "14px",
          }}
          onPointerDown={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: -1 })}
          onPointerUp={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
          onPointerLeave={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
        >
          ▲
        </button>
        <div />
        <button
          type="button"
          aria-label="เดินซ้าย"
          style={{
            background: "rgba(30, 58, 95, 0.9)",
            border: "1px solid var(--cyan)",
            color: "var(--cyan)",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 900,
            fontSize: "14px",
          }}
          onPointerDown={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: -1, y: 0 })}
          onPointerUp={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
          onPointerLeave={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
        >
          ◀
        </button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "0.7rem",
            color: "var(--muted)",
          }}
        >
          🎮
        </div>
        <button
          type="button"
          aria-label="เดินขวา"
          style={{
            background: "rgba(30, 58, 95, 0.9)",
            border: "1px solid var(--cyan)",
            color: "var(--cyan)",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 900,
            fontSize: "14px",
          }}
          onPointerDown={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 1, y: 0 })}
          onPointerUp={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
          onPointerLeave={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
        >
          ▶
        </button>
        <div />
        <button
          type="button"
          aria-label="เดินลง"
          style={{
            background: "rgba(30, 58, 95, 0.9)",
            border: "1px solid var(--cyan)",
            color: "var(--cyan)",
            borderRadius: 6,
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 900,
            fontSize: "14px",
          }}
          onPointerDown={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 1 })}
          onPointerUp={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
          onPointerLeave={() => gameBridge.emit("VIRTUAL_JOYSTICK_MOVE", { x: 0, y: 0 })}
        >
          ▼
        </button>
        <div />
      </div>

      {/* Floating Action Button when near a booth */}
      {nearbyBooth && !selectedBooth && (
        <div
          style={{
            position: "absolute",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 25,
            animation: "pulse 1.5s infinite",
          }}
        >
          <PixelButton
            type="button"
            tone="mango"
            onClick={() => {
              setSelectedBooth(nearbyBooth);
              gameBridge.emit("SET_INTERACTING", true);
            }}
            style={{
              padding: "10px 22px",
              fontSize: "0.95rem",
              boxShadow: "0 0 20px rgba(255, 216, 77, 0.4)",
            }}
          >
            <Sparkles size={16} aria-hidden="true" />
            คุยกับบูธ {nearbyBooth.companyName} ({nearbyBooth.jobCount} ตำแหน่ง)
          </PixelButton>
        </div>
      )}

      {/* Interactive Booth Details Side Drawer */}
      {selectedBooth && (
        <div
          className="booth-game-drawer"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            width: "min(440px, 94vw)",
            background: "rgba(10, 20, 35, 0.98)",
            borderLeft: "2px solid var(--cyan)",
            boxShadow: "-10px 0 40px rgba(0,0,0,0.8)",
            zIndex: 40,
            display: "flex",
            flexDirection: "column",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Drawer Header */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--line)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div>
              <span style={{ fontSize: "0.75rem", color: "var(--mango)", fontWeight: 700 }}>
                บูธหมายเลข B{selectedBooth.tableNumber}
              </span>
              <h2 style={{ margin: "2px 0 0", fontSize: "1.2rem", color: "var(--text)" }}>
                {selectedBooth.companyName}
              </h2>
              {selectedCompany?.industry && (
                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                  {selectedCompany.industry}
                </span>
              )}
            </div>
            <button
              type="button"
              className="icon-button modal-close-button"
              onClick={handleCloseBoothDrawer}
              aria-label="ปิดหน้าต่างบูธ"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "grid", gap: 16 }}>
            {/* Company Intro */}
            {selectedCompany?.summary && (
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  border: "1px solid var(--line)",
                }}
              >
                <span style={{ fontSize: "0.75rem", color: "var(--cyan)", fontWeight: 600 }}>
                  เกี่ยวกับบริษัท
                </span>
                <p style={{ margin: "4px 0 0", fontSize: "0.86rem", color: "var(--muted)", lineHeight: 1.5 }}>
                  {selectedCompany.summary}
                </p>
              </div>
            )}

            {/* Open Positions List */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)" }}>
                  ตำแหน่งงานที่เปิดรับ ({selectedBoothJobs.length})
                </span>
              </div>

              {selectedBoothJobs.length === 0 ? (
                <div
                  style={{
                    padding: "24px 16px",
                    textAlign: "center",
                    background: "rgba(255,255,255,0.02)",
                    borderRadius: 6,
                    color: "var(--muted)",
                    fontSize: "0.85rem",
                  }}
                >
                  บูธนี้ยังไม่มีตำแหน่งงานที่เปิดรับในขณะนี้
                </div>
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {selectedBoothJobs.map((job) => {
                    const match = calculateLocalMatch(profile, job);
                    const applied = applications.some(
                      (app) =>
                        app.jobId === job.id &&
                        app.candidateUserId === user?.id &&
                        app.status !== "REJECTED"
                    );

                    const salaryText =
                      job.salaryMin && job.salaryMax
                        ? `฿${job.salaryMin.toLocaleString()} - ฿${job.salaryMax.toLocaleString()}`
                        : job.salaryMin
                        ? `เริ่มต้น ฿${job.salaryMin.toLocaleString()}`
                        : "ตามตกลง";

                    return (
                      <div
                        key={job.id}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid var(--line)",
                          borderRadius: 8,
                          padding: "14px",
                          display: "grid",
                          gap: 8,
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <div>
                            <strong style={{ fontSize: "1rem", color: "var(--text)" }}>{job.title}</strong>
                            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
                              {job.workMode} · {job.employmentType} · {salaryText}
                            </div>
                          </div>

                          {profile && (
                            <span
                              style={{
                                fontSize: "0.78rem",
                                fontWeight: 700,
                                color: match.score >= 70 ? "var(--success)" : "var(--mango)",
                                background: match.score >= 70 ? "rgba(74,222,128,0.1)" : "rgba(255,216,77,0.1)",
                                border: `1px solid ${match.score >= 70 ? "rgba(74,222,128,0.3)" : "rgba(255,216,77,0.3)"}`,
                                padding: "2px 8px",
                                borderRadius: 4,
                                flexShrink: 0,
                              }}
                            >
                              Match {match.score}%
                            </span>
                          )}
                        </div>

                        {job.summary && (
                          <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.4 }}>
                            {job.summary}
                          </p>
                        )}

                        {/* Must-have skills */}
                        {job.mustHave.length > 0 && (
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {job.mustHave.map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  fontSize: "0.72rem",
                                  background: "rgba(120,219,230,0.08)",
                                  border: "1px solid rgba(120,219,230,0.2)",
                                  padding: "1px 6px",
                                  borderRadius: 3,
                                  color: "var(--text)",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Apply Action */}
                        <div style={{ marginTop: 4 }}>
                          {applied ? (
                            <span
                              style={{
                                fontSize: "0.8rem",
                                color: "var(--success)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 4,
                                fontWeight: 600,
                              }}
                            >
                              <CheckCircle2 size={14} /> ยื่นใบสมัครแล้ว (Masked Profile)
                            </span>
                          ) : (
                            <PixelButton
                              type="button"
                              tone="cyan"
                              onClick={() => {
                                onApply(job, selectedBooth.id, selectedBooth.companyId);
                              }}
                              style={{ width: "100%", fontSize: "0.85rem", padding: "8px 12px" }}
                            >
                              <Send size={14} aria-hidden="true" /> สมัครงานแบบ Masked
                            </PixelButton>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--line)",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <PixelButton type="button" tone="neutral" onClick={handleCloseBoothDrawer}>
              กลับไปเดินในงาน Expo
            </PixelButton>
          </div>
        </div>
      )}

      {/* Controls Help Modal */}
      {showControlsModal && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 16,
          }}
        >
          <PixelSurface style={{ maxWidth: 440, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Gamepad2 style={{ color: "var(--cyan)" }} />
                <h3 style={{ margin: 0 }}>วิธีควบคุมตัวละครในงานแฟร์</h3>
              </div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setShowControlsModal(false)}
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "grid", gap: 14, fontSize: "0.88rem", color: "var(--muted)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ minWidth: 100, fontWeight: 700, color: "var(--cyan)" }}>คีย์บอร์ด</span>
                <span>ใช้ปุ่ม <strong>W, A, S, D</strong> หรือ <strong>ปุ่มลูกศร</strong> เพื่อเดิน 4 ทิศทาง</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ minWidth: 100, fontWeight: 700, color: "var(--cyan)" }}>เมาส์ / จอสัมผัส</span>
                <span><strong>คลิกหรือแตะ</strong> ที่จุดใดบนพื้น ตัวละครจะเดินไปยังจุดนั้น</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ minWidth: 100, fontWeight: 700, color: "var(--mango)" }}>โต้ตอบกับบูธ</span>
                <span>เดินเข้าใกล้บูธแล้วกดปุ่ม <strong>[ E ]</strong> หรือ <strong>[ Space ]</strong> หรือคลิกที่บูธ</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ minWidth: 100, fontWeight: 700, color: "var(--text)" }}>Info Desk</span>
                <span>เดินเข้าไปใกล้เคาน์เตอร์ตรงกลางเพื่อฟังคำแนะนำและข้อมูลของงานแฟร์</span>
              </div>
            </div>

            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
              <PixelButton type="button" tone="cyan" onClick={() => setShowControlsModal(false)}>
                เข้าใจแล้ว พร้อมสำรวจ!
              </PixelButton>
            </div>
          </PixelSurface>
        </div>
      )}
    </div>
  );
}
