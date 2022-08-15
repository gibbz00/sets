<!-- 
	For this to work: tags must be the set difference from the two or more groups
 -->
<script lang="ts">
	import '@carbon/styles/css/styles.css'
	import '@carbon/charts/styles.css'
	import { onMount } from 'svelte'
	import type { RadarChartOptions } from '@carbon/charts/interfaces/charts'

	let chart

	onMount(async () => {
		const charts = await import('@carbon/charts-svelte')
		chart = charts.RadarChart
	})

	// radar dense
	const radarDenseDataTmp = [
		{ tag: 'Biceps', group: 'Primary', sets: 1 },
		{ tag: 'Triceps', group: 'Primary', sets: 1 },
		{ tag: 'Back', group: 'Primary', sets: 3 },
		{ tag: 'Triceps', group: 'Secondary', sets: 1 },
		{ tag: 'Biceps', group: 'Secondary', sets: 2 },
		{ tag: 'Back', group: 'Secondary', sets: 1 },
	]
	const radarDenseOptionsTmp: RadarChartOptions = {
		title: 'Placeholder Title',
		radar: {
			axes: {
				angle: 'tag',
				value: 'sets',
			},
		},
		data: {
			groupMapsTo: 'group',
		},
		height: '50rem',
		width: '50rem',
	}
</script>

<svelte:component this={chart} data={radarDenseDataTmp} options={radarDenseOptionsTmp} />
