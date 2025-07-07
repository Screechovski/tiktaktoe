<script lang="ts">
import { createEventDispatcher } from "svelte";

export let disabled = false;
export let type: "button" | "submit" | "reset" = "submit";

const dispatch = createEventDispatcher();

function clickHandler(e) {
    if (!disabled) {
        dispatch("click")
    } else {
        e.preventDefault();
    }
}
</script>

<div {type} class="s-button" on:click={clickHandler} {disabled}>
<span>
    <slot />
</span>
</div>

<style lang="scss">
.s-button {
    font-size: 1rem;
@apply h-12 flex items-center px-8 rounded-xl bg-slate-900;

    span {
        font-size: 1em;
        line-height: 1em;
        font-weight: 500;
        padding-bottom: 2px;
        text-transform: lowercase;
    }

&:disabled {
    @apply opacity-60;
    }

&:hover:not(:disabled) {
    @apply opacity-80;
    }

&:active:not(:disabled) {
        transform: translateY(2px);
    }

&:focus-visible {
        outline: 2px solid;
        outline-offset: 2px;
    @apply outline-slate-700;
    }
}
</style>
