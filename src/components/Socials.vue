<template>
    <ul class="app-social-links">
        <li>
            <a :href="socials.facebook" target="_blank" title="Facebook">
                <i class="fab fa-facebook"></i>
            </a>
        </li>
        <li>
            <a :href="socials.github" title="Github" target="_blank">
                <i class="fab fa-github"></i>
            </a>
        </li>
        <li>
            <a :href="socials.instagram" title="Instagram" target="_blank">
                <i class="fab fa-instagram"></i>
            </a>
        </li>
    </ul>
</template>

<script setup lang="ts">
    import { socials } from "@/data";
    export { socials };
</script>

<style lang="scss">
    @import "src/assets/socials";
</style>
