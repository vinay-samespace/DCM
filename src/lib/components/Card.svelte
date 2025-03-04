<script lang="ts">
    export let padding: string = '20px';
</script>

<div class="card" style="padding: {padding}">
    <slot />
</div>

<style>
    .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        border: 1px solid #E5E7EB;
    }
</style>