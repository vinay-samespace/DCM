<script>
    import { onMount, onDestroy } from 'svelte';
    import { socketService } from '$lib/services/socket';
    import Button from './Button.svelte';

    export let hostId;
    export let container;

    let logs = [];
    let isConnected = false;
    let autoScroll = true;
    let logsContainer;
    let unsubscribeLogs;
    let unsubscribeConnection;
    let logFilterText = '';
    let showTimestamps = true;
    let showLineNumbers = true;
    let showSearchInput = false;

    function scrollToBottom() {
        if (autoScroll && logsContainer) {
            logsContainer.scrollTop = logsContainer.scrollHeight;
        }
    }

    function handleLog(logContent) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            content: logContent,
            index: logs.length + 1,
            visible: true
        };
        logs = [...logs, logEntry];
        scrollToBottom();
    }

    function handleConnection(data) {
        isConnected = data.status === 'connected';
    }

    function clearLogs() {
        logs = [];
    }

    function toggleConnection() {
        if (isConnected) {
            socketService.disconnect();
        } else {
            socketService.connect(hostId, container);
        }
    }

    function filterLogs() {
        if (!logFilterText) {
            logs = logs.map(log => ({...log, visible: true}));
        } else {
            logs = logs.map(log => ({
                ...log, 
                visible: log.content.toLowerCase().includes(logFilterText.toLowerCase())
            }));
        }
    }

    function toggleSearch() {
        showSearchInput = !showSearchInput;
        if (!showSearchInput && logFilterText) {
            logFilterText = '';
            filterLogs();
        }
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            showSearchInput = false;
            logFilterText = '';
            filterLogs();
        } else if (event.key === 'Enter') {
            filterLogs();
        }
    }

    function exportLogs() {
        const logText = logs.map(log => {
            const timestamp = showTimestamps ? `[${log.timestamp}] ` : '';
            const lineNum = showLineNumbers ? `${log.index}. ` : '';
            return `${lineNum}${timestamp}${log.content}`;
        }).join('\n');
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `logs-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    onMount(() => {
        // Subscribe to logs and connection status
        unsubscribeLogs = socketService.subscribe('logs', handleLog);
        unsubscribeConnection = socketService.subscribe('connection', handleConnection);
        
        // Initial connection
        socketService.connect(hostId, container);
    });

    onDestroy(() => {
        // Cleanup subscriptions and connection
        if (unsubscribeLogs) unsubscribeLogs();
        if (unsubscribeConnection) unsubscribeConnection();
        socketService.disconnect();
    });

    $: {
        if (logFilterText !== undefined) {
            filterLogs();
        }
    }
</script>

<div class="log-viewer">
    <div class="toolbar">
        <div class="toolbar-section">
            <Button 
                variant={isConnected ? 'danger' : 'primary'}
                on:click={toggleConnection}
                class="connection-btn"
            >
                {isConnected ? 'Disconnect' : 'Connect'}
            </Button>

            <div class="status-indicator" class:connected={isConnected}>
                {isConnected ? 'Connected' : 'Disconnected'}
            </div>
        </div>

        <div class="toolbar-section">
            <div class="search-container">
                <Button 
                    variant="secondary"
                    on:click={toggleSearch}
                    class="icon-btn"
                    title="Search logs"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </Button>
                
                {#if showSearchInput}
                    <div class="search-input-container">
                        <input 
                            type="text" 
                            placeholder="Search logs..." 
                            bind:value={logFilterText}
                            class="search-input"
                            on:keydown={handleKeydown}
                            autofocus
                        />
                        {#if logFilterText}
                            <button class="clear-search" on:click={() => { logFilterText = ''; filterLogs(); }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        {/if}
                    </div>
                {/if}
            </div>
            
            <div class="dropdown">
                <Button variant="secondary" class="icon-btn" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                </Button>
                <div class="dropdown-content">
                    <label class="dropdown-option">
                        <input type="checkbox" bind:checked={showTimestamps}>
                        Show timestamps
                    </label>
                    <label class="dropdown-option">
                        <input type="checkbox" bind:checked={showLineNumbers}>
                        Show line numbers
                    </label>
                    <label class="dropdown-option">
                        <input type="checkbox" bind:checked={autoScroll}>
                        Auto-scroll
                    </label>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-button" on:click={clearLogs}>Clear logs</button>
                    <button class="dropdown-button" on:click={exportLogs} disabled={logs.length === 0}>Export logs</button>
                </div>
            </div>
        </div>
    </div>

    <div class="logs-container" bind:this={logsContainer}>
        {#each logs as log}
            {#if log.visible}
                <div class="log-entry">
                    <span class="log-line-number" class:hidden={!showLineNumbers}>
                        {log.index}.
                    </span>
                    <span class="log-timestamp" class:hidden={!showTimestamps}>
                        [{log.timestamp}]
                    </span>
                    <pre class="log-content">{log.content}</pre>
                </div>
            {/if}
        {/each}
        
        {#if logs.length === 0 || !logs.some(log => log.visible)}
            <div class="empty-logs">
                {#if logs.length === 0}
                    No logs available{#if !isConnected}. Click Connect to start receiving logs.{/if}
                {:else}
                    No logs match your search criteria.
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    .log-viewer {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        overflow: hidden;
    }

    .toolbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
    }

    .toolbar-section {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .icon-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.25rem;
        height: 2.25rem;
        padding: 0;
        border-radius: 4px;
    }

    .status-indicator {
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        background: #fee2e2;
        color: #dc2626;
        font-size: 0.75rem;
        font-weight: 500;
    }

    .status-indicator.connected {
        background: #dcfce7;
        color: #059669;
    }

    .search-container {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .search-input-container {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-input {
        padding: 0.5rem 2rem 0.5rem 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        font-size: 0.875rem;
        min-width: 220px;
        transition: all 0.2s;
    }

    .search-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        outline: none;
    }

    .clear-search {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: #6b7280;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0.25rem;
    }

    .clear-search:hover {
        color: #374151;
    }

    .dropdown {
        position: relative;
        display: inline-block;
    }

    .dropdown-content {
        display: none;
        position: absolute;
        right: 0;
        background-color: white;
        min-width: 200px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        padding: 0.5rem 0;
        z-index: 10;
    }

    .dropdown:hover .dropdown-content {
        display: block;
    }

    .dropdown-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .dropdown-option:hover {
        background-color: #f3f4f6;
    }

    .dropdown-divider {
        margin: 0.5rem 0;
        border-top: 1px solid #e5e7eb;
    }

    .dropdown-button {
        display: block;
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .dropdown-button:hover {
        background-color: #f3f4f6;
    }

    .dropdown-button:disabled {
        color: #9ca3af;
        cursor: not-allowed;
    }

    .logs-container {
        flex: 1;
        overflow-y: auto;
        padding: 0.5rem;
        background: #1a1a1a;
        font-family: 'Fira Code', 'Roboto Mono', monospace;
        font-size: 12px;
        line-height: 1.5;
    }

    .log-entry {
        display: flex;
        align-items: flex-start;
        margin: 0;
        padding: 2px 0;
        border-bottom: 1px solid #333;
    }

    .log-line-number {
        min-width: 3rem;
        color: #888;
        padding-right: 0.5rem;
        text-align: right;
        user-select: none;
    }

    .log-timestamp {
        color: #6b9eef;
        padding-right: 0.5rem;
        white-space: nowrap;
    }

    .log-content {
        flex: 1;
        margin: 0;
        white-space: pre-wrap;
        word-wrap: break-word;
        color: #ffffff;
    }

    .hidden {
        display: none;
    }

    .empty-logs {
        color: #6b7280;
        text-align: center;
        padding: 2rem;
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

    /* Responsive adjustments */
    @media (max-width: 768px) {
        .toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
        }

        .toolbar-section {
            justify-content: space-between;
        }

        .search-input {
            min-width: unset;
            width: 100%;
        }
    }
</style>