"use client";

import { useGetAuthUserQuery, useGetTeamsQuery, useUpdateUserTeamMutation } from "@/state/api";
import React, { useState } from "react";
import { useAppSelector } from "../redux";
import Header from "@/components/Header";
import ModalNewTeam from "@/components/ModalNewTeam";
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { PlusSquare, Users, UserCheck } from "lucide-react";

const CustomToolbar = () => (
  <GridToolbarContainer className="toolbar flex gap-2">
    <GridToolbarFilterButton />
    <GridToolbarExport />
  </GridToolbarContainer>
);

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const { data: currentUser } = useGetAuthUserQuery({});
  const [updateUserTeam] = useUpdateUserTeamMutation();
  const [isModalNewTeamOpen, setIsModalNewTeamOpen] = useState(false);

  const user = currentUser?.userDetails;
  const userTeam = teams?.find((t) => t.teamId === user?.teamId || (t as any).id === user?.teamId);

  const handleJoinTeam = async (teamId: number) => {
    if (!user?.userId) return;
    await updateUserTeam({ userId: user.userId, teamId });
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "Team ID", width: 100 },
    { field: "teamName", headerName: "Team Name", width: 220 },
    { field: "productOwnerUsername", headerName: "Product Owner", width: 200, renderCell: (params) => params.value || "Unassigned" },
    { field: "projectManagerUsername", headerName: "Project Manager", width: 200, renderCell: (params) => params.value || "Unassigned" },
    {
      field: "actions",
      headerName: "Join Team",
      width: 160,
      renderCell: (params) => {
        const teamId = params.row.id || params.row.teamId;
        const isCurrentTeam = user?.teamId === teamId;
        return isCurrentTeam ? (
          <span className="flex items-center gap-1 rounded-sm border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400 font-mono">
            <UserCheck className="h-3.5 w-3.5" /> Your Team
          </span>
        ) : (
          <button
            onClick={() => handleJoinTeam(teamId)}
            className="rounded-md bg-[#FBBF24] px-3 py-1 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
          >
            Join Team
          </button>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-8 font-semibold text-[#FBBF24]">LOADING TEAMS...</div>;
  if (isError) return <div className="p-8 text-red-500 font-semibold">Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8 bg-transparent">
      <ModalNewTeam
        isOpen={isModalNewTeamOpen}
        onClose={() => setIsModalNewTeamOpen(false)}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Header name="Teams Management" />
        <button
          onClick={() => setIsModalNewTeamOpen(true)}
          className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
        >
          <PlusSquare className="h-4 w-4" /> Create Team
        </button>
      </div>

      {/* User Team Banner */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-white/12 bg-[#18181B]/75 p-4 backdrop-blur-md text-white shadow-lg">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-[#FBBF24]/10 p-3 text-[#FBBF24] border border-[#FBBF24]/20">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">
              Active Member Profile
            </div>
            <div className="text-sm font-bold">
              {user?.username} —{" "}
              {userTeam ? (
                <span className="text-[#FBBF24] font-mono">{userTeam.teamName}</span>
              ) : (
                <span className="text-white/40 font-normal">No Team Joined</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ height: 550, width: "100%" }}>
        <DataGrid
          rows={teams || []}
          columns={columns}
          getRowId={(row) => row.id || row.teamId}
          pagination
          slots={{
            toolbar: CustomToolbar,
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(true)}
        />
      </div>
    </div>
  );
};

export default Teams;
