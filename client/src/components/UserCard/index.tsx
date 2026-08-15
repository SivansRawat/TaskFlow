import { User } from "@/state/api";
import Image from "next/image";
import React from "react";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/12 bg-[#18181B]/75 p-4 text-white hover:border-[#FBBF24]/30 hover:scale-[1.01] transition duration-200">
      {user.profilePictureUrl ? (
        <Image
          src={`/${user.profilePictureUrl}`}
          alt="profile picture"
          width={32}
          height={32}
          className="rounded-full border border-white/10"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#09090B] border border-white/12 font-bold text-white text-xs uppercase font-mono">
          {user.username?.charAt(0) || "U"}
        </div>
      )}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-tight">{user.username}</h3>
        <p className="text-xs text-white/50">{user.email || `${user.username?.toLowerCase()}@taskflow.dev`}</p>
      </div>
    </div>
  );
};

export default UserCard;
