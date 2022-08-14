<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation'

	import Controller from '$lib/Controller.svelte'
	import Icon from '$lib/Icon.svelte'
	import { onMount } from 'svelte'

	import { quintOut } from 'svelte/easing'
	import { crossfade } from 'svelte/transition'

	type Content = {
		title: string
		redirectPlaceholder: string
		redirectRef: string
		tabNames: string[]
		// For the case when there is no tab
		selectedTab: string | null
		onTabSelection: (tabName: string) => void
		heightTransitionMultiplier: number
	}
	export let content: Content

	let controller: Controller

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node)
			const transform = style.transform === 'none' ? '' : style.transform

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`,
			}
		},
	})

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
			<h1 class="text-6xl">
				{content.title}
			</h1>
			<a
				href={content.redirectRef}
				class="
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

		<main class="shadow-md pb-5 rounded-md">
			<!-- Tabs -->
			<!-- h-[4.8rem as fallback height for the case when all tabs risk being removed] -->
			<nav
				class="
				flex 
				text-2xl 
				text-center 
				rounded-md 
				bg-slate-50
				h-[4.8rem]
			"
			>
				{#each content.tabNames as tabName (tabName)}
					<div
						class="
						flex
						flex-col 
						items-center 
						justify-center 
						w-full 
						hover:bg-slate-100
					"
						on:click|capture={() => content.onTabSelection(tabName)}
					>
						<slot name="navTabContent" {tabName} />
						{#if content.selectedTab == tabName}
							<div
								in:receive|local={{ key: tabName }}
								out:send|local={{ key: tabName }}
								class="h-1 w-full bg-green-900"
							/>
						{/if}
					</div>
				{/each}
				<slot name="navOptionalContent" />
			</nav>
			<section class="mx-4 mt-5">
				<slot name="main-section" />
			</section>
		</main>
	</body>
{/if}
