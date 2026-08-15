import Header from "@/components/Header";
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react";
import React, { useState } from "react";
import ModalNewProject from "./ModalNewProject";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="pb-4 pt-6">
        <Header
          name="Project Workspace"
          buttonComponent={
            <button
              className="flex items-center gap-2 rounded-md bg-[#FBBF24] px-4 py-2.5 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="h-4 w-4" /> New Project
            </button>
          }
        />
      </div>

      {/* TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-4 w-4" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`flex items-center gap-2 rounded-md px-4 py-2 text-xs font-bold transition-all duration-150 ${
        isActive
          ? "bg-[#FBBF24] text-black shadow-md"
          : "bg-[#18181B] text-white/60 border border-white/10 hover:bg-white/5 hover:text-white"
      }`}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
