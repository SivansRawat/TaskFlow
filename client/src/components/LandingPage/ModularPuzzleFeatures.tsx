"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Kanban,
  Calendar,
  BarChart3,
  Users,
  Zap,
  ShieldCheck,
  Sparkles,
  Pause,
  Play,
} from "lucide-react";

interface FeatureItem {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: React.ElementType;
  solidColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  originX: number;
  originY: number;
  separateX: number;
  separateY: number;
  rotateDeg: number;
}

const featuresData: FeatureItem[] = [
  {
    id: "kanban",
    title: "Agile Kanban Boards",
    category: "AGILE WORKFLOWS",
    description:
      "Organize sprint cycles, manage column status categories, and configure high-priority labels dynamically.",
    icon: Kanban,
    solidColor: "#FBBF24",
    textColor: "#09090B",
    badgeBg: "rgba(9, 9, 11, 0.15)",
    badgeText: "#09090B",
    iconBg: "#09090B",
    originX: 0,
    originY: 0,
    separateX: -55,
    separateY: -45,
    rotateDeg: -4.5,
  },
  {
    id: "gantt",
    title: "Interactive Gantt",
    category: "ROADMAP TIMELINES",
    description:
      "Track project milestones and roadmap schedules with simple toggles across Day, Week, and Month scales.",
    icon: Calendar,
    solidColor: "#3B82F6",
    textColor: "#FFFFFF",
    badgeBg: "rgba(255, 255, 255, 0.2)",
    badgeText: "#DBEAFE",
    iconBg: "rgba(255, 255, 255, 0.2)",
    originX: 340,
    originY: 0,
    separateX: 15,
    separateY: -65,
    rotateDeg: 3.2,
  },
  {
    id: "analytics",
    title: "Priority Analytics",
    category: "PERFORMANCE",
    description:
      "View task status allocations, filter workloads, and identify bottlenecks with charts built for clarity.",
    icon: BarChart3,
    solidColor: "#EC4899",
    textColor: "#FFFFFF",
    badgeBg: "rgba(255, 255, 255, 0.2)",
    badgeText: "#FCE7F3",
    iconBg: "rgba(255, 255, 255, 0.2)",
    originX: 680,
    originY: 0,
    separateX: 65,
    separateY: -45,
    rotateDeg: 5.0,
  },
  {
    id: "security",
    title: "Multi-Tenant Isolation",
    category: "SECURITY",
    description:
      "Strict boundary enforcement locks user accounts, team structures, and database items to organization nodes.",
    icon: Users,
    solidColor: "#10B981",
    textColor: "#FFFFFF",
    badgeBg: "rgba(255, 255, 255, 0.2)",
    badgeText: "#D1FAE5",
    iconBg: "rgba(255, 255, 255, 0.2)",
    originX: 0,
    originY: 220,
    separateX: -60,
    separateY: 50,
    rotateDeg: -4.8,
  },
  {
    id: "notifications",
    title: "Smart Notifications",
    category: "AUTOMATION",
    description:
      "Receive notifications for critical deadline approaches, urgent status flags, and sprint team modifications.",
    icon: Zap,
    solidColor: "#F97316",
    textColor: "#FFFFFF",
    badgeBg: "rgba(255, 255, 255, 0.2)",
    badgeText: "#FFEDD5",
    iconBg: "rgba(255, 255, 255, 0.2)",
    originX: 340,
    originY: 220,
    separateX: -10,
    separateY: 70,
    rotateDeg: 3.8,
  },
  {
    id: "enterprise",
    title: "Enterprise Operations",
    category: "INFRASTRUCTURE",
    description:
      "Prisma ORM data structures, secure session keys, input schema controls, and production-ready latency bounds.",
    icon: ShieldCheck,
    solidColor: "#06B6D4",
    textColor: "#FFFFFF",
    badgeBg: "rgba(255, 255, 255, 0.2)",
    badgeText: "#CFFAFE",
    iconBg: "rgba(255, 255, 255, 0.2)",
    originX: 680,
    originY: 220,
    separateX: 60,
    separateY: 45,
    rotateDeg: -3.6,
  },
];

/**
 * 100% Mathematically exact SVG paths for the 6 interlocking puzzle pieces.
 * Piece dimensions: 340 x 220.
 * Includes outer rounded corners (r=20) and interlocking tabs/sockets.
 */
const puzzlePaths = [
  // Piece 0 (Top-Left): Outer Top-Left Rounded, Right Convex Tab, Bottom Concave Socket
  `M 0 20 A 20 20 0 0 1 20 0 L 340 0 L 340 86 C 348 86, 360 90, 362 98 C 364 106, 364 114, 362 122 C 360 130, 348 134, 340 134 L 340 220 L 194 220 C 194 212, 190 200, 182 198 C 174 196, 166 196, 158 198 C 150 200, 146 212, 146 220 L 0 220 L 0 20 Z`,

  // Piece 1 (Top-Middle): Top Flat, Left Concave Socket, Right Convex Tab, Bottom Convex Tab
  `M 0 0 L 340 0 L 340 86 C 348 86, 360 90, 362 98 C 364 106, 364 114, 362 122 C 360 130, 348 134, 340 134 L 340 220 L 194 220 C 194 228, 190 240, 182 242 C 174 244, 166 244, 158 242 C 150 240, 146 228, 146 220 L 0 220 L 0 134 C 8 134, 20 130, 22 122 C 24 114, 24 106, 22 98 C 20 90, 8 86, 0 86 L 0 0 Z`,

  // Piece 2 (Top-Right): Outer Top-Right Rounded, Left Concave Socket, Bottom Concave Socket
  `M 0 0 L 320 0 A 20 20 0 0 1 340 20 L 340 220 L 194 220 C 194 212, 190 200, 182 198 C 174 196, 166 196, 158 198 C 150 200, 146 212, 146 220 L 0 220 L 0 134 C 8 134, 20 130, 22 122 C 24 114, 24 106, 22 98 C 20 90, 8 86, 0 86 L 0 0 Z`,

  // Piece 3 (Bottom-Left): Outer Bottom-Left Rounded, Top Convex Tab, Right Convex Tab
  `M 0 0 L 146 0 C 146 -8, 150 -20, 158 -22 C 166 -24, 174 -24, 182 -22 C 190 -20, 194 -8, 194 0 L 340 0 L 340 86 C 348 86, 360 90, 362 98 C 364 106, 364 114, 362 122 C 360 130, 348 134, 340 134 L 340 220 L 20 220 A 20 20 0 0 1 0 200 L 0 0 Z`,

  // Piece 4 (Bottom-Middle): Top Concave Socket, Left Concave Socket, Right Convex Tab, Bottom Flat
  `M 0 0 L 146 0 C 146 8, 150 20, 158 22 C 166 24, 174 24, 182 22 C 190 20, 194 8, 194 0 L 340 0 L 340 86 C 348 86, 360 90, 362 98 C 364 106, 364 114, 362 122 C 360 130, 348 134, 340 134 L 340 220 L 0 220 L 0 134 C 8 134, 20 130, 22 122 C 24 114, 24 106, 22 98 C 20 90, 8 86, 0 86 L 0 0 Z`,

  // Piece 5 (Bottom-Right): Outer Bottom-Right Rounded, Top Convex Tab, Left Concave Socket
  `M 0 0 L 146 0 C 146 -8, 150 -20, 158 -22 C 166 -24, 174 -24, 182 -22 C 190 -20, 194 -8, 194 0 L 340 0 L 340 200 A 20 20 0 0 1 320 220 L 0 220 L 0 134 C 8 134, 20 130, 22 122 C 24 114, 24 106, 22 98 C 20 90, 8 86, 0 86 L 0 0 Z`,
];

const ModularPuzzleFeatures: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isPaused, setIsPaused] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);

  /**
   * Calculate sequential keyframe timeline for piece `index` (0 to 5).
   * Sequence:
   * 1. Disassemble one-by-one from Top-Left (index 0) to Bottom-Right (index 5)
   * 2. Hold in floating separated state
   * 3. Reassemble / Join one-by-one from Top-Left (index 0) to Bottom-Right (index 5)
   * 4. Hold in fully assembled state
   */
  const getPieceKeyframes = (index: number) => {
    // Sequential disassembly departure times (top-left to bottom-right)
    const depStart = 0.05 + index * 0.05;
    const depEnd = depStart + 0.07;

    // Sequential reassembly joining times (top-left to bottom-right)
    const joinStart = 0.50 + index * 0.05;
    const joinEnd = joinStart + 0.07;

    // Timeline steps: [Start, DepStart, DepEnd, JoinStart, JoinEnd, CycleEnd]
    const times = [0, depStart, depEnd, joinStart, joinEnd, 1.0];

    return {
      times,
      x: (originX: number, separateX: number) => [
        originX,
        originX,
        originX + separateX,
        originX + separateX,
        originX,
        originX,
      ],
      y: (originY: number, separateY: number) => [
        originY,
        originY,
        originY + separateY,
        originY + separateY,
        originY,
        originY,
      ],
      rotate: (deg: number) => [0, 0, deg, deg, 0, 0],
      scale: [1, 1, 1.04, 1.04, 1, 1],
    };
  };

  return (
    <section
      id="features"
      className="relative z-10 py-20 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto overflow-hidden select-none"
    >
      {/* Section Header (Stationary) */}
      <div className="text-center mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
          <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" />
          <span className="text-[11px] font-bold tracking-widest text-white/70 uppercase">
            MODULAR SYSTEM ARCHITECTURE
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight uppercase max-w-3xl mx-auto">
          ENGINEERED FOR WORKSPACE VELOCITY
        </h2>
        <p className="mt-4 text-sm sm:text-base text-white/50 max-w-xl mx-auto font-normal leading-relaxed">
          Six interconnected core modules forming a single, unified execution system.
        </p>

        {/* Motion Control Toggle */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-md border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-all"
            aria-label={isPaused ? "Play animation loop" : "Pause animation loop"}
          >
            {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            <span>{isPaused ? "RESUME MOTION" : "PAUSE MOTION"}</span>
          </button>
        </div>
      </div>

      {/* Main Puzzle SVG Scene */}
      <div className="relative max-w-[1080px] mx-auto overflow-visible flex justify-center items-center py-6">
        <svg
          viewBox="-90 -90 1200 620"
          className="w-full h-auto max-h-[660px] overflow-visible drop-shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
        >
          <defs>
            {featuresData.map((feature) => (
              <linearGradient
                key={`grad-${feature.id}`}
                id={`grad-${feature.id}`}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={feature.solidColor} stopOpacity="1" />
                <stop offset="100%" stopColor={feature.solidColor} stopOpacity="0.9" />
              </linearGradient>
            ))}
          </defs>

          {/* Render 6 Puzzle Group Nodes in Sequential Top-Left -> Bottom-Right Order */}
          {featuresData.map((feature, index) => {
            const IconComponent = feature.icon;
            const isHovered = activeHover === feature.id;
            const keyframes = getPieceKeyframes(index);

            return (
              <motion.g
                key={feature.id}
                onMouseEnter={() => setActiveHover(feature.id)}
                onMouseLeave={() => setActiveHover(null)}
                className="cursor-pointer"
                animate={
                  shouldReduceMotion || isPaused
                    ? {
                        x: feature.originX,
                        y: feature.originY,
                        rotate: 0,
                        scale: isHovered ? 1.03 : 1,
                      }
                    : {
                        x: keyframes.x(feature.originX, feature.separateX),
                        y: keyframes.y(feature.originY, feature.separateY),
                        rotate: keyframes.rotate(feature.rotateDeg),
                        scale: isHovered
                          ? [1.04, 1.04, 1.05, 1.05, 1.04, 1.04]
                          : keyframes.scale,
                      }
                }
                transition={
                  shouldReduceMotion || isPaused
                    ? { duration: 0.3 }
                    : {
                        duration: 11, // Total sequence loop duration
                        repeat: Infinity,
                        ease: [0.33, 1, 0.68, 1], // Smooth physical cubic bezier
                        times: keyframes.times,
                      }
                }
                style={{
                  transformOrigin: `${feature.originX + 170}px ${feature.originY + 110}px`,
                  zIndex: isHovered ? 50 : 10 + index,
                }}
              >
                {/* Puzzle Piece Shape Fill */}
                <path
                  d={puzzlePaths[index]}
                  fill={`url(#grad-${feature.id})`}
                  stroke="rgba(255, 255, 255, 0.4)"
                  strokeWidth="2.5"
                  className="transition-colors duration-300 hover:stroke-white"
                />

                {/* HTML Content Overlay inside SVG via foreignObject */}
                <foreignObject x="0" y="0" width="340" height="220" className="overflow-visible">
                  <div className="w-full h-full p-6 flex flex-col justify-between select-none pointer-events-auto">
                    {/* Top Row: Icon + Category Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className="h-9 w-9 rounded-lg flex items-center justify-center shadow-md border border-white/20"
                        style={{
                          backgroundColor: feature.iconBg,
                          color: feature.id === "kanban" ? "#FBBF24" : "#FFFFFF",
                        }}
                      >
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span
                        className="text-[10.5px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/20"
                        style={{
                          backgroundColor: feature.badgeBg,
                          color: feature.textColor,
                        }}
                      >
                        {feature.category}
                      </span>
                    </div>

                    {/* Bottom Title & Description */}
                    <div className="mt-auto">
                      <h3
                        className="text-base font-extrabold uppercase tracking-wide mb-1"
                        style={{ color: feature.textColor }}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className="text-xs leading-relaxed font-medium line-clamp-3 opacity-90"
                        style={{ color: feature.textColor }}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </foreignObject>
              </motion.g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};

export default ModularPuzzleFeatures;
