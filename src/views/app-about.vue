<template>
    <div class="about">
        <h1>
            I'm just an ordinal programmer<br />and I don't have anything to say
            yet.
        </h1>
        <p>
            <strong>Full name: </strong>
            <span property="lastname">Hoang</span
            >&nbsp;<span>Dan</span>&nbsp;<span property="firstname">An</span>
        </p>
        <p>
            <strong>Age: </strong>
            <span property="age">{{ age() }}</span>
        </p>
    </div>
</template>

<script lang="ts" setup>
    const age = (): number => {
        return new Date().getFullYear() - 1998;
    };
</script>

<style scoped>
    h1 {
        text-shadow: 0 5px 8px #0003;
        padding: 1em 0;
    }
    .about {
        padding: 1em;
    }
</style>
