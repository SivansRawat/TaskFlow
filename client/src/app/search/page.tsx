"use client";

import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

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

  return (
    <div className="p-8">
      <Header name="Search" />
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks, projects, users..."
          value={searchTerm}
          className="w-full max-w-lg rounded border border-gray-300 p-3 shadow-sm focus:outline-none dark:border-dark-tertiary dark:bg-dark-secondary dark:text-white"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        {isLoading && <p className="text-gray-500">Searching...</p>}
        {isError && <p className="text-red-500">Error occurred while fetching search results.</p>}
        {!isLoading && !isError && searchResults && (
          <div className="space-y-6">
            {searchResults.tasks && searchResults.tasks.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold dark:text-white">Tasks ({searchResults.tasks.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {searchResults.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            )}

            {searchResults.projects && searchResults.projects.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold dark:text-white">Projects ({searchResults.projects.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {searchResults.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>
            )}

            {searchResults.users && searchResults.users.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-bold dark:text-white">Users ({searchResults.users.length})</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {searchResults.users.map((user) => (
                    <UserCard key={user.userId} user={user} />
                  ))}
                </div>
              </div>
            )}

            {searchTerm.length >= 2 &&
              !searchResults.tasks?.length &&
              !searchResults.projects?.length &&
              !searchResults.users?.length && (
                <p className="text-gray-500">No results found for &quot;{searchTerm}&quot;.</p>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
