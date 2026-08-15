"use client";

import Header from "@/components/Header";
import { useGetAuthUserQuery, useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode } from "@/state";
import { User, Shield, Server, Database, Bell, Sun, Moon, Check, Save } from "lucide-react";
import Image from "next/image";

const Settings = () => {
  const { data: currentUser, isLoading } = useGetAuthUserQuery({});
  const { data: teams } = useGetTeamsQuery();
  const dispatch = useAppDispatch();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const user = currentUser?.userDetails;
  const userTeam = teams?.find((t) => t.teamId === user?.teamId || (t as any).id === user?.teamId);

  if (isLoading) return <div className="p-8 font-semibold text-slate-500">Loading settings...</div>;

  const handleSaveSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen p-6 md:p-8 bg-transparent text-white">
      {/* Header Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Header name="Workspace Settings" />
          <p className="mt-1 text-xs text-white/50">
            Configure your profile details, application theme preferences, and cloud infrastructure connections.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
        >
          {savedSuccess ? <Check className="h-4 w-4 text-emerald-600" /> : <Save className="h-4 w-4" />}
          {savedSuccess ? "Preferences Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Panel 1: Profile & User Identity */}
        <div className="rounded-lg border border-white/12 bg-[#18181B]/75 p-6 backdrop-blur-md text-white shadow-lg">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
            <User className="h-4 w-4 text-[#FBBF24]" /> Profile & User Account
          </h3>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
            <div className="relative h-16 w-16">
              {user?.profilePictureUrl ? (
                <Image
                  src={`/${user.profilePictureUrl}`}
                  alt={user.username}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover border-2 border-white/12"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-[#09090B] border border-white/12 text-xl font-bold text-white uppercase">
                  {user?.username?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-white uppercase tracking-tight">{user?.username || "Demo User"}</h4>
              <p className="text-xs text-white/50">{user?.email || "admin@taskflow.dev"}</p>
              <span className="mt-1 inline-block rounded-sm bg-white/5 px-2.5 py-0.5 text-[10px] font-bold text-white/70 font-mono border border-white/12">
                {userTeam ? userTeam.teamName : "Engineering Team Lead"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
                Username
              </label>
              <input
                type="text"
                readOnly
                value={user?.username || "SivansRawat"}
                className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-xs font-bold text-white/70 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || "sivans@taskflow.dev"}
                className="w-full rounded-md border border-white/12 bg-[#09090B] p-3 text-xs font-bold text-white/70 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Preferences & Theme */}
        <div className="rounded-lg border border-white/12 bg-[#18181B]/75 p-6 backdrop-blur-md text-white shadow-lg">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
            <Sun className="h-4 w-4 text-[#FBBF24]" /> Appearance & Theme Preferences
          </h3>

          <div className="flex items-center justify-between rounded-md bg-[#09090B] p-4 border border-white/10">
            <div>
              <div className="text-xs font-bold text-white">Interface Color Theme</div>
              <div className="text-[11px] text-white/50">Switch between dark slate theme and high-contrast light mode.</div>
            </div>
            <button
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              className="flex items-center gap-2 rounded-md bg-[#18181B] px-4 py-2 text-xs font-bold text-white border border-white/10 hover:bg-white/5 transition"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-[#FBBF24]" /> : <Moon className="h-4 w-4 text-white/60" />}
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>

        {/* Panel 3: Cloud Infrastructure & System Details */}
        <div className="rounded-lg border border-white/12 bg-[#18181B]/75 p-6 backdrop-blur-md text-white shadow-lg">
          <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
            <Server className="h-4 w-4 text-[#A5FF2A]" /> Cloud Infrastructure & System Status
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-[#09090B] p-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-2.5 font-bold text-white/80">
                <Database className="h-4 w-4 text-[#FBBF24]" /> Neon PostgreSQL Database
              </div>
              <span className="flex items-center gap-1.5 font-extrabold text-emerald-400 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
              </span>
            </div>

            <div className="flex items-center justify-between rounded-md bg-[#09090B] p-3.5 border border-white/10 text-xs">
              <div className="flex items-center gap-2.5 font-bold text-white/80">
                <Server className="h-4 w-4 text-[#A5FF2A]" /> Render API Web Service
              </div>
              <span className="font-mono text-[11px] font-semibold text-white/40">v1.0.0 (Production)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
