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

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

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
          <span className="flex items-center gap-1 rounded bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <UserCheck className="h-3.5 w-3.5" /> Your Team
          </span>
        ) : (
          <button
            onClick={() => handleJoinTeam(teamId)}
            className="rounded bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 transition"
          >
            Join Team
          </button>
        );
      },
    },
  ];

  if (isLoading) return <div className="p-8 dark:text-white">Loading teams...</div>;
  if (isError) return <div className="p-8 text-red-500">Error fetching teams</div>;

  return (
    <div className="flex w-full flex-col p-8">
      <ModalNewTeam
        isOpen={isModalNewTeamOpen}
        onClose={() => setIsModalNewTeamOpen(false)}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Header name="Teams Management" />
        <button
          onClick={() => setIsModalNewTeamOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-blue-700 transition"
        >
          <PlusSquare className="h-4 w-4" /> Create Team
        </button>
      </div>

      {/* User Team Banner */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow dark:bg-dark-secondary dark:text-white">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-3 text-blue-600 dark:bg-neutral-800 dark:text-blue-400">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Active Member Profile
            </div>
            <div className="text-base font-bold">
              {user?.username} —{" "}
              {userTeam ? (
                <span className="text-blue-600 dark:text-blue-400">{userTeam.teamName}</span>
              ) : (
                <span className="text-gray-400 font-normal">No Team Joined</span>
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
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Teams;
