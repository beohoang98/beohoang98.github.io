<template>
    <div class="skill-page-content">
        <h1>Skills</h1>
        <div class="skill-page-list">
            <app-skill
                v-for="(skill, idx) in skills"
                :key="idx"
                :skill="skill"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import AppSkill from "@/components/Skill.vue";
    import { skills } from "@/data";

    export default {
        components: { AppSkill },
        data() {
            return {
                skills,
            };
        },
    };
</script>

<style lang="scss" scoped>
    .skill-page-content {
        text-align: center;
        overflow: visible;
    }
    .skill-page-list {
        display: flex;
        flex-flow: row wrap;
        justify-content: center;
        overflow: visible;
    }
</style>
