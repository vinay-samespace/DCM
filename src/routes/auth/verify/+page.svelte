<script>
    import { base } from '$app/paths';
    import { page } from '$app/stores';
    import { goto } from '$app/navigation';
    import { toast } from 'svelte-french-toast';
    import { authService } from '$lib/services/auth';
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import Form from '$lib/components/Form.svelte';

    let searchParams = $page.url.searchParams;
    let email = searchParams.get('email') || '';
    let mode = searchParams.get('mode') || 'signin';
    let code = '';
    let loading = false;
    let error = '';

    async function handleVerify() {
        if (!code) {
            error = 'Please enter verification code';
            return;
        }

        try {
            loading = true;
            const response = await authService.verify(email, code);
            
            if (response.token) {
                goto(`${base}/hosts`); // Redirect to hosts page after verification
            } else {
                throw new Error('Invalid verification response');
            }
        } catch (err) {
            error = err.message || 'Verification failed';
            toast.error(error);
        } finally {
            loading = false;
        }
    }

    async function handleResend() {
        try {
            if (mode === 'signin') {
                await authService.login(email);
            } else {
                await authService.signup(email);
            }
            toast.success('Verification code resent');
        } catch (err) {
            toast.error('Failed to resend code');
        }
    }
</script>

<div class="container">
    <div class="verify-card">
        <h1>Verify Email</h1>
        
        <div class="email-info">
            We've sent a verification code to:
            <strong>{email}</strong>
        </div>

        <Form onSubmit={handleVerify}>
            {#if error}
                <div class="error-message">{error}</div>
            {/if}

            <Input
                label="Verification Code"
                type="text"
                value={code}
                onInput={(e) => code = e.target.value}
                placeholder="Enter verification code"
                error={error}
                autofocus
            />

            <Button 
                type="submit"
                loading={loading}
                full
            >
                {loading ? 'Verifying...' : 'Verify'}
            </Button>

            <div class="actions">
                <button 
                    type="button" 
                    class="resend-link"
                    on:click={handleResend}
                >
                    Resend Code
                </button>

                <a 
                    href="{base}/auth/signin" 
                    class="back-link"
                >
                    ← Back to Sign In
                </a>
            </div>
        </Form>
    </div>
</div>

<style>
    .container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        padding: 20px;
    }

    .verify-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #1a1a1a;
    }

    .email-info {
        text-align: center;
        margin-bottom: 2rem;
        color: #6b7280;
    }

    .email-info strong {
        color: #1a1a1a;
        font-weight: 600;
    }

    .error-message {
        background: #fee2e2;
        color: #dc2626;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

    .actions {
        margin-top: 1.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .resend-link {
        background: none;
        border: none;
        color: #2563eb;
        font: inherit;
        cursor: pointer;
        padding: 0;
    }

    .resend-link:hover {
        text-decoration: underline;
    }

    .back-link {
        color: #6b7280;
        text-decoration: none;
    }

    .back-link:hover {
        text-decoration: underline;
    }
</style>