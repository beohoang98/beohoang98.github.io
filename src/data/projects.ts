export type IProject =
    | {
          type: "custom";
          name: string;
          description: string;
          url?: undefined;
      }
    | {
          type: "github";
          url: string;
          name?: string;
          description?: string;
      };

export type IProjectDetail = IProject & {
    teamSize?: number;
    knowledge?: string[];
    languages?: string[];
    role?: string;
    time?: string;
    kind: "personal" | "real-world" | "school";
};

export const projects: Array<IProjectDetail> = [
    {
        type: "github",
        url: "https://github.com/beohoang98/tree-visualizer",
        teamSize: 1,
        time: "Jan 2021",
        kind: "personal",
        name: "Tree Visualizer",
        description: "Visualize tree data structure like Binary Tree, etc",
        languages: ["Vue", "Javascript"],
        knowledge: ["Data structure", "Tree", "SVG"],
    },
    {
        type: "github",
        url: "https://github.com/beohoang98/typing-survival",
        teamSize: 2,
        role: "Programmer",
        name: "Hero of Words (Game)",
        languages: ["C#", "Unity"],
        description: "School's project about Game Making with Unity",
        knowledge: [
            "CSharp of course",
            "Basics about Unity",
            "Some knowledge about graphic stuff like shader or post-processing",
        ],
        time: "Sep 2020 - Dec 2020",
        kind: "school",
    },
    {
        type: "github",
        teamSize: 2,
        languages: ["Node.js", "Typescript", "Vue"],
        url: "https://github.com/beohoang98/internet-banking",
        role: "Fullstack",
        name: "Internet Banking",
        description:
            "School's project in Web Development course. To create an internet banking system which has backend and frontend in SPA",
        knowledge: [
            "Node.js and Typescript, framework is Nest.js (not Next.js)",
            "Basic encryption in banking like PGP and SHA512 to safety communication with other bank system",
            "Vue.js for making Single Page Application",
        ],
        time: "Jan 2020 - May 2020",
        kind: "school",
    },
    {
        type: "custom",
        name: "Cloudjet Potential (shutdown)",
        description:
            "An Application Tracking System developed with serverless solutions (Firebase, Netlify). " +
            "The project was shutdown in March 2020 but it's the first real project that I had participated",
        role: "Junior Frontend Developer",
        teamSize: 8,
        languages: ["Vue.js", "Node.js", "Typescript"],
        knowledge: [
            "First time dealing with tons of complex things in real frontend application",
            "Experienced with problems about teamwork and communication that is as important as coding",
            "Experienced with a workflow in real project, like pull-request, testing phase, named version, deployment and distribution",
            "Basics about Cloud platform as Google Cloud",
            "Dealing with tons of pros/cons of Firebase, NoSQL. " +
                "That are very ease and quick to use but they will be more complex with higher requirements",
            "Disadvantages in SEO and performance with SPA, which are trade-off to archive fast and reusable coding",
        ],
        time: "March 2019 - Dec 2019",
        kind: "real-world",
    },
    {
        type: "github",
        url: "https://github.com/beohoang98/ISE_NMH_16",
        name: "Smart Money",
        description:
            "Android app for wallet management, final project in university for Software Technology subject",
        teamSize: 4,
        role: "Team Leader, also as coder",
        knowledge: [
            "Basic about Android",
            "Basic about workflow for a software project",
            "Basic about what we need to archive during development of a software project",
        ],
        time: "Oct 2018 - Jan 2019",
        kind: "school",
        languages: ["Android", "Java"],
    },
];
