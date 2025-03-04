<script>
    import { onMount } from 'svelte';
    import { userApi } from '$lib/services/api';
    import LogViewer from '$lib/components/LogViewer.svelte';

    let users = [];
    let loading = false;
    let error = null;

    async function loadUsers() {
        try {
            loading = true;
            users = await userApi.getAll();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    }

    onMount(loadUsers);
</script>

<div class="container">
    <h1>Users</h1>
    
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <table>
            <!-- User list -->
        </table>
    {/if}

    <div class="logs-section">
        <h2>System Logs</h2>
        <LogViewer />
    </div>
</div>