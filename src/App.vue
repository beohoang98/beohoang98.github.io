<template>
    <div :class="'app page-' + pathName">
        <Navigation />
        <div class="app-body">
            <div class="app-header">
                <router-link to="/">
                    <img
                        :src="socials.github + '.png?size=320'"
                        alt=""
                        width="320"
                    />
                </router-link>
                <Socials />
            </div>

            <transition name="fade">
                <router-view class="app-content" />
            </transition>
        </div>
    </div>
</template>
<script lang="ts">
    import { useRoute } from "vue-router";
    import { computed } from "vue";
    import Navigation from "@/components/AppNavigation.vue";
    import Socials from "@/components/AppSocials.vue";
    import { profile, socials } from "@/data";

    export default {
        components: { Socials, Navigation },
        setup() {
            const route = useRoute();
            const pathName = computed(() =>
                route.path.replace(/[\\/]/gi, "").toLowerCase()
            );

            return { pathName, profile, socials };
        },
    };
</script>

<style lang="scss">
    @import "assets/common.scss";
</style>
