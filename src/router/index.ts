import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/app-home.vue";

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
            import(/* webpackChunkName: "about" */ "../views/app-about.vue"),
    },
    {
        path: "/education",
        name: "Education",
        component: () =>
            import(
                /* webpackChunkName: "education" */ "../views/app-education.vue"
            ),
    },
    {
        path: "/skills",
        name: "Skills",
        component: () =>
            import(
                /* webpackChunkName: "skill" */ "@/views/app-skill-page.vue"
            ),
    },
    {
        path: "/projects",
        name: "Projects",
        component: () =>
            import(/* webpackChunkName: "project" */ "@/views/app-project.vue"),
    },
    {
        path: "/other-stuffs",
        name: "Other Stuffs",
        component: import(
            /* webpackChunkName: "other-stuffs" */ "@/views/app-other.vue"
        ),
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
});

export default router;
