<script lang="ts">
	import Controller from '$lib/Controller.svelte'
	import Icon from '$lib/Icon.svelte'

	import { quintOut } from 'svelte/easing'
	import { crossfade } from 'svelte/transition'

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

	// TODO: warnings for each slot that isn't provided
</script>

<Controller bind:this={controller} />

<header class="flex justify-between mb-10">
	<h1 class="text-6xl">
		<slot name="title" />
	</h1>
	<!-- TODO: add redirect link as slotprop-->
	<a
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
		href="/"
	>
		<span
			class="
				text-2xl
				text-white
				font-medium
				h-min
			"
		>
			<slot name="redirectPlaceholder" />
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
		<!-- TODO: Array to iterate over slot prop e.g tabs [...$groups.keys()]  -->
		{#each ['hejs', 'svejs'] as tabName (tabName)}
			<!-- TODO: supply onclick function -->
			<div
				class="
					flex
					flex-col 
					items-center 
					justify-center 
					w-full 
					hover:bg-slate-100
				"
				on:click|capture={() => {
					$selectedGroup = tabName
				}}
			>
            <div class="py-5" slot="placeholderContent">
                <slot name="navTabContent"/>
            </div>
            {#if selectedTab == tabName}
                <div
                    in:receive={{ key: groupName }}
                    out:send={{ key: groupName }}
                    class="h-1 w-full bg-green-900"
                />
            {/if}
            </div>
		{/each}
        <slot name="navOptionalContent"/>
	</nav>
	<!-- Table container with add week button -->
    <!-- TODO: maxHeightFunction must be supplied -->
	<HeightTransition
		maxHeight={}
	>
		<section class="mx-4 mt-5" />
	</HeightTransition>
</main>
