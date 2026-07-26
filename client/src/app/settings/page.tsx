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
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Header name="Workspace Settings" />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure your profile details, application theme preferences, and cloud infrastructure connections.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-700 transition"
        >
          {savedSuccess ? <Check className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
          {savedSuccess ? "Preferences Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {/* Panel 1: Profile & User Identity */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-500" /> Profile & User Account
          </h3>

          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="relative h-16 w-16">
              {user?.profilePictureUrl ? (
                <Image
                  src={`/${user.profilePictureUrl}`}
                  alt={user.username}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-full object-cover border-2 border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-bold text-white uppercase shadow-md">
                  {user?.username?.charAt(0) || "U"}
                </div>
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{user?.username || "Demo User"}</h4>
              <p className="text-xs text-slate-400">{user?.email || "admin@taskflow.dev"}</p>
              <span className="mt-1 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                {userTeam ? userTeam.teamName : "Engineering Team Lead"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Username
              </label>
              <input
                type="text"
                readOnly
                value={user?.username || "SivansRawat"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || "sivans@taskflow.dev"}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-800 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Panel 2: Preferences & Theme */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-400" /> Appearance & Theme Preferences
          </h3>

          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/80">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Interface Color Theme</div>
              <div className="text-[11px] text-slate-400">Switch between dark slate theme and high-contrast light mode.</div>
            </div>
            <button
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
              className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:border-slate-700 transition"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
              {isDarkMode ? "Dark Mode" : "Light Mode"}
            </button>
          </div>
        </div>

        {/* Panel 3: Cloud Infrastructure & System Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Server className="h-4 w-4 text-emerald-500" /> Cloud Infrastructure & System Status
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950/60 text-xs">
              <div className="flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-300">
                <Database className="h-4 w-4 text-blue-500" /> Neon PostgreSQL Database
              </div>
              <span className="flex items-center gap-1.5 font-extrabold text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Connected
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 dark:bg-slate-950/60 text-xs">
              <div className="flex items-center gap-2.5 font-bold text-slate-700 dark:text-slate-300">
                <Server className="h-4 w-4 text-indigo-500" /> Render API Web Service
              </div>
              <span className="font-mono text-[11px] font-semibold text-slate-400">v1.0.0 (Production)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
