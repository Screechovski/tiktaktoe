<script lang="ts">
  import { authName, authSubmit, authDisabled, authError } from "../store/auth";
  import SButton from "../ui/SButton.svelte";
  import SInput from "../ui/SInput.svelte";
</script>

<div class="w-full h-full flex justify-center items-center">
  <form
    class="flex flex-col gap-2 items-start"
    on:submit|preventDefault={authSubmit}
  >
    <div class="flex gap-2">
      <SInput placeholder="user name" bind:value={$authName} />
      <SButton disabled={$authDisabled}>sign in</SButton>
    </div>

    {#if $authError}
      <p class="text-red-400">{$authError}</p>
    {/if}
  </form>
</div>
