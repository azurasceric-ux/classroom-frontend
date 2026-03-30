import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";
import { Department } from "@/types";
import { useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { DeleteButton } from "@/components/refine-ui/buttons/delete";

const ListDepartments = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const searchFilter = searchQuery
        ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
        : [];

    const departmentTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: 'id',
                accessorKey: 'id',
                size: 80,
                header: () => <p className="column-title ml-2">ID</p>,
                cell: ({ getValue }) => <span className="ml-2 font-medium">{getValue<number>()}</span>
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 250,
                header: () => <p className="column-title">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 400,
                header: () => <p className="column-title">Description</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<string>()}</span>
            },
            {
                id: 'actions',
                size: 150,
                header: () => <p className="column-title">Actions</p>,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <EditButton resource="departments" recordItemId={row.original.id} variant="outline" size="sm">Edit</EditButton>
                        <DeleteButton resource="departments" recordItemId={row.original.id} size="sm">Delete</DeleteButton>
                    </div>
                )
            }
        ], []),
        refineCoreProps: {
            resource: "departments",
            pagination: { pageSize: 10, mode: "server" },
            filters: {
                permanent: [...searchFilter]
            },
            sorters: {
                initial: [{ field: "id", order: "desc" }]
            }
        }
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Departments</h1>
            <div className="intro-row">
                <p>Manage and organize academic departments.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search departments..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <CreateButton resource="departments" />
                    </div>
                </div>
            </div>
            <DataTable table={departmentTable} />
        </ListView>
    );
};

export default ListDepartments;
