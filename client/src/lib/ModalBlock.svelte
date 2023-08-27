<script>
  import { onDestroy } from "svelte";
  import Portal from "svelte-portal";

  export let isOpen = false;
  const main = document.getElementById("app");

  $: isOpenChange = () => {
    if (isOpen) {
      main.classList.add("blur");
    } else {
      main.classList.remove("blur");
    }
  };

  function close() {
    isOpen = false;
  }

  onDestroy(() => {
    main.classList.remove("blur");
  });
</script>

{isOpenChange()}

{#if isOpen}
  <Portal target="body">
    <div class="modal-block">
      <button class="modal-block__filter" on:click={close} />

      <div class="modal-block__inner">
        <slot />
      </div>
    </div>
  </Portal>
{/if}

<style lang="scss">
  .modal-block {
    @apply fixed h-full w-full inset-0 flex items-center justify-center;
    z-index: 2;

    &__filter {
      @apply absolute inset-0 bg-white bg-opacity-10 h-full w-full;
      filter: blur(6px);
      z-index: 2;
    }

    &__inner {
      @apply relative p-6;
      z-index: 3;
    }
  }
</style>
