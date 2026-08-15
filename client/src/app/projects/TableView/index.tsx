import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 150,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => (
      <span className="inline-flex rounded-sm border border-white/20 bg-white/5 px-2.5 py-0.5 text-xs font-semibold text-white/80 font-mono">
        {params.value}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 100,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.username || "Unassigned",
  },
];

const TableView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-8 font-semibold text-[#FBBF24]">LOADING PROJECT TASK DATABASE...</div>;
  if (error || !tasks) return <div className="p-8 font-semibold text-red-500">An error occurred while fetching tasks</div>;

  return (
    <div className="w-full px-4 pb-8 xl:px-6">
      <div className="pt-5 pb-4">
        <Header
          name="Task Database Table"
          buttonComponent={
            <button
              className="flex items-center rounded-md bg-[#FBBF24] px-4 py-2 text-xs font-bold text-black hover:bg-[#F59E0B] transition-colors"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="rounded-lg border border-white/12 bg-[#18181B]/75 p-4 backdrop-blur-md shadow-lg">
        <div style={{ height: 500, width: "100%" }}>
          <DataGrid
            rows={tasks || []}
            columns={columns}
            className={dataGridClassNames}
            sx={dataGridSxStyles(true)}
          />
        </div>
      </div>
    </div>
  );
};

export default TableView;
