<script>
    import { onMount, onDestroy } from 'svelte';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import Button from '$lib/components/Button.svelte';

    const hostId = $page.params.hostId;
    const containerId = $page.params.containerId;
    const containerName = $page.url.searchParams.get('name');

    let websocket;
    let logs = [];
    let isConnected = false;
    let autoScroll = true;
    let logsContainer;

    function connectWebSocket() {
        const token = localStorage.getItem('token');
        const wsUrl = `wss://as2.ss.dev/api/dcm/docker/logs?hostId=${hostId}&container=${containerName}&token=${token}`;
        
        websocket = new WebSocket(wsUrl);

        websocket.onopen = () => {
            isConnected = true;
            console.log('WebSocket connected');
        };

        websocket.onmessage = (event) => {
            logs = [...logs, event.data];
            if (autoScroll && logsContainer) {
                logsContainer.scrollTop = logsContainer.scrollHeight;
            }
        };

        websocket.onclose = () => {
            isConnected = false;
            console.log('WebSocket disconnected');
        };

        websocket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    function disconnectWebSocket() {
        if (websocket) {
            websocket.close();
            isConnected = false;
        }
    }

    function clearLogs() {
        logs = [];
    }

    onMount(() => {
        connectWebSocket();
    });

    onDestroy(() => {
        disconnectWebSocket();
    });
</script>

<div class="logs-page">
    <header class="page-header">
        <div class="header-content">
            <div class="title-section">
                <Button 
                    variant="secondary" 
                    on:click={() => goto(`${base}/hosts/${hostId}/containers`)}
                >
                    ← Back
                </Button>
                <h1>
                    Logs
                    <span class="container-name">({containerName})</span>
                </h1>
            </div>
            <div class="actions">
                <label class="auto-scroll-label">
                    <input 
                        type="checkbox" 
                        bind:checked={autoScroll}
                    >
                    Auto-scroll
                </label>
                <Button 
                    variant="secondary"
                    on:click={clearLogs}
                >
                    Clear
                </Button>
                <Button 
                    variant={isConnected ? 'danger' : 'primary'}
                    on:click={() => isConnected ? disconnectWebSocket() : connectWebSocket()}
                >
                    {isConnected ? 'Disconnect' : 'Connect'}
                </Button>
            </div>
        </div>
    </header>

    <div 
        class="logs-container" 
        bind:this={logsContainer}
    >
        {#each logs as log}
            <div class="log-entry">
                <pre>{log}</pre>
            </div>
        {/each}
    </div>
</div>

<style>
    .logs-page {
        height: calc(100vh - 4rem);
        display: flex;
        flex-direction: column;
        padding: 1rem;
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

    .actions {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .auto-scroll-label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }

    h1 {
        margin: 0;
        font-size: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .container-name {
        color: #6b7280;
        font-size: 1rem;
    }

    .logs-container {
        flex: 1;
        background: #1a1a1a;
        border-radius: 8px;
        padding: 1rem;
        overflow-y: auto;
        font-family: monospace;
        font-size: 12px;
        line-height: 1.5;
        color: #ffffff;
    }

    .log-entry {
        margin: 0;
        padding: 2px 0;
    }

    .log-entry pre {
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
    }

    /* Scrollbar styling */
    .logs-container::-webkit-scrollbar {
        width: 8px;
    }

    .logs-container::-webkit-scrollbar-track {
        background: #2e2e2e;
    }

    .logs-container::-webkit-scrollbar-thumb {
        background: #666;
        border-radius: 4px;
    }

    .logs-container::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>