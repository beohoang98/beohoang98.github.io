<template>
    <nav class="app-nav">
        <ul class="app-nav-menu">
            <router-link
                :to="item.path"
                class="app-nav-menu-item"
                v-for="item in menu"
                active-class="active"
                :key="item.path"
            >
                <i :class="'fa fa-' + item.icon"></i>
                <strong class="app-nav-menu-item--title">{{
                    item.name
                }}</strong>
            </router-link>
        </ul>
    </nav>
</template>

<script setup lang="ts">
    // import aboutLogo from "@/assets/svg/002-about.svg";
    // import eduLogo from "@/assets/svg/004-mortarboard.svg";
    // import skillLogo from "@/assets/svg/003-selfconfident.svg";
    // import projectLogo from "@/assets/svg/001-brief.svg";
    // import puzzleLogo from "@/assets/svg/005-puzzle.svg";

    export interface IMenuItem {
        name: string;
        path: string;
        icon?: string;
    }

    const menu: IMenuItem[] = [
        {
            name: "About me",
            path: "/about",
            icon: "info-circle",
        },
        {
            name: "Education",
            path: "/education",
            icon: "book-open",
        },
        {
            name: "Skills",
            path: "/skills",
            icon: "lightbulb",
        },
        {
            name: "Projects",
            path: "/projects",
            icon: "tasks",
        },
        {
            name: "Other stuffs",
            path: "/other-stuffs",
            icon: "puzzle-piece",
        },
    ];
</script>

<style lang="scss">
    @import "src/assets/navigation";
</style>
