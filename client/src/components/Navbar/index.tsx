import React, { useState } from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: currentUser } = useGetAuthUserQuery({});

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const currentUserDetails = currentUser?.userDetails;

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80 transition-all">
      {/* Search Bar & Sidebar Toggle */}
      <div className="flex items-center gap-4 md:gap-6">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <form onSubmit={handleSearchSubmit} className="relative flex h-min w-[220px] md:w-[300px]">
          <Search
            onClick={handleSearchSubmit}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-slate-400 hover:text-blue-500 transition"
          />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-100/70 py-2 pl-9 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder-slate-500 dark:focus:border-blue-500 transition"
            type="search"
            placeholder="Search projects, tasks (⌘K)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-amber-400" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </button>

        <Link
          href="/settings"
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition"
          title="Workspace Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <div className="mx-2 hidden h-5 w-[1px] bg-slate-200 dark:bg-slate-800 md:block" />

        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-sm">
            {currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Avatar"}
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover border border-slate-700"
              />
            ) : (
              <span>{currentUserDetails?.username?.charAt(0) || "U"}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div className="hidden flex-col md:flex">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
              {currentUserDetails?.username || "Demo Admin"}
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              {currentUserDetails?.email || "admin@taskflow.dev"}
            </span>
          </div>

          <button
            className="ml-2 hidden rounded-lg bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-red-950/40 dark:hover:border-red-900 dark:hover:text-red-400 md:block transition"
            onClick={() => {
              localStorage.removeItem("taskflow_user_sub");
              window.location.reload();
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
