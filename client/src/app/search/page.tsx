"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Search as SearchIcon, Sparkles, Filter, Briefcase, CheckSquare, Users } from "lucide-react";

const Search = () => {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(queryParam);

  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
    }
  }, [queryParam]);

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  const popularTags = ["Urgent", "Dashboard", "Frontend", "Glassmorphism", "Neon", "Express", "Security"];

  return (
    <div className="min-h-screen p-6 md:p-8 bg-transparent">
      {/* Header Banner */}
      <div className="mb-6">
        <Header name="Global Workspace Search" />
        <p className="mt-1 text-xs text-white/50">
          Instant search across all project tasks, issue keys, team members, and repository files.
        </p>
      </div>

      {/* Hero Search Box */}
      <div className="mb-8 rounded-lg border border-white/12 bg-[#18181B]/75 p-6 backdrop-blur-md text-white shadow-lg">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-[#FBBF24]" />
          <input
            type="text"
            placeholder="Type task title, TF-101 key, project name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-white/12 bg-[#09090B] py-3 pl-12 pr-4 text-sm font-bold text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
          />
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-[#FBBF24]" /> Quick Queries:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-white/70 hover:bg-[#FBBF24] hover:text-black hover:border-[#FBBF24] transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div>
        {isSearchLoading && (
          <div className="p-8 text-center text-sm font-bold text-[#FBBF24]">
            SEARCHING WORKSPACE DATABASE...
          </div>
        )}

        {isError && (
          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-4 text-xs font-bold text-red-400">
            Error occurred while fetching search results. Please try again.
          </div>
        )}

        {searchTerm.length < 2 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-[#18181B]/50 p-12 text-center backdrop-blur-md">
            <SearchIcon className="mb-3 h-10 w-10 text-white/40" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Start typing to search TaskFlow
            </h3>
            <p className="mt-1 text-xs text-white/40">
              Search by issue key (`TF-101`), task status, assignee username, or project title.
            </p>
          </div>
        )}

        {!isSearchLoading && !isError && searchResults && searchTerm.length >= 2 && (
          <div className="space-y-8">
            {/* Tasks Section */}
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <div>
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-[#FBBF24]" /> Matching Tasks ({searchResults.tasks.length})
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {searchResults.projects && searchResults.projects.length > 0 && (
              <div>
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-[#A5FF2A]" /> Matching Projects ({searchResults.projects.length})
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {/* Users Section */}
            {searchResults.users && searchResults.users.length > 0 && (
              <div>
                <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-white/50 font-mono flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#F59E0B]" /> Team Members ({searchResults.users.length})
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!searchResults.tasks?.length &&
              !searchResults.projects?.length &&
              !searchResults.users?.length && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-white/12 bg-[#18181B]/75 p-12 text-center backdrop-blur-md shadow-lg">
                  <p className="text-sm font-bold text-white uppercase tracking-wider">
                    No results found matching &quot;{searchTerm}&quot;
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    Try searching for another keyword or browse project boards.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
