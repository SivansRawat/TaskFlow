"use client";

import { useGetUsersQuery, useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import Image from "next/image";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { Users as UsersIcon, ShieldCheck, Mail, Search, LayoutGrid, List as ListIcon, UserPlus } from "lucide-react";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2 p-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Users = () => {
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const { data: teams } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");

  if (isLoading) return <div className="p-8 font-semibold text-slate-500">Loading user directory...</div>;
  if (isError || !users) return <div className="p-8 font-semibold text-red-500">Error fetching user directory</div>;

  const allUsers = users || [];
  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const columns: GridColDef[] = [
    {
      field: "userId",
      headerName: "User ID",
      width: 90,
      renderCell: (params) => (
        <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
          #{params.value}
        </span>
      ),
    },
    {
      field: "profilePictureUrl",
      headerName: "Avatar",
      width: 80,
      renderCell: (params) => (
        <div className="flex h-full w-full items-center justify-center">
          <div className="relative h-8 w-8">
            {params.value ? (
              <Image
                src={`/${params.value}`}
                alt={params.row.username}
                width={32}
                height={32}
                className="h-full w-full rounded-full object-cover border border-slate-700"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white text-xs uppercase">
                {params.row.username?.charAt(0) || "U"}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 180,
      renderCell: (params) => (
        <span className="font-bold text-slate-900 dark:text-white">{params.value}</span>
      ),
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 220,
      renderCell: (params) => (
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          {params.value || `${params.row.username?.toLowerCase()}@taskflow.dev`}
        </span>
      ),
    },
    {
      field: "teamId",
      headerName: "Assigned Team",
      width: 180,
      renderCell: (params) => {
        const team = teams?.find((t) => (t as any).id === params.value || t.teamId === params.value);
        return (
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            {team ? team.teamName : "Engineering Team"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen p-6 md:p-8">
      {/* Header Banner */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Header name="User Directory" />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage organization members, engineering team roles, and access credentials.
          </p>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{allUsers.length}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Active Users</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{teams?.length || 5}</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Engineering Teams</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">100%</div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Credentials</div>
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-semibold text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white transition"
          />
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === "cards"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Team Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              viewMode === "table"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-white"
            }`}
          >
            <ListIcon className="h-3.5 w-3.5" /> DataGrid Table
          </button>
        </div>
      </div>

      {/* User Directory Rendering */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((user) => {
            const team = teams?.find((t) => (t as any).id === user.teamId || t.teamId === user.teamId);
            return (
              <div
                key={user.userId}
                className="group relative flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-blue-500/50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-all text-center"
              >
                <div className="relative mb-3 h-16 w-16">
                  {user.profilePictureUrl ? (
                    <Image
                      src={`/${user.profilePictureUrl}`}
                      alt={user.username}
                      width={64}
                      height={64}
                      className="h-full w-full rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xl font-bold text-white uppercase shadow-md">
                      {user.username.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition">
                  {user.username}
                </h3>
                <p className="mb-3 text-xs text-slate-400">
                  {user.email || `${user.username.toLowerCase()}@taskflow.dev`}
                </p>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  {team ? team.teamName : "Software Engineer"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              getRowId={(row) => row.userId}
              pagination
              slots={{
                toolbar: CustomToolbar,
              }}
              className={dataGridClassNames}
              sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
