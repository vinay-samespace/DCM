<script>
	import { base } from '$app/paths';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-french-toast';
	import { authService } from '$lib/services/auth';
	import { validators } from '$lib/utils/validators';
	import Button from '$lib/components/Button.svelte';
	import Input from '$lib/components/Input.svelte';
	import Form from '$lib/components/Form.svelte';

	let name = '';
	let email = '';
	let role = 'user';
	let hostnames = '';
	let tags = '';

	let loading = false;
	let error = '';

	async function handleSignUp() {
		error = '';

		if (!name) {
			error = 'Name is required';
			return;
		}

		if (!email) {
			error = 'Email is required';
			return;
		}

		if (!validators.isValidEmail(email)) {
			error = 'Please enter a valid email';
			return;
		}

		const hostnamesArray = hostnames.split(',').map((h) => parseInt(h.trim())).filter(Boolean);
		const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

		const signupData = {
			name,
			email,
			role,
			hostnames: hostnamesArray,
			tags: tagsArray
		};

		try {
			loading = true;
			await authService.signup(signupData);
			goto(`${base}/auth/verify?email=${encodeURIComponent(email)}&mode=signup`);
		} catch (err) {
			error = err.message || 'Failed to sign up';
			toast.error(error);
			console.error('Sign up error:', err);
		} finally {
			loading = false;
		}
	}
</script>

<div class="container">
	<div class="signup-card">
		<h1>Sign Up</h1>

		{#if error}
			<div class="error">{error}</div>
		{/if}

		<Form onSubmit={handleSignUp}>
			<Input
				label="Name"
				type="text"
				value={name}
				onInput={(e) => name = e.target.value}
				placeholder="Enter your name"
				disabled={loading}
				error={error}
			/>
			<Input
				label="Email"
				type="email"
				value={email}
				onInput={(e) => email = e.target.value}
				placeholder="Enter your email"
				disabled={loading}
				error={error}
			/>
			<Input
				label="Hostnames"
				type="text"
				value={hostnames}
				onInput={(e) => hostnames = e.target.value}
				placeholder="Enter hostnames (comma-separated)"
				disabled={loading}
			/>
			<Input
				label="Tags"
				type="text"
				value={tags}
				onInput={(e) => tags = e.target.value}
				placeholder="Enter tags (comma-separated)"
				disabled={loading}
			/>

			<Button
				type="submit"
				loading={loading}
				full
			>
				{loading ? 'Signing up...' : 'Sign Up'}
			</Button>
		</Form>

		<div class="links">
			<a href="{base}/auth/signin">Already have an account? Sign in</a>
		</div>
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

	.signup-card {
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

	.links {
		text-align: center;
		margin-top: 1.5rem;
		color: #6b7280;
	}

	.links a {
		color: #2563eb;
		text-decoration: none;
		margin-left: 0.5rem;
	}

	.links a:hover {
		text-decoration: underline;
	}
</style>
