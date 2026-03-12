import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { BACKEND_BASE_URL, DEPARTMENT_OPTIONS } from "@/constants";
import { useTable } from "@refinedev/react-table";
import { Search } from "lucide-react";
import { ClassDetails, Subject } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { ColumnDef } from "@tanstack/react-table";
import { ShowButton } from "@/components/refine-ui/buttons/show";

const ListClasses = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedSubject, setSelectedSubject] = useState("all");
    const [subjects, setSubjects] = useState<{ name: string }[]>([]);

    const [selectedTeacher, setSelectedTeacher] = useState("all");
    const [teachers, setTeachers] = useState<{ name: string }[]>([]);

    const subjectFilter = selectedSubject === "all"
        ? []
        : [{ field: "subject", operator: "eq" as const, value: selectedSubject }];

    const searchFilter = searchQuery
        ? [{ field: "name", operator: "contains" as const, value: searchQuery }]
        : [];

    const teacherFilter = selectedTeacher === "all"
        ? []
        : [{ field: "teacher", operator: "eq" as const, value: selectedTeacher }];

    useEffect(() => {
        fetch(`${BACKEND_BASE_URL}subjects`)
            .then(res => res.json())
            .then(res => setSubjects(res.data || []))
            .catch(console.error);
    }, []);
    useEffect(() => {
        fetch(`${BACKEND_BASE_URL}users`)
            .then(res => res.json())
            .then(res => setTeachers(res.data || []))
            .catch(console.error);
    }, []);

    const classesTable = useTable<ClassDetails>({
        columns: useMemo<ColumnDef<ClassDetails>[]>(() => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title ml-2">Name</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
                filterFn: 'includesString'
            },
            {
                id: 'subject',
                accessorKey: 'subject.name',
                size: 200,
                header: () => <p className="column-title">Subject</p>,
                cell: ({ getValue }) => <Badge variant="default">{getValue<string>()}</Badge>,
            },
            {
                id: 'teacher',
                accessorKey: 'teacher.name',
                size: 150,
                header: () => <p className="column-title">Teacher</p>,
                cell: ({ getValue }) => <Badge variant="secondary">{getValue<string>()}</Badge>,
            },
            {
                id: 'status',
                accessorKey: 'status',
                size: 50,
                header: () => <p className="column-title">Status</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<string>()}</span>
            },
            {
                id: 'schedules',
                accessorKey: 'schedules',
                size: 100,
                header: () => <p className="column-title">Date</p>,
                cell: ({ getValue }) => {
                    const schedules: any = getValue() || [];
                    return <span className="truncate line-clamp-2">{schedules.length > 0 ? "Scheduled" : "Unscheduled"}</span>;
                }
            },
            {
                id: 'capacity',
                accessorKey: 'capacity',
                size: 50,
                header: () => <p className="column-title">Capacity</p>,
                cell: ({ getValue }) => <span className="truncate line-clamp-2">{getValue<number>()}</span>
            },
            {
                id: 'details',
                size: 70,
                header: () => <p className="column-title">Details</p>,
                cell: ({ row }) => <ShowButton resource="classes" recordItemId={row.original.id}
                    variant="outline" size="sm">View</ShowButton>
            }

        ], []),
        refineCoreProps: {
            resource: "classes",
            pagination: { pageSize: 10, mode: "server" },
            filters: {
                permanent: [...subjectFilter, ...searchFilter, ...teacherFilter]
            },
            sorters: {
                initial: [{ field: "id", order: "desc" }]
            }
        }
    });


    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Classes</h1>
            <div className="intro-row">
                <p>Quick access to essential metrics and managment tools.</p>

                <div className="actions-row">
                    <div className="search-field">
                        <Search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search classes..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                        <Select
                            value={selectedSubject}
                            onValueChange={setSelectedSubject}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by subject" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Subjects</SelectItem>
                                {subjects.map(subject => (
                                    <SelectItem key={subject.name} value={subject.name}>
                                        {subject.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedTeacher}
                            onValueChange={setSelectedTeacher}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by teacher" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">All Teachers</SelectItem>
                                {teachers.map(teacher => (
                                    <SelectItem key={teacher.name} value={teacher.name}>
                                        {teacher.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <CreateButton />
                    </div>
                </div>
            </div>
            <DataTable table={classesTable} />
        </ListView>
    );
}

export default ListClasses;