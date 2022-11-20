<template>
    <div class="app-projects-content">
        <Project
            v-for="(project, idx) in projects"
            :key="idx"
            :project="project"
            :isFirst="idx === 0"
            :isLast="idx === projects.length - 1"
        />
    </div>
</template>

<script lang="ts" setup>
    import Project from "@/components/AppProject.vue";
    import { projects } from "@/data";
</script>

<style lang="scss">
    @import "src/assets/projects";
</style>
