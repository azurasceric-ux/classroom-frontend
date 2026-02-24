import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";

export type Subject = BaseRecord & {
    code: string;
    name: string;
    department: string;
    description: string;
    createdAt: string;
};

export const mockSubjects: Subject[] = [
    {
        id: "subj-101",
        code: "MATH101",
        name: "Calculus I",
        department: "Math",
        description: "Introduction to limits, derivatives, and integrals of single-variable functions.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "subj-102",
        code: "CS102",
        name: "Introduction to Programming",
        department: "Computer Science",
        description: "Fundamentals of programming using Python: variables, control flow, functions, and basic data structures.",
        createdAt: new Date().toISOString(),
    },
    {
        id: "subj-103",
        code: "HIST210",
        name: "World History",
        department: "History",
        description: "Survey of major world civilizations and historical themes from antiquity to the modern era.",
        createdAt: new Date().toISOString(),
    },
];

export const dataProvider: DataProvider = {
    getList: async <TData extends BaseRecord = BaseRecord>({ resource }: GetListParams): Promise<GetListResponse<TData>> => {
        if (resource !== "subjects") return { data: [] as TData[], total: 0 };

        return {
            data: mockSubjects as unknown as TData[],
            total: mockSubjects.length,
        };
    },
    getOne: async () => {
        throw new Error("Method not implemented.");
    },
    create: async () => {
        throw new Error("Method not implemented.");
    },
    update: async () => {
        throw new Error("Method not implemented.");
    },
    deleteOne: async () => {
        throw new Error("Method not implemented.");
    },

    getApiUrl: () => "",
};
