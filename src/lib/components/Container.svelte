<script lang="ts">
    export let maxWidth: string = '1200px';
</script>

<div class="container" style="max-width: {maxWidth}">
    <slot />
</div>

<style>
    .container {
        width: 100%;
        margin: 0 auto;
        padding: 0 16px;
    }
</style>