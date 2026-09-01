<script lang="ts">
	import '../app.postcss';
	import { onMount } from 'svelte';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faFaceSurprise, faUser } from '@fortawesome/free-solid-svg-icons';
	import { user } from '$lib/auth';
	import { supabase } from '$lib/supabaseClient';
	import { theme } from '$lib/stores/theme';

	let iconsLoaded = false;

	onMount(() => {
		// Check if fonts are loaded
		document.fonts.ready.then(() => {
			iconsLoaded = true;
		});
	});

	const toggleTheme = () => {
		theme.update((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
	};

	let displayName: string = ''; // Variable to store the display name
	// Update `displayName` based on `user` store's state
	$: {
		if ($user) {
			getDisplayName().then((name) => {
				displayName = name || '';
			});
		}
	}

	const getDisplayName = async () => {
		// Get display name from user
		try {
			const { data, error } = await supabase.auth.getUser();
			if (error) throw error;
			const displayName = data.user.user_metadata.display_name || data.user.email;
			return displayName;
		} catch (error: any) {
			console.error('Error fetching display name:', error.message);
			return null;
		}
	};
</script>

<svelte:head>
	<title>Code Curious</title>
</svelte:head>

<div
	class="flex min-h-screen flex-col bg-slate-100 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100"
>
	<!-- Header (shared across all pages) -->
	<header
		class="border-b border-slate-200 bg-slate-200/90 p-4 text-slate-900 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
	>
		<div class="mx-0 flex items-center justify-between gap-4">
			<div class="flex justify-start lg:w-80">
				<a href="/" class="inline-block hover:text-slate-600 dark:hover:text-slate-200 lg:hidden"
					><h1>
						<h1 class="flex items-center gap-2">
							<div class="flex h-5 w-5 items-center justify-center">
								{#if iconsLoaded}
									<FontAwesomeIcon icon={faFaceSurprise} />
								{/if}
							</div>
							<span class="sm:hidden">CC</span>
							<span class="hidden sm:inline-block">CODE CURIOUS</span>
						</h1>
					</h1></a
				>
			</div>
			<div>
				<a href="/" class="hidden hover:text-slate-600 dark:hover:text-slate-200 lg:inline-block"
					><h1 class="flex items-center gap-2">
						<div class="flex h-5 w-5 items-center justify-center">
							{#if iconsLoaded}
								<FontAwesomeIcon icon={faFaceSurprise} />
							{/if}
						</div>
						CODE CURIOUS
					</h1></a
				>
			</div>
			<nav class="flex items-center justify-end gap-4 lg:w-80">
				<button
					type="button"
					on:click={toggleTheme}
					class="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
				>
					{$theme === 'dark' ? 'Light mode' : 'Dark mode'}
				</button>
				<a href="/tutorial/welcome" class="hover:text-slate-600 dark:hover:text-slate-200"
					>Tutorial</a
				>
				{#if !$user}
					<a
						href="/sign-in"
						class="flex items-center gap-2 hover:text-slate-600 dark:hover:text-slate-200"
						><div class="flex h-5 w-5 items-center justify-center">
							{#if iconsLoaded}
								<FontAwesomeIcon icon={faUser} />
							{/if}
						</div>
						Sign In</a
					>
				{:else}
					<a
						href="/dashboard"
						class="flex items-center gap-2 hover:text-slate-600 dark:hover:text-slate-200"
						><div class="flex h-5 w-5 items-center justify-center">
							{#if iconsLoaded}
								<FontAwesomeIcon icon={faUser} />
							{/if}
						</div>
						{displayName !== '' ? displayName : $user.email}</a
					>
				{/if}
			</nav>
		</div>
	</header>

	<!-- Main Layout (shared) -->
	<main class="flex h-full flex-1 flex-col md:flex-row">
		<!-- This is where the content of each page will be injected -->
		<slot></slot>
	</main>
</div>
