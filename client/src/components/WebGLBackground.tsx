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
        const supported = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
        return supported;
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

    // Dimensions
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
      // Normalize between -1 and 1
      mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Responsive adaptation: reduce particles/complexity on mobile
    const isMobile = width < 768;
    const particleCount = isMobile ? 300 : 800;

    // 1. Dot-matrix particle field (Sparse matrix structure)
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const initialPositions = new Float32Array(particleCount * 3);

    // Generate particle field coordinates in a sparse grid/matrix
    for (let i = 0; i < particleCount; i++) {
      // Create a grid-like particle structure with slight random displacements
      const x = ((i % 25) - 12.5) * (isMobile ? 1.4 : 2.0);
      const z = (Math.floor(i / 25) - (particleCount / 50)) * (isMobile ? 1.4 : 2.0);
      const y = (Math.sin(x * 0.2) + Math.cos(z * 0.2)) * 1.5;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z - 10; // set them back in z

      initialPositions[i * 3] = x;
      initialPositions[i * 3 + 1] = y;
      initialPositions[i * 3 + 2] = z - 10;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Particle styling: Sparse green dot particles with depth attenuation
    // Create a round dot canvas map for particle styling
    const createDotTexture = () => {
      const dotCanvas = document.createElement("canvas");
      dotCanvas.width = 16;
      dotCanvas.height = 16;
      const ctx = dotCanvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(165, 255, 42, 1)"); // #A5FF2A
        gradient.addColorStop(0.3, "rgba(165, 255, 42, 0.8)");
        gradient.addColorStop(1, "rgba(165, 255, 42, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      return new THREE.CanvasTexture(dotCanvas);
    };

    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.3 : 0.5,
      map: createDotTexture(),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particleField = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleField);

    // 2. Spatial Geometry: Wireframe Icosahedron
    const icosahedronGeo = new THREE.IcosahedronGeometry(isMobile ? 2.5 : 4, 1);
    const icosahedronMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24, // Primary #FBBF24
      wireframe: true,
      transparent: true,
      opacity: 0.12,
      roughness: 0.2,
      metalness: 0.8,
    });
    const icosahedron = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    icosahedron.position.set(isMobile ? 0 : 5, isMobile ? 1 : 2, -2);
    scene.add(icosahedron);

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xa5ff2a, 1.2); // Tertiary tint directional light
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
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax rotation
      particleField.rotation.y = mouse.x * 0.08;
      particleField.rotation.x = -mouse.y * 0.08;
      
      icosahedron.rotation.y = elapsed * 0.08 + mouse.x * 0.15;
      icosahedron.rotation.x = elapsed * 0.05 - mouse.y * 0.15;

      if (!isReducedMotion) {
        // Slow breathing pulse animation for particle matrix
        const positionAttr = particleGeometry.attributes.position as THREE.BufferAttribute;
        const array = positionAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const initialY = initialPositions[i * 3 + 1];
          const initialX = initialPositions[i * 3];
          const initialZ = initialPositions[i * 3 + 2];

          // Breathing amplitude
          const pulse = Math.sin(elapsed * 0.6 + initialX * 0.15 + initialZ * 0.1) * 0.6;
          array[i * 3 + 1] = initialY + pulse;
        }
        positionAttr.needsUpdate = true;
        
        // Depth pulse on Icosahedron
        icosahedron.position.z = -2 + Math.sin(elapsed * 0.4) * 0.5;
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
      particleGeometry.dispose();
      particleMaterial.dispose();
      icosahedronGeo.dispose();
      icosahedronMat.dispose();
      renderer.dispose();
    };
  }, [webglSupported]);

  if (!webglSupported) {
    // Graceful CSS Fallback
    return (
      <div className="absolute inset-0 z-0 bg-[#09090B] pointer-events-none w-full h-full overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-[#A5FF2A]/[0.02] blur-[150px] animate-pulse" style={{ animationDuration: "8s" }} />
        <div className="absolute bottom-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[#FBBF24]/[0.02] blur-[120px]" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden bg-[#09090B]">
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default WebGLBackground;
