<template>
    <div
        class="skill"
        @animationend="animationEnd"
        @animationcancel="animationEnd"
        @animationstart="animationStart"
    >
        <svg class="skill-bg" viewBox="0 0 100 100">
            <path :d="randomGlob"></path>
        </svg>
        <div class="skill-content">
            <div class="skill-icon" v-if="skill.faIcon">
                <i :class="skill.faIcon || 'fa fa-circle'"></i>
            </div>
            <h2 :class="titleClass" @click="handleClick">{{ skill.name }}</h2>
            <div v-if="skill.value" class="skill-exp">
                <span class="skill-exp-value">{{ skill.value }}</span>
                <span class="skill-exp-unit">{{ skill.unit }}</span>
            </div>
            <p class="skill-note">{{ skill.note }}</p>
        </div>
        <div :class="detailsClass" v-if="skill.skills && skill.skills.length">
            <div
                class="skill-details-backdrop"
                @click="showDetails = false"
            ></div>
            <app-skill
                v-show="showDetails"
                :skill="childSkill"
                v-for="(childSkill, idx) in skill.skills"
                :key="idx"
            />
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import { ISkill } from "@/data";

    export default defineComponent({
        name: "app-skill",
        data() {
            return {
                showDetails: false,
                randomGlob: "",
                interval: -1,
                canClick: true,
            };
        },
        props: {
            skill: { type: Object as PropType<ISkill>, required: true },
        },
        computed: {
            detailsClass() {
                return {
                    "skill-details": true,
                    show: this.showDetails,
                };
            },
            titleClass() {
                return {
                    "skill-title": true,
                    clickable: this.skill.skills && this.skill.skills.length,
                };
            },
        },
        methods: {
            handleClick() {
                if (this.canClick) this.showDetails = true;
            },
            handleKeydown(ev: KeyboardEvent) {
                ev.stopPropagation();
                if (ev.key === "Escape") {
                    this.showDetails = false;
                }
            },
            makeRandomGlob() {
                let path = "";
                let lastX = [50, 50];
                let lastY = [50, 50];
                let count = 0;
                for (let rad = 0; rad <= Math.PI * 2; rad += Math.PI / 16) {
                    const r = Math.random() * 10 - 5 + 45;
                    const x = Math.cos(rad) * r + 50;
                    const y = Math.sin(rad) * r + 50;
                    if (count == 0) {
                        path = `M${x} ${y}`;
                    } else if (count % 3 == 2) {
                        path += `S ${lastX[1]} ${lastY[1]} ${x} ${y}`;
                    }
                    ++count;
                    lastX[0] = lastX[1];
                    lastX[1] = x;
                    lastY[0] = lastY[1];
                    lastY[1] = y;
                }
                path += "Z";
                return path;
            },
            animationStart() {
                this.canClick = false;
            },
            animationEnd(ev: AnimationEvent) {
                console.debug(ev.type);
                this.canClick = true;
            },
        },
        watch: {
            showDetails(value) {
                if (value) {
                    history.pushState(null, this.skill.name);
                    document.addEventListener("keydown", this.handleKeydown);
                } else {
                    history.back();
                    document.removeEventListener("keydown", this.handleKeydown);
                }
            },
        },
        mounted() {
            this.randomGlob = this.makeRandomGlob();
            this.interval = setInterval(() => {
                this.randomGlob = this.makeRandomGlob();
            }, 1000);
        },
        beforeUnmount() {
            clearInterval(this.interval);
            document.removeEventListener("keydown", this.handleKeydown);
        },
    });
</script>

<style lang="scss">
    @import "src/assets/skill";
</style>
