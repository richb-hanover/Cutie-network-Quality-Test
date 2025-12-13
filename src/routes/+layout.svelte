<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.ico';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { disconnect } from '$lib/webrtc';

	if (browser) {
		void import('$lib/lifecycle-beacon');
	}
	let { children } = $props();

	onMount(() => {
		const handleBeforeUnload = () => {
			void disconnect('reload', { suppressMessage: true });
		};

		window.addEventListener('beforeunload', handleBeforeUnload);
		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
