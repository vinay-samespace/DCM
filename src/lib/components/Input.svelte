<script>
    export let label = '';
    export let type = 'text';
    export let value = '';
    export let placeholder = '';
    export let disabled = false;
    export let error = '';
    export let onInput = () => {};

    const inputId = `input-${Math.random().toString(36).slice(2)}`;
</script>

<div class="input-wrapper">
    {#if label}
        <label for={inputId}>{label}</label>
    {/if}
    <input
        {type}
        {placeholder}
        {disabled}
        id={inputId}
        {value}
        on:input={onInput}
        class:error={!!error}
    />
    {#if error}
        <span class="error-message">{error}</span>
    {/if}
</div>

<style>
    .input-wrapper {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        color: #4b5563;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 1rem;
    }

    input:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }

    input.error {
        border-color: #dc2626;
    }

    .error-message {
        color: #dc2626;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
</style>