<script>
    export let type = 'button';
    export let loading = false;
    export let disabled = false;
    export let full = false;
    export let variant = 'primary';
</script>

<button
    {type}
    class:full
    class:loading
    class={variant}
    disabled={disabled || loading}
    on:click
>
    <slot />
</button>

<style>
    button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .full {
        width: 100%;
    }

    .primary {
        background: #2563eb;
        color: white;
    }

    .primary:hover:not(:disabled) {
        background: #1d4ed8;
    }

    button:disabled {
        background: #93c5fd;
        cursor: not-allowed;
    }

    .loading {
        position: relative;
        color: transparent;
    }

    .loading::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 1rem;
        height: 1rem;
        border: 2px solid white;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>