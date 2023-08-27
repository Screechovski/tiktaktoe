<script lang="ts">
  import { onMount } from "svelte";
  import {
    initSocket,
    isConnected,
    isLoading,
    connectionError,
  } from "./store/socket";
  import { isLogined } from "./store/root";
  import AuthPage from "./lib/AuthPage.svelte";
  import LivingRoom from "./lib/LivingRoom.svelte";
  import { activeLobbyId } from "./store/lobbies";
  import GamePage from "./lib/GamePage.svelte";
  import SButton from "./ui/SButton.svelte";

  function init() {
    initSocket();
  }

  onMount(() => {
    init();
  });
</script>

{#if $isConnected}
  {#if $isLogined}
    {#if $activeLobbyId === -1}
      <LivingRoom />
    {:else}
      <GamePage />
    {/if}
  {:else}
    <AuthPage />
  {/if}
{:else}
  <div class="flex flex-col gap-2 items-start">
    {#if $isLoading}
      <p>Connecting...</p>
    {:else}
      <div class="flex flex-col gap-2">
        <p>Connection closed</p>
        <SButton on:click={init}>Retry</SButton>
      </div>
    {/if}

    {#if $connectionError}
      <p class="text-red-400">{$connectionError}</p>
    {/if}
  </div>
{/if}
