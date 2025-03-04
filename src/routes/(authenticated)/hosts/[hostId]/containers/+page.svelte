<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { toast } from 'svelte-french-toast';
    import LogViewer from '$lib/components/LogViewer.svelte';

    const hostId = $page.params.hostId;
    let containers = [];
    let selectedContainer = null;
    let loading = true;
    let error = null;

    async function loadContainers() {
        try {
            loading = true;
            const response = await fetch(`https://as2.ss.dev/api/dcm/containers?hostId=${hostId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load containers');
            }

            const data = await response.json();
            containers = data.list || []; // Access the 'list' property from the response
        } catch (err) {
            error = err.message;
            toast.error('Failed to load containers');
        } finally {
            loading = false;
        }
    }

    function selectContainer(container) {
        selectedContainer = container;
    }

    onMount(loadContainers);
</script>

<div class="containers-page">
    <header class="page-header">
        <div class="header-content">
            <div class="title-section">
                <button 
                    class="back-button"
                    on:click={() => goto(`${base}/hosts`)}
                >
                    ← Back to Hosts
                </button>
                <h1>Containers</h1>
            </div>
        </div>
    </header>

    <div class="content">
        <div class="split-view">
            <!-- Containers List -->
            <div class="containers-list">
                {#if loading}
                    <div class="loading-state">Loading containers...</div>
                {:else if error}
                    <div class="error-state">
                        {error}
                        <button on:click={loadContainers}>Retry</button>
                    </div>
                {:else if containers.length === 0}
                    <div class="empty-state">
                        <p>No containers found for this host</p>
                    </div>
                {:else}
                    <div class="containers-grid">
                        {#each containers as container}
                            <div 
                                class="container-card"
                                class:selected={selectedContainer?.id === container.id}
                                on:click={() => selectContainer(container)}
                            >
                                <div class="container-info">
                                    <h3>{container.name}</h3>
                                    <p class="container-id">{container.id.substring(0, 12)}...</p>
                                </div>
                            </div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Log Viewer -->
            <div class="log-viewer-section">
                {#if selectedContainer}
                    <LogViewer 
                        {hostId}
                        container={selectedContainer.name}
                    />
                {:else}
                    <div class="select-container">
                        <p>Select a container to view logs</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .containers-page {
        height: calc(100vh - 2rem);
        padding: 1rem;
        display: flex;
        flex-direction: column;
    }

    .page-header {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        margin-bottom: 1rem;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .title-section {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .back-button {
        background: #f3f4f6;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        color: #374151;
    }

    .back-button:hover {
        background: #e5e7eb;
    }

    h1 {
        margin: 0;
        font-size: 1.5rem;
    }

    .split-view {
        display: grid;
        grid-template-columns: 300px 1fr;
        gap: 1rem;
        height: 100%;
    }

    .containers-list {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow-y: auto;
    }

    .containers-grid {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .container-card {
        padding: 1rem;
        border-radius: 6px;
        background: #f9fafb;
        cursor: pointer;
        transition: all 0.2s;
    }

    .container-card:hover {
        background: #f3f4f6;
    }

    .container-card.selected {
        background: #e0e7ff;
        border-left: 4px solid #4f46e5;
    }

    .container-info h3 {
        margin: 0;
        font-size: 1rem;
        color: #1a1a1a;
    }

    .container-id {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: #6b7280;
        font-family: monospace;
    }

    .log-viewer-section {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        overflow: hidden;
    }

    .select-container {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7280;
    }

    .loading-state,
    .error-state,
    .empty-state {
        padding: 2rem;
        text-align: center;
        color: #6b7280;
    }

    .error-state {
        color: #dc2626;
    }

    .error-state button {
        margin-top: 1rem;
        background: #2563eb;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
    }
</style>