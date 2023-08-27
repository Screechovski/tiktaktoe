<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let type: string = "text";
  export let disabled: boolean = false;
  export let placeholder: string;
  export let value: string;

  const dispatch = createEventDispatcher();

  const onInput = (e) => {
    value = e.target.value
    dispatch("input", e)
  };
</script>

<div class="s-input">
  <input {type} {disabled} {value} on:input|preventDefault={onInput} {placeholder} />
</div>

<style lang="scss">
  .s-input {
    font-size: 1rem;

    input {
      @apply h-12 px-3 flex items-center rounded-xl bg-slate-700 outline-none;
      padding-bottom: 3px;
    }
  }
</style>
