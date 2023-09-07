<script lang="ts">
  import { writable } from "svelte/store";
  import {
    createName,
    createPassword,
    createDisabled,
    createHandler,
    createError,
  } from "../store/menu";
  import SButton from "../ui/SButton.svelte";
  import SInput from "../ui/SInput.svelte";
  import ModalBlock from "./ModalBlock.svelte";

  const isOpen = writable(false);

  function openCreateModal() {
    isOpen.set(true);
  }
</script>

<div class="flex flex-col items-center gap-2 w-fit">
  <ModalBlock bind:isOpen={$isOpen}>
    <div class="flex flex-col gap-1">
      <form
        on:submit|preventDefault={createHandler}
        class="flex flex-col gap-2 items-end"
      >
        <SInput type="text" placeholder="name" bind:value={$createName} />
        <SInput
          type="password"
          placeholder="password"
          bind:value={$createPassword}
        />

        {#if createError}
          <p class="error-line">{$createError}</p>
        {/if}

        <SButton disabled={$createDisabled}>Create</SButton>
      </form>
    </div>
  </ModalBlock>

  <SButton disabled={$isOpen} on:click={openCreateModal}>Create</SButton>
  <SButton>vs ai</SButton>
</div>
