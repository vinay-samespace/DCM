<script>
    import { base } from '$app/paths';
    import { goto } from '$app/navigation';
    import { authService } from '$lib/services/auth';
    import { validators } from '$lib/utils/validators';
    import Input from '$lib/components/Input.svelte';
    import Button from '$lib/components/Button.svelte';
    import Form from '$lib/components/Form.svelte';
    
    let email = '';
    let loading = false;
    let error = '';

    async function handleSignIn() {
        if (!validators.isValidEmail(email)) {
            error = 'Please enter a valid email';
            return;
        }

        loading = true;
        try {
            const response = await authService.login(email);
            
            if (response.token) {
                goto(`${base}/`);
            } else {
                // If verification needed
                goto(`${base}/auth/verify?email=${encodeURIComponent(email)}`);
            }
        } catch (err) {
            error = err.message || 'Failed to sign in';
            console.error('Login error:', err);
        } finally {
            loading = false;
        }
    }
</script>

<div class="container">
    <div class="signin-card">
        <h1>Sign In</h1>
        
        {#if error}
            <div class="error">{error}</div>
        {/if}

        <Form onSubmit={handleSignIn}>
            <Input 
                label="Email"
                type="email"
                value={email}
                onInput={(e) => email = e.target.value}
                placeholder="Enter your email"
                disabled={loading}
                error={error}
            />

            <Button 
                type="submit"
                loading={loading}
                full
            >
                {loading ? 'Signing in...' : 'Sign In'}
            </Button>
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

    .signin-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    h1 {
        text-align: center;
        margin-bottom: 2rem;
        color: #1a1a1a;
    }

    .error {
        background: #fee2e2;
        color: #dc2626;
        padding: 0.75rem;
        border-radius: 4px;
        margin-bottom: 1rem;
    }

</style>