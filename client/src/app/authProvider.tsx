
"use client";

import React, { useState, useEffect } from "react";
import { useGetAuthUserQuery, useCreateUserMutation, useLoginUserMutation } from "@/state/api";
import Image from "next/image";
import Logo from "@/components/Logo";
import LandingPage from "@/components/LandingPage";

import WebGLBackground from "@/components/WebGLBackground";

const avatars = [
  "p1.jpeg", "p2.jpeg", "p3.jpeg", "p4.jpeg",
  "p5.jpeg", "p6.jpeg", "p7.jpeg", "p8.jpeg"
];

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sign In state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Sign Up state
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("p1.jpeg");

  const { data: currentUser, refetch, isLoading: isAuthLoading } = useGetAuthUserQuery(activeSub);
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const storedSub = localStorage.getItem("taskflow_user_sub");
    if (storedSub) {
      setActiveSub(storedSub);
    } else {
      setActiveSub(null);
    }
  }, []);

  const handleQuickDemoLogin = async (demoSub: string = "123e4567-e89b-12d3-a456-426614174001") => {
    localStorage.setItem("taskflow_user_sub", demoSub);
    setActiveSub(demoSub);
    setIsAuthModalOpen(false);
    await refetch();
  };

  const openAuthModal = (initialMode: "signin" | "signup" = "signin") => {
    setMode(initialMode);
    setErrorMsg(null);
    setIsAuthModalOpen(true);
  };

  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!loginUsername.trim() || !loginPassword.trim()) return;

    try {
      const res = await loginUser({
        username: loginUsername.trim(),
        password: loginPassword.trim(),
      }).unwrap();

      const userSub = res.newUser.cognitoId || String(res.newUser.userId);
      localStorage.setItem("taskflow_user_sub", userSub);
      setActiveSub(userSub);
      setLoginPassword("");
      setIsAuthModalOpen(false);
      await refetch();
    } catch (err: any) {
      try {
        const res = await createUser({
          username: loginUsername.trim(),
          password: loginPassword.trim(),
          profilePictureUrl: "p1.jpeg",
        }).unwrap();
        const userSub = res.newUser.cognitoId || String(res.newUser.userId);
        localStorage.setItem("taskflow_user_sub", userSub);
        setActiveSub(userSub);
        setIsAuthModalOpen(false);
        await refetch();
      } catch (createErr: any) {
        setErrorMsg("Invalid credentials. Please check your username and password or create a new account.");
      }
    }
  };

  const handleCreateAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!newUsername.trim() || !newPassword.trim()) return;

    try {
      const res = await createUser({
        username: newUsername.trim(),
        email: newEmail.trim() || undefined,
        password: newPassword.trim(),
        profilePictureUrl: selectedAvatar,
      }).unwrap();

      const userSub = res.newUser.cognitoId || String(res.newUser.userId);
      localStorage.setItem("taskflow_user_sub", userSub);
      setActiveSub(userSub);
      setNewUsername("");
      setNewEmail("");
      setNewPassword("");
      setIsAuthModalOpen(false);
      await refetch();
    } catch (err: any) {
      setErrorMsg(err.data?.message || "Error creating user account");
    }
  };

  if (isAuthLoading && activeSub) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#09090B] text-white">
        <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-white">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#FBBF24] border-t-transparent" />
          <span>INITIALIZING SECURE SESSION...</span>
        </div>
      </div>
    );
  }

  const isAuthenticated = Boolean(currentUser?.userDetails && activeSub);

  // If authenticated, open the application workspace
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If not authenticated, show Landing Page with Auth Modal
  return (
    <div className="relative w-full min-h-screen bg-[#09090B] overflow-x-hidden">
      <WebGLBackground />
      
      <div className="relative z-10 w-full min-h-screen">
        <LandingPage onOpenAuth={(m) => openAuthModal(m || "signin")} />
      </div>

      {/* Auth Modal Overlay */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-md rounded-xl bg-[#18181B] border border-white/12 p-8 shadow-2xl text-white">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute right-4 top-4 rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition"
            >
              ✕
            </button>

            <div className="mb-6 text-center">
              <div className="mb-2 flex items-center justify-center gap-3">
                <Logo size={44} />
                <h1 className="text-xl font-bold tracking-wider text-white uppercase font-mono">
                  TASKFLOW
                </h1>
              </div>
              <p className="text-xs text-white/60">
                Sign in to your account or register to start
              </p>
            </div>

            {errorMsg && (
              <div className="mb-4 rounded-md bg-red-500/10 border border-red-500/30 p-3 text-xs font-semibold text-red-400">
                {errorMsg}
              </div>
            )}

            {/* Tab Switcher */}
            <div className="mb-6 flex rounded-md bg-[#09090B] p-1 border border-white/10">
              <button
                type="button"
                className={`flex-1 rounded-md py-2.5 text-xs font-bold transition-all ${
                  mode === "signin"
                    ? "bg-[#FBBF24] text-black shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
                onClick={() => {
                  setMode("signin");
                  setErrorMsg(null);
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`flex-1 rounded-md py-2.5 text-xs font-bold transition-all ${
                  mode === "signup"
                    ? "bg-[#FBBF24] text-black shadow-md"
                    : "text-white/60 hover:text-white"
                }`}
                onClick={() => {
                  setMode("signup");
                  setErrorMsg(null);
                }}
              >
                Create Account
              </button>
            </div>

            {mode === "signin" ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Username or Email
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-sm text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-sm text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingIn || !loginUsername.trim() || !loginPassword.trim()}
                  className="mt-2 w-full rounded-md bg-[#FBBF24] py-3 text-sm font-bold text-black hover:bg-[#F59E0B] transition-all disabled:opacity-50"
                >
                  {isLoggingIn ? "AUTHENTICATING..." : "SIGN IN & ACCESS WORKSPACE"}
                </button>

                <div className="relative my-4 flex items-center justify-center">
                  <div className="w-full border-t border-white/10" />
                  <span className="absolute bg-[#18181B] px-3 text-xs font-semibold text-white/40">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin()}
                  className="w-full rounded-md border border-white/15 bg-[#27272A] py-3 text-xs font-bold text-[#FBBF24] hover:bg-[#3F3F46] transition-all flex items-center justify-center gap-2"
                >
                  ⚡ Quick Demo Sign-In (Instant Access)
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AlexMorgan"
                    className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-sm text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="alex@example.com"
                    className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-sm text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-sm text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-white/50">
                    Choose Profile Avatar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {avatars.map((img) => (
                      <button
                        key={img}
                        type="button"
                        onClick={() => setSelectedAvatar(img)}
                        className={`relative overflow-hidden rounded-full border-2 p-1 transition ${
                          selectedAvatar === img
                            ? "border-[#FBBF24] scale-105"
                            : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={`/${img}`}
                          alt="Avatar"
                          width={48}
                          height={48}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreating || !newUsername.trim() || !newPassword.trim()}
                  className="mt-2 w-full rounded-md bg-[#FBBF24] py-3 text-sm font-bold text-black hover:bg-[#F59E0B] transition-all disabled:opacity-50"
                >
                  {isCreating ? "CREATING ACCOUNT..." : "CREATE ACCOUNT & LAUNCH WORKSPACE"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthProvider;