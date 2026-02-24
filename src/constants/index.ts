export const DEPARTMENTS = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "English Literature",
    "History",
    "Political Science",
    "Psychology",
    "Economics"
];

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map(dept => ({ value: dept.toLowerCase().replace(/\s+/g, '-'), label: dept }));