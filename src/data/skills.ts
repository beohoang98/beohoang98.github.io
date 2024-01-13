export interface ISkill {
    name: string;
    value?: number | string;
    unit?: "years" | "projects";
    note?: string;
    skills?: ISkill[];
    faIcon?: string;
}

export const skills: ISkill[] = [
    {
        name: "Programming",
        value: 5,
        unit: "years",
        note: "In university and work",
        faIcon: "fa fa-code",
        skills: [
            {
                name: "C / C++",
                value: 2,
                unit: "years",
                note: "In university",
            },
            {
                name: "Front-end Web Development",
                value: 4,
                unit: "years",
                faIcon: "fa fa-desktop",
                skills: [
                    {
                        name: "React.js",
                        value: 4,
                        unit: "projects",
                        note: "In university and works",
                        faIcon: "fab fa-react",
                    },
                    {
                        name: "Vue.js",
                        value: 2,
                        unit: "projects",
                        note: "In works, with knowledge in Vue 2 & 3",
                        faIcon: "fab fa-vuejs",
                    },
                ],
            },
            {
                name: "Back-end Web Development",
                value: 4,
                unit: "years",
                note: "In University",
                faIcon: "fa fa-server",
                skills: [
                    {
                        name: "Databases",
                        value: 2,
                        note: "In University, with basic knowledge.\nInclude MySQL, MSSQL, MongoDB",
                        unit: "years",
                        faIcon: "fa fa-database",
                    },
                    {
                        name: "Node.js",
                        value: 4,
                        unit: "years",
                        note: "In University, work's projects",
                        faIcon: "fab fa-node",
                    },
                ],
            },
        ],
    },
    {
        name: "English",
        note: "Good at Reading.\nStill be improving on Listening and Verbal communications.",
        value: "",
        faIcon: "fa fa-globe-asia",
    },
];
