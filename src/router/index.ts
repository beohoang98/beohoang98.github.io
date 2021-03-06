import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/Home.vue";

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/about",
        name: "About",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import(/* webpackChunkName: "about" */ "../views/About.vue"),
    },
    {
        path: "/education",
        name: "Education",
        component: () =>
            import(
                /* webpackChunkName: "education" */ "../views/Education.vue"
            ),
    },
    {
        path: "/skills",
        name: "Skills",
        component: () =>
            import(/* webpackChunkName: "skill" */ "@/views/SkillPage.vue"),
    },
    {
        path: "/projects",
        name: "Projects",
        component: () =>
            import(/* webpackChunkName: "project" */ "@/views/Project.vue"),
    },
    {
        path: "/other-stuffs",
        name: "Other Stuffs",
        component: import(
            /* webpackChunkName: "other-stuffs" */ "@/views/Other.vue"
        ),
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});

export default router;
