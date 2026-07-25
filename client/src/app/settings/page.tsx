"use client";

import Header from "@/components/Header";
import { useGetAuthUserQuery, useGetTeamsQuery } from "@/state/api";
import React from "react";

const Settings = () => {
  const { data: currentUser, isLoading } = useGetAuthUserQuery({});
  const { data: teams } = useGetTeamsQuery();

  const user = currentUser?.userDetails;
  const userTeam = teams?.find((t) => t.teamId === user?.teamId || (t as any).id === user?.teamId);

  const labelStyles = "block text-sm font-medium dark:text-white";
  const textStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:text-white dark:bg-dark-secondary";

  if (isLoading) return <div className="p-8">Loading settings...</div>;

  return (
    <div className="p-8">
      <Header name="Settings" />
      <div className="space-y-4 max-w-xl">
        <div>
          <label className={labelStyles}>Username</label>
          <div className={textStyles}>{user?.username || "N/A"}</div>
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <div className={textStyles}>{user?.email || "N/A"}</div>
        </div>
        <div>
          <label className={labelStyles}>User ID</label>
          <div className={textStyles}>{user?.userId ? `#${user.userId}` : "N/A"}</div>
        </div>
        <div>
          <label className={labelStyles}>Team</label>
          <div className={textStyles}>{userTeam?.teamName || "No Team Assigned"}</div>
        </div>
        <div>
          <label className={labelStyles}>Unique Account Key</label>
          <div className={textStyles}>{user?.cognitoId || "Local Session"}</div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
