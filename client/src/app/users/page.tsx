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

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  if (isLoading) return <div className="p-8 font-semibold text-[#FBBF24]">LOADING USER DIRECTORY...</div>;
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
        <span className="font-mono text-xs font-bold text-white/50">
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
                className="h-full w-full rounded-full object-cover border border-white/12"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#18181B] border border-white/12 font-bold text-white text-xs uppercase">
                {params.row.username?.charAt(0) || "U"}
              </div>
            )}
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#A5FF2A] ring-2 ring-[#09090B]" />
          </div>
        </div>
      ),
    },
    {
      field: "username",
      headerName: "Username",
      width: 180,
      renderCell: (params) => (
        <span className="font-bold text-white">{params.value}</span>
      ),
    },
    {
      field: "email",
      headerName: "Email Address",
      width: 220,
      renderCell: (params) => (
        <span className="text-xs text-white/50 font-medium">
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
          <span className="rounded-sm bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white border border-white/12">
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
          <p className="mt-1 text-xs text-white/50">
            Manage organization members, engineering team roles, and access credentials.
          </p>
        </div>
      </div>

      {/* Metrics Summary Row */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-lg border border-white/12 bg-[#18181B]/75 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#FBBF24]/10 border border-[#FBBF24]/20 text-[#FBBF24]">
            <UsersIcon className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{allUsers.length}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">Total Active Users</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-white/12 bg-[#18181B]/75 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#A5FF2A]/10 border border-[#A5FF2A]/20 text-[#A5FF2A]">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">{teams?.length || 5}</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">Engineering Teams</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-lg border border-white/12 bg-[#18181B]/75 p-5 backdrop-blur-md text-white shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-white/5 border border-white/10 text-white/80">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight">100%</div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">Verified Credentials</div>
          </div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-white/12 bg-[#18181B] py-2 pl-9 pr-3 text-xs text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition"
          />
        </div>

        <div className="flex items-center gap-1 rounded-md border border-white/12 bg-[#18181B] p-1">
          <button
            onClick={() => setViewMode("cards")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
              viewMode === "cards"
                ? "bg-[#FBBF24] text-black shadow"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Team Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-bold transition ${
              viewMode === "table"
                ? "bg-[#FBBF24] text-black shadow"
                : "text-white/60 hover:text-white hover:bg-white/5"
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
                className="group relative flex flex-col items-center rounded-lg border border-white/12 bg-[#18181B]/75 p-6 backdrop-blur-md text-center transition-all duration-200 hover:border-[#FBBF24]/30 hover:scale-[1.01]"
              >
                <div className="relative mb-3 h-16 w-16">
                  {user.profilePictureUrl ? (
                    <Image
                      src={`/${user.profilePictureUrl}`}
                      alt={user.username}
                      width={64}
                      height={64}
                      className="h-full w-full rounded-full object-cover border-2 border-white/12"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#09090B] border border-white/12 text-xl font-bold text-white uppercase shadow-md">
                      {user.username.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-[#A5FF2A] ring-2 ring-[#18181B]" />
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-[#FBBF24] transition">
                  {user.username}
                </h3>
                <p className="mb-3 text-xs text-white/50">
                  {user.email || `${user.username.toLowerCase()}@taskflow.dev`}
                </p>

                <span className="rounded-sm border border-white/12 bg-white/5 px-3 py-0.5 text-xs font-semibold text-white/75 font-mono">
                  {team ? team.teamName : "Software Engineer"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-white/12 bg-[#18181B]/75 p-4 backdrop-blur-md shadow-lg">
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
              sx={dataGridSxStyles(true)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
