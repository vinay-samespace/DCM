<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { toast } from 'svelte-french-toast';
    import { hostService } from '$lib/services/hosts';

    let hosts = [];
    let loading = true;
    let error = null;

    async function loadHosts() {
        try {
            loading = true;
            const response = await fetch('https://as2.ss.dev/api/dcm/hosts/all', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) throw new Error('Failed to load hosts');
            const data = await response.json();
            hosts = Array.isArray(data) ? data : [data];
        } catch (err) {
            error = err.message;
            toast.error('Failed to load hosts');
        } finally {
            loading = false;
        }
    }

    function viewContainers(hostId) {
        goto(`${base}/hosts/${hostId}/containers`);
    }

    onMount(loadHosts);
</script>

<div class="page">
    <div class="header">
        <h1>Hosts</h1>
        <button class="add-host" on:click={() => goto(`${base}/hosts/create`)}>
            Add Host
        </button>
    </div>

    <div class="content">
        {#if loading}
            <div class="loading">Loading hosts...</div>
        {:else if error}
            <div class="error">
                {error}
                <button on:click={loadHosts}>Retry</button>
            </div>
        {:else if hosts.length === 0}
            <div class="empty">
                <p>No hosts found</p>
                <button on:click={() => goto(`${base}/hosts/create`)}>
                    Add Your First Host
                </button>
            </div>
        {:else}
            <div class="hosts-grid">
                {#each hosts as host}
                    <div class="host-card" on:click={() => viewContainers(host.id)}>
                        <div class="host-header">
                            <h2>{host.hostname}</h2>
                            <span class="env">{host.env}</span>
                        </div>
                        
                        <div class="host-details">
                            <div class="detail-item">
                                <span class="label">IP:</span>
                                <span>{host.ip}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Port:</span>
                                <span>{host.port}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Region:</span>
                                <span>{host.region}</span>
                            </div>
                        </div>

                        <div class="host-actions">
                            <button class="action-button">
                                View Containers
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .page {
        padding: 2rem;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
    }

    h1 {
        font-size: 2rem;
        color: #1a1a1a;
        margin: 0;
    }

    .add-host {
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .add-host:hover {
        background: #1d4ed8;
    }

    .hosts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .host-card {
        background: white;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
        cursor: pointer;
    }

    .host-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .host-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .host-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: #1a1a1a;
    }

    .env {
        background: #e0e7ff;
        color: #4f46e5;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .host-details {
        display: grid;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
    }

    .detail-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .label {
        color: #6b7280;
        font-size: 0.875rem;
    }

    .host-actions {
        border-top: 1px solid #e5e7eb;
        padding-top: 1rem;
        text-align: right;
    }

    .action-button {
        background: #f3f4f6;
        color: #374151;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .action-button:hover {
        background: #e5e7eb;
    }

    .loading, .error, .empty {
        text-align: center;
        padding: 3rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .error {
        color: #dc2626;
    }

    .empty {
        color: #6b7280;
    }

    .empty button, .error button {
        margin-top: 1rem;
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 6px;
        cursor: pointer;
    }
</style>