<script>
    import { page } from '$app/stores';
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import { authService } from '$lib/services/auth';

    // Menu items for sidebar
    const menuItems = [
        { label: 'Hosts', path: '/hosts', icon: '🏠' },
        // { label: 'Users', path: '/users', icon: '👥' }
    ];

    function handleLogout() {
        authService.logout();
        goto(`${base}/auth/signin`);
    }
</script>

<div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>DCM</h2>
        </div>

        <nav class="sidebar-nav">
            {#each menuItems as item}
                <a 
                    href="{base}{item.path}" 
                    class="nav-item"
                    class:active={$page.url.pathname.includes(item.path)}
                >
                    <span class="icon">{item.icon}</span>
                    {item.label}
                </a>
            {/each}
        </nav>

        <div class="sidebar-footer">
            <button class="logout-btn" on:click={handleLogout}>
                Logout
            </button>
        </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
        <slot />
    </main>
</div>

<style>
    .layout {
        display: flex;
        min-height: 100vh;
    }

    .sidebar {
        width: 250px;
        background: #1a1a1a;
        color: white;
        display: flex;
        flex-direction: column;
        position: fixed;
        height: 100vh;
        left: 0;
        top: 0;
        margin: 0;
        padding: 0;
    }

    .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid #333;
    }

    .sidebar-header h2 {
        margin: 0;
        font-size: 1.5rem;
    }

    .sidebar-nav {
        flex: 1;
        padding: 1rem 0;
    }

    .nav-item {
        display: flex;
        align-items: center;
        padding: 0.75rem 1.5rem;
        color: #e5e5e5;
        text-decoration: none;
        transition: background-color 0.2s;
        gap: 0.75rem;
    }

    .nav-item:hover {
        background: #333;
    }

    .nav-item.active {
        background: #7c8baa;
        color: white;
    }

    .icon {
        font-size: 1.25rem;
    }

    .sidebar-footer {
        padding: 1rem 1.5rem;
        border-top: 1px solid #333;
    }

    .logout-btn {
        width: 100%;
        padding: 0.75rem;
        background: #3f2f2f;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        transition: background-color 0.2s;
    }

    .logout-btn:hover {
        background: #663838;
    }

    .main-content {
        flex: 1;
        margin-left: 250px;
        padding: 2rem;
        background: #f3f4f6;
    }
</style>