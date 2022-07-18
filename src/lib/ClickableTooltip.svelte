<span class="tooltip">
    <slot name="placeholder"></slot>
    <span class="content">
        <slot name="content"></slot>
    </span>
</span>

<style>
    /* Tooltip container */
    .tooltip {
        position: relative;
    }

    /* Tooltip text */
    .tooltip .content {
        background-color: white;
        visibility: hidden;
        border: 1px solid black;
        padding: 5px 0;

        /* Position the tooltip text */
        position: absolute;
        left: 0%;
        top: 100%;
        z-index: 1;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .content {
        visibility: visible;
    }
</style>