<script>
    import { goto } from '$app/navigation';
    import { base } from '$app/paths';
    import { toast } from 'svelte-french-toast';
    import { hostService } from '$lib/services/hosts'; 
    import Button from '$lib/components/Button.svelte';
    import Input from '$lib/components/Input.svelte';
    import Form from '$lib/components/Form.svelte';

    let formData = {
        hostname: '',  // Changed from name to hostname
        ip: '',
        port: '',
        env: 'Dev',   // Added env field with default
        region: '',    // Added region field
    };

    let loading = false;
    let error = null;

    // Environment options
    const envOptions = ['Dev', 'Staging', 'Prod'];

    async function handleSubmit() {
        // Validate required fields
        if (!formData.hostname || !formData.ip) {
            toast.error('Hostname and IP are required');
            return;
        }

        // Validate port if provided
        if (formData.port && !isValidPort(formData.port)) {
            toast.error('Invalid port number');
            return;
        }

        loading = true;
        try {
            // Convert port to number if provided
            const hostData = {
                ...formData,
                port: formData.port ? parseInt(formData.port) : undefined
            };

            console.log('Creating host with data:', hostData); // Debug log
            await hostService.createHost(hostData);
            toast.success('Host created successfully');
            goto(`${base}/hosts`);
        } catch (err) {
            error = err.message;
            toast.error(error);
            console.error('Host creation error:', err); // Debug log
        } finally {
            loading = false;
        }
    }

    function isValidPort(port) {
        const num = parseInt(port);
        return !isNaN(num) && num >= 0 && num <= 65535;
    }
</script>

<div class="create-host-page">
    <header class="page-header">
        <div class="header-content">
            <h1>Create Host</h1>
            <Button 
                variant="secondary" 
                on:click={() => goto(`${base}/hosts`)}
            >
                Back to Hosts
            </Button>
        </div>
    </header>

    <div class="form-container">
        <Form onSubmit={handleSubmit}>
            {#if error}
                <div class="error-message">
                    {error}
                </div>
            {/if}

            <div class="form-grid">
                <Input
                    label="Hostname"
                    value={formData.hostname}
                    onInput={(e) => formData.hostname = e.target.value}
                    placeholder="Enter hostname"
                    required
                />

                <Input
                    label="IP Address"
                    value={formData.ip}
                    onInput={(e) => formData.ip = e.target.value}
                    placeholder="Enter IP address"
                    required
                />

                <Input
                    label="Port"
                    value={formData.port}
                    onInput={(e) => formData.port = e.target.value}
                    placeholder="Enter port number"
                    type="number"
                />

                <div class="select-group">
                    <label for="env">Environment</label>
                    <select 
                        id="env"
                        bind:value={formData.env}
                    >
                        {#each envOptions as env}
                            <option value={env}>{env}</option>
                        {/each}
                    </select>
                </div>

                <Input
                    label="Region"
                    value={formData.region}
                    onInput={(e) => formData.region = e.target.value}
                    placeholder="Enter region (e.g., BM)"
                />
            </div>

            <div class="form-actions">
                <Button 
                    variant="secondary" 
                    type="button"
                    on:click={() => goto(`${base}/hosts`)}
                >
                    Cancel
                </Button>
                
                <Button
                    type="submit"
                    loading={loading}
                >
                    {loading ? 'Creating...' : 'Create Host'}
                </Button>
            </div>
        </Form>
    </div>
</div>

<style>
    /* Previous styles remain the same */

    .select-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .select-group label {
        font-size: 14px;
        color: #374151;
    }

    .select-group select {
        padding: 0.75rem;
        border: 1px solid #d1d5db;
        border-radius: 4px;
        font-size: 1rem;
        background-color: white;
    }

    .select-group select:focus {
        outline: none;
        border-color: #2563eb;
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
</style>