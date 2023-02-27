<script lang="ts">
  export let elements: any[] | undefined;
  let cls: string = "";
  export { cls as class };
  let dragNode: Node;

  function isBefore(first_node: Node, second_node: Node) {
    if (first_node.parentNode == second_node.parentNode)
      for (
        let before_node = first_node.previousSibling;
        before_node && before_node.nodeType != Node.PROCESSING_INSTRUCTION_NODE;
        before_node = before_node.previousSibling
      )
        if (before_node == second_node) return true;
    return false;
  }

  function dragStart(dragEvent: DragEvent) {
    dragEvent.dataTransfer!.effectAllowed = "move";
    dragEvent.dataTransfer!.setData("text/plain", "");
    dragNode = dragEvent.target as Node;
  }

  function dragOver(dragEvent: DragEvent) {
    let targetNode: Node = dragEvent.target as Node;
    if (isBefore(dragNode, targetNode))
      targetNode.parentNode!.insertBefore(dragNode, targetNode);
    else targetNode.parentNode!.insertBefore(dragNode, targetNode.nextSibling);
  }

  function dragEnd() {}

  function touchStart(touchEvent: TouchEvent) {
    touchEvent.preventDefault();

    if (touchEvent.touches.length == 1) {
      dragNode = touchEvent.targetTouches[0].target as Node;
    }
  }

  function touchMove(touchEvent: TouchEvent) {
    touchEvent.preventDefault();
    let targetNode: Node = touchEvent.target as Node;
    if (isBefore(dragNode, targetNode))
      targetNode.parentNode!.insertBefore(dragNode, targetNode);
    else targetNode.parentNode!.insertBefore(dragNode, targetNode.nextSibling);
  }

  function touchEnd() {}

  interface $$Slots {
    default: {
      element: any;
      index: number;
    };
  }
</script>

{#if elements != undefined}
  {#each elements as element, index (element)}
    <div
      draggable="true"
      class={cls}
      on:dragstart={dragStart}
      on:dragover={dragOver}
      on:dragend={dragEnd}
      on:touchstart={touchStart}
      on:touchmove={touchMove}
      on:touchend={touchEnd}
    >
      <slot {element} {index} />
    </div>
  {/each}
{/if}
