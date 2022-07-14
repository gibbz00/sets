<span class="tooltip">
    <slot name="shown"></slot>
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
        visibility: hidden;
        border: 1px solid black;
        text-align: center;
        padding: 5px 0;

        /* Position the tooltip text */
        position: absolute;
        right: 0%;
        z-index: 1;
    }

    /* Show the tooltip text when you mouse over the tooltip container */
    .tooltip:hover .content {
        visibility: visible;
    }
</style>