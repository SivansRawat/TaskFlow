import Modal from "@/components/Modal";
import { useCreateTeamMutation, useGetUsersQuery } from "@/state/api";
import React, { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { data: users } = useGetUsersQuery();

  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState("");
  const [projectManagerUserId, setProjectManagerUserId] = useState("");

  const handleSubmit = async () => {
    if (!teamName.trim()) return;

    await createTeam({
      teamName: teamName.trim(),
      productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : undefined,
      projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : undefined,
    });

    setTeamName("");
    setProductOwnerUserId("");
    setProjectManagerUserId("");
    onClose();
  };

  const inputStyles =
    "w-full rounded-md border border-white/12 bg-[#09090B] p-2 text-xs font-semibold text-white placeholder-white/30 focus:border-[#FBBF24] focus:outline-none transition";

  const selectStyles =
    "w-full rounded-md border border-white/12 bg-[#09090B] p-2 text-xs font-semibold text-white focus:border-[#FBBF24] focus:outline-none transition";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
      <form
        className="mt-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">Team Name</label>
          <input
            type="text"
            className={inputStyles}
            placeholder="e.g. Frontend Engineering"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">Product Owner (Optional)</label>
          <select
            className={selectStyles}
            value={productOwnerUserId}
            onChange={(e) => setProductOwnerUserId(e.target.value)}
          >
            <option value="">Select Product Owner...</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username} (#{user.userId})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-white/40 font-mono">Project Manager (Optional)</label>
          <select
            className={selectStyles}
            value={projectManagerUserId}
            onChange={(e) => setProjectManagerUserId(e.target.value)}
          >
            <option value="">Select Project Manager...</option>
            {users?.map((user) => (
              <option key={user.userId} value={user.userId}>
                {user.username} (#{user.userId})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className={`mt-4 flex w-full justify-center rounded-md bg-[#FBBF24] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#F59E0B] focus:outline-none transition ${
            !teamName.trim() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!teamName.trim() || isLoading}
        >
          {isLoading ? "Creating Team..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTeam;
