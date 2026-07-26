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
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 2,
  });

  const popularTags = ["Urgent", "Dashboard", "Frontend", "Glassmorphism", "Neon", "Express", "Security"];

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Banner */}
      <div className="mb-6">
        <Header name="Global Workspace Search" />
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Instant search across all project tasks, issue keys, team members, and repository files.
        </p>
      </div>

      {/* Hero Search Box */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative mb-4">
          <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
          <input
            type="text"
            placeholder="Type task title, TF-101 key, project name or username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-white transition"
          />
        </div>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Quick Queries:
          </span>
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className="rounded-lg bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results Container */}
      <div>
        {isLoading && (
          <div className="p-8 text-center text-sm font-bold text-slate-500">
            Searching workspace database...
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
            Error occurred while fetching search results. Please try again.
          </div>
        )}

        {searchTerm.length < 2 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <SearchIcon className="mb-3 h-10 w-10 text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Start typing to search TaskFlow
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Search by issue key (`TF-101`), task status, assignee username, or project title.
            </p>
          </div>
        )}

        {!isLoading && !isError && searchResults && searchTerm.length >= 2 && (
          <div className="space-y-8">
            {/* Tasks Section */}
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <div>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-blue-500" /> Matching Tasks ({searchResults.tasks.length})
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
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-500" /> Matching Projects ({searchResults.projects.length})
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
                <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Users className="h-4 w-4 text-emerald-500" /> Team Members ({searchResults.users.length})
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
                <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                    No results found matching &quot;{searchTerm}&quot;
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
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
