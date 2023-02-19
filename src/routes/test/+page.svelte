<script lang="ts">
    import { workoutPrograms} from '$lib/Model'
    import Reorderable from '$lib/TestSnippets/Reorderable.svelte'
</script>

<Reorderable let:element={element} let:index={index} elements={$workoutPrograms.get("Monday")?.exercises.map(exercise => exercise.exerciseName)}>
  <p>{element} {index}</p>
</Reorderable>
