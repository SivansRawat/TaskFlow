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
    <div className="sticky top-0 z-40 flex items-center justify-between border-b border-white/12 bg-[#09090B]/60 px-4 py-3 backdrop-blur-md transition-all">
      {/* Search Bar & Sidebar Toggle */}
      <div className="flex items-center gap-4 md:gap-6">
        {!isSidebarCollapsed ? null : (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <form onSubmit={handleSearchSubmit} className="relative flex h-min w-[220px] md:w-[300px]">
          <Search
            onClick={handleSearchSubmit}
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-white/40 hover:text-[#FBBF24] transition"
          />
          <input
            className="w-full rounded-md border border-white/12 bg-[#18181B] py-2 pl-9 pr-8 text-xs text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
            type="search"
            placeholder="Search projects, tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
          title="Toggle Dark/Light Mode"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-[#FBBF24]" />
          ) : (
            <Moon className="h-5 w-5 text-[#FBBF24]" />
          )}
        </button>

        <Link
          href="/settings"
          className="rounded-md p-2 text-white/60 hover:bg-white/10 hover:text-white transition"
          title="Workspace Settings"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <div className="mx-2 hidden h-5 w-[1px] bg-white/10 md:block" />

        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#18181B] border border-white/15 text-xs font-bold text-white shadow-sm">
            {currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Avatar"}
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover border border-white/10"
              />
            ) : (
              <span>{currentUserDetails?.username?.charAt(0) || "U"}</span>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#A5FF2A] ring-2 ring-[#09090B]" />
          </div>

          <div className="hidden flex-col md:flex">
            <span className="text-xs font-bold text-white">
              {currentUserDetails?.username || "Demo Admin"}
            </span>
            <span className="text-[10px] font-medium text-white/50">
              {currentUserDetails?.email || "admin@taskflow.dev"}
            </span>
          </div>

          <button
            className="ml-2 hidden rounded-md border border-white/12 bg-[#18181B] px-3 py-1.5 text-xs font-bold text-white/85 hover:bg-red-950/40 hover:border-red-800 hover:text-red-400 md:block transition"
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
