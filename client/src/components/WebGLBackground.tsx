"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const WebGLBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL availability
    const detectWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        return !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
      } catch (e) {
        return false;
      }
    };

    if (!detectWebGL()) {
      setWebglSupported(false);
      return;
    }

    if (!canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 25;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // Reduced Motion Detection
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // Mouse Tracking for Pointer-reactive drift
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (event: MouseEvent) => {
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const isMobile = width < 768;

    // 1. Subtle Spatial Geometry: Refined Ambient Wireframe Node
    const icosahedronGeo = new THREE.IcosahedronGeometry(isMobile ? 3 : 5, 1);
    const icosahedronMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Primary #FBBF24 Gold
      wireframe: true,
      transparent: true,
      opacity: 0.06,
      roughness: 0.3,
      metalness: 0.7,
    });
    const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    icosahedron.position.set(isMobile ? 0 : 6, isMobile ? 1 : 2, -4);
    scene.add(icosahedron);

    // 2. Lighting System — Clean Soft Amber Ambient Glow
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xfbbf24, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      width = containerRef.current.clientWidth;
      height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();

      // Smooth cursor drift interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Parallax rotation
      icosahedron.rotation.y = elapsed * 0.05 + mouse.x * 0.1;
      icosahedron.rotation.x = elapsed * 0.03 - mouse.y * 0.1;

      if (!isReducedMotion) {
        // Depth pulse on Icosahedron
        icosahedron.position.z = -4 + Math.sin(elapsed * 0.3) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      mediaQuery.removeEventListener("change", handleMotionChange);

      // Dispose resources
      icosahedronGeo.dispose();
      icosahedronMat.dispose();
      renderer.dispose();
    };
  }, [webglSupported]);

  if (!webglSupported) {
    return (
      <div className="absolute inset-0 z-0 bg-[#09090B] pointer-events-none w-full h-full overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#FBBF24]/[0.02] blur-[150px]" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden bg-[#09090B]"
    >
      {/* Clean Subtle Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Soft Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.035),transparent_70%)] blur-3xl" />
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default WebGLBackground;
