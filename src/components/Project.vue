<template>
    <article class="project-item" ref="element">
        <section class="project-time">
            <svg
                data-role="line"
                fill="none"
                viewBox="0 0 100 200"
                preserveAspectRatio="none"
            >
                <path :d="pathLine" />
            </svg>
            <svg data-role="point" viewBox="0 0 100 100">
                <circle r="5" cx="50" cy="50" />
            </svg>
            <time :datetime="project.time">{{ project.time }}</time>
        </section>
        <section class="project-info">
            <a v-if="!!project.url" :href="project.url" target="_blank"
                ><h2>{{ project.name }}</h2></a
            >
            <h2 v-else>{{ project.name }}</h2>

            <p :class="'project-kind ' + project.kind">{{ project.kind }}</p>
            <section class="project-description" title="Description">
                <h3>Description</h3>
                <p>{{ project.description }}</p>
            </section>
            <section class="project-lang" title="Languages, Stacks">
                <ul>
                    <li
                        class="project-lang-item"
                        v-for="lang in project.languages"
                        :key="lang"
                    >
                        {{ lang }}
                    </li>
                </ul>
            </section>
            <section class="project-team">
                <h3>Team</h3>
                <p><strong>Size:</strong>&nbsp;{{ project.teamSize }}</p>
                <p><strong>Role:</strong>&nbsp;{{ project.role }}</p>
            </section>
            <section class="project-knowledge">
                <h3>Experience</h3>
                <ul>
                    <li v-for="(exp, idx) in project.knowledge" :key="idx">
                        {{ exp }}
                    </li>
                </ul>
            </section>
        </section>
    </article>
</template>

<script lang="ts">
    import { defineComponent, PropType } from "vue";
    import { IProjectDetail } from "@/data";

    export default defineComponent({
        props: {
            project: {
                type: Object as PropType<IProjectDetail>,
                required: true,
            },
            isFirst: Boolean,
            isLast: Boolean,
        },
        computed: {
            pathLine() {
                if (this.isFirst) return "M50,100 L50,200";
                if (this.isLast) return "M50,0 L50,100";
                return "M50,0 L50,200";
            },
        },
        methods: {
            checkVisible() {
                const element = this.$refs.element as HTMLElement;
                const { y, height } = element.getBoundingClientRect();
                const {
                    height: bodyHeight,
                } = document.body.getBoundingClientRect();
                if (y > (bodyHeight * 2) / 3 || y + height < bodyHeight / 3) {
                    element.classList.remove("visible");
                } else {
                    element.classList.add("visible");
                }
                // console.debug(`[${this.project.name}] ${y} ${height}`);
            },
            watchVisibility(ev: Event) {
                setTimeout(this.checkVisible, 200);
            },
        },
        mounted() {
            this.checkVisible();
            document
                .querySelector(".app-content")
                ?.addEventListener("scroll", this.watchVisibility);
        },
        unmounted() {
            document
                .querySelector(".app-content")
                ?.removeEventListener("scroll", this.watchVisibility);
        },
    });
</script>

<style lang="scss" scoped></style>
