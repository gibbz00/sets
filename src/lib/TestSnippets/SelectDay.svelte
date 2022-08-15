<script>
	import Hidden from '$lib/Hidden.svelte'

	import Icon from '$lib/Icon.svelte'
	import { selectedDay } from '$lib/Model'
	import InteractiveList from './InteractiveList.svelte'
	import { exercises } from '$lib/Model'
	import { autocompleteFilter } from '$lib/utils/autoCompleteFilter'
</script>

<Hidden>
	<div slot="placeholderContent" class="text-6xl flex content-center">
		{$selectedDay}
		<Icon class="rotate-90 w-16" type="arrowRight" />
	</div>
</Hidden>

<!-- Test Interactive List -->
<InteractiveList
	on:selected={(event) => console.log(event.detail)}
	listItems={[...$exercises.keys()]}
	listFilter={autocompleteFilter}
	filterKey={''}
	class="absolute z-10 inset-x-0"
/>
<!-- Test interactive list with Selectable Input rewrite -->
