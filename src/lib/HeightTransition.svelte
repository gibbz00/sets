<script lang="ts">
	/*
        Section height animaiton:
        Base on: https://css-tricks.com/using-css-transitions-auto-dimensions/

        Animation duration "requirements"
        * fadeInDelay  >= heightTransitonDuration + heightTransitionDelay, otherwise element will begin rendering before the container is fully rendered
        * heightTransitionDelay >= fadeOutDelay + fadeOutDuration, elements will otherwise remain outside of container
    */

	// in (ms), these values to not fill requirements, all because I don't want the height transition delay be non-zero
	const heightTransitionDelay: number = 0
	const heightTransitionDuration: number = 100

	/*
        TODO: Would be nice to have automatic child element/component fade transitions,
        but such transitions are unfortunately not pased automatically down to components.
        Currently just duplicating them inside the components.

        in:fade={{
            delay: fadeInDelay,
            duration: fadeInDuration,
        }}
        out:fade={{
            delay: fadeOutDelay,
            duration: fadeOutDuration,
        }}

    */

	export let maxHeight: number
</script>

<div
	style:transition="max-height"
	style:max-height={`${maxHeight}px`}
	style:transition-delay={`${heightTransitionDelay}ms`}
	style:transition-duration={`${heightTransitionDuration}ms`}
>
	<slot />
</div>
