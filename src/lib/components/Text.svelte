<script lang="ts">
    export let tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' = 'p';
    export let size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
    export let weight: 'normal' | 'medium' | 'bold' = 'normal';
    export let color: string = 'inherit';
</script>

<svelte:element 
    this={tag} 
    class="text {size} {weight}"
    style="color: {color}"
>
    <slot />
</svelte:element>

<style>
    .text {
        margin: 0;
    }

    .xs { font-size: 12px; }
    .sm { font-size: 14px; }
    .md { font-size: 16px; }
    .lg { font-size: 18px; }
    .xl { font-size: 20px; }


    .normal { font-weight: 400; }
    .medium { font-weight: 500; }
    .bold { font-weight: 700; }
</style>