<!-- Using template instead of __layout to make use of props -->
<script lang="ts">
	import Controller from '$lib/Controller.svelte'
	import Icon from '$lib/Icon.svelte'
	import { onMount } from 'svelte'

	type Content = {
		redirectPlaceholder: string
		redirectRef: string
		heightTransitionMultiplier: number
	}
	export let content: Content

	// Definatedly read, don't remove
	let controller: Controller

	// TODO: warnings for each slot that isn't provided? might be done with typesetting instead

	let mounted: boolean
	onMount(() => {
		mounted = true
	})
</script>

<svelte:head>
	<title>Sets</title>
</svelte:head>

<Controller bind:this={controller} />

<!-- Get this wierd jittering even after accounting for transitions -->
<!-- https://github.com/sveltejs/kit/issues/628 -->
{#if mounted}
	<body class="p-10 m-10 bg-white shadow-sm">
		<header class="flex justify-between mb-10">
			<slot name="header" />
			<a
				href={content.redirectRef}
				class="
				h-min
				min-w-max
				flex 
				items-center 
				justify-around 
				px-4 
				py-3 
				bg-green-800 
				hover:bg-green-900 
				rounded-sm
			"
			>
				<span
					class="
					text-2xl
					text-white
					font-medium
					h-min
				"
				>
					{content.redirectPlaceholder}
				</span>
				<div class="ml-2">
					<Icon class="fill-white" type="arrowRightAlt" />
				</div>
			</a>
		</header>

		<main class="shadow-md pb-5 bg-white rounded-md">
			<slot name="nav" />
			<section class="px-4 pt-5">
				<slot name="main-section" />
			</section>
		</main>
	</body>
{/if}
