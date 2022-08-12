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
	const heightTransitionDuration: number = 1000
	// TODO: not used since fade for child elements isn't implemented
	// const fadeInDelay: number = 100
	// const fadeInDuration: number = 100
	// const fadeOutDelay: number = 0
	// const fadeOutDuration: number = 100

	/*
        TODO: child elements have fade transition?

        don't know how to add transitions from action

        in:fade={{
            delay: fadeInDelay,
            duration: fadeInDuration,
        }}
        out:fade={{
            delay: fadeOutDelay,
            duration: fadeOutDuration,
        }}

        does not account for newly created elements since action is only run on parent creation
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
