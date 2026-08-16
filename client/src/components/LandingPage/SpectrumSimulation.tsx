"use client";

import React, { useEffect, useRef, useState } from "react";

const SpectrumSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fps, setFps] = useState<number>(60);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const numBars = 44;
    const segmentHeight = 4.5;
    const segmentGap = 1.5;

    let time = 0;

    const render = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      time += delta * 1.8;

      frameCount++;
      if (now - fpsTimer >= 500) {
        setFps(Math.round((frameCount * 1000) / (now - fpsTimer)));
        frameCount = 0;
        fpsTimer = now;
      }

      if (!canvas || !canvas.parentElement) return;
      const width = canvas.parentElement.clientWidth;
      const height = canvas.parentElement.clientHeight;

      ctx.clearRect(0, 0, width, height);

      const barPadding = 3.5;
      const totalPadding = barPadding * (numBars + 1);
      const barWidth = Math.max(3, (width - totalPadding) / numBars);

      const centerX = numBars / 2;

      for (let i = 0; i < numBars; i++) {
        // Gaussian bell curve distribution
        const normalizedPos = (i - centerX) / (numBars * 0.44);
        const gaussian = Math.exp(-0.5 * normalizedPos * normalizedPos);

        // Sine wave dynamics
        const wave1 = Math.sin(time * 2.2 + i * 0.18) * 0.18;
        const wave2 = Math.sin(time * 3.7 - i * 0.32) * 0.12;
        const wave3 = Math.cos(time * 1.4 + i * 0.08) * 0.08;

        // Mouse interaction wave
        let mouseBoost = 0;
        if (mousePos.current.active) {
          const barCenterX = barPadding + i * (barWidth + barPadding) + barWidth / 2;
          const dist = Math.abs(mousePos.current.x - barCenterX);
          if (dist < 120) {
            mouseBoost = Math.cos((dist / 120) * (Math.PI / 2)) * 0.25;
          }
        }

        let heightFactor = (gaussian * 0.76 + wave1 + wave2 + wave3 + mouseBoost);
        heightFactor = Math.max(0.06, Math.min(0.97, heightFactor));

        const maxBarHeight = height * 0.92;
        const currentBarHeight = maxBarHeight * heightFactor;

        const x = barPadding + i * (barWidth + barPadding);
        const totalSegments = Math.floor(currentBarHeight / (segmentHeight + segmentGap));

        for (let j = 0; j < totalSegments; j++) {
          const segmentY = height - (j + 1) * (segmentHeight + segmentGap);

          const segmentRatio = j / totalSegments;
          const isTopCap = j === totalSegments - 1;

          if (isTopCap) {
            // Glowing white cap tip
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = "rgba(251, 191, 36, 0.9)";
            ctx.shadowBlur = 8;
          } else if (segmentRatio > 0.82) {
            // Warm bright yellow-white
            ctx.fillStyle = "#FEF08A";
            ctx.shadowBlur = 0;
          } else if (segmentRatio > 0.6) {
            // Light Amber Gold
            ctx.fillStyle = "#FCD34D";
            ctx.shadowBlur = 0;
          } else if (segmentRatio > 0.35) {
            // Main Primary Accent Gold (#FBBF24)
            ctx.fillStyle = "#FBBF24";
            ctx.shadowBlur = 0;
          } else if (segmentRatio > 0.18) {
            // Secondary Amber (#F59E0B)
            ctx.fillStyle = "#F59E0B";
            ctx.shadowBlur = 0;
          } else {
            // Deep Amber (#D97706)
            ctx.fillStyle = "#D97706";
            ctx.shadowBlur = 0;
          }

          ctx.fillRect(x, segmentY, barWidth, segmentHeight);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePos.current.active = false;
  };

  return (
    <div
      className="relative w-full h-full min-h-[480px] lg:min-h-[620px] bg-transparent select-none group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Canvas Layer — Direct Unboxed Bleed */}
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Subtle FPS Counter */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 font-mono text-[10px] text-[#FBBF24]">
          {fps} FPS
        </div>
      </div>
    </div>
  );
};

export default SpectrumSimulation;
