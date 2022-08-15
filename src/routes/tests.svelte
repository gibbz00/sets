<script lang="ts">
	// import Radar from '$lib/TestSnippets/Radar.svelte'
	import SelectDay from '$lib/TestSnippets/SelectDay.svelte'
	import { exercises } from '$lib/Model'
	import InteractiveList from '$lib/InteractiveList.svelte'
	import { autocompleteFilter } from '$lib/utils/autoCompleteFilter'
</script>

<!-- <Radar /> -->

<SelectDay />
<!-- <InteractiveList listItems={[...$exercises.keys()]} filterKey="" /> -->
