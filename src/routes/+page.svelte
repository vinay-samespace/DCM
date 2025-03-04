<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { browser } from '$app/environment';
    import { authService } from '$lib/services/auth';

    // On mount, redirect to appropriate page
    onMount(async () => {
        if (browser) {
            if (!authService.isAuthenticated()) {
                goto(`${base}/auth/signin`);
            } else {
                goto(`${base}/hosts`);
            }
        }
    });
</script>

<div class="loading">
    <div class="spinner"></div>
    <p>Loading DCM...</p>
</div>

<style>
    .loading {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #f3f4f6;
        gap: 1rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e5e7eb;
        border-top: 3px solid #2563eb;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    p {
        color: #6b7280;
        font-size: 1.125rem;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>