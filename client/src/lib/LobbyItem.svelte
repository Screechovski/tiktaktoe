<script lang="ts">
  import { lobbies, type Lobby } from "../store/lobbies";
  import type { User } from "../store/user";
  import { joinLobby } from "../store/socket";
  import SButton from "../ui/SButton.svelte";
  import SInput from "../ui/SInput.svelte";
  import ModalBlock from "./ModalBlock.svelte";

  export let lobby: Lobby;
  let showPassField = false;
  let password = "";
  let isOpen = false;

  function hasFirstPlayer() {
    return lobby.users.length !== 0;
  }

  $: getFirstPlayer = (): User => {
    if (lobby.users.length === 0) throw Error("undefined first player");
    return lobby.users[0];
  };

  $: hasSecondPlayer = () => {
    return lobby.users.length > 1;
  };

  $: getSecondPlayer = (): User => {
    if (lobby.users.length < 2) throw Error("undefined first player");
    return lobby.users[1];
  };

  $: getWinRateLine = (player: User) => {
    return `w:${player.win} l:${player.lose} d:${player.draw}`;
  };

  function joinHandler() {
    if (lobby.isPrivate) {
      showPassField = true;
    } else {
      joinLobby(lobby.id, "");
    }
  }

  function joinPassHandler() {
    joinLobby(lobby.id, password);
  }
</script>

<div>
  <ModalBlock bind:isOpen={showPassField}>
    <form class="flex gap-2" on:submit|preventDefault={joinPassHandler}>
      <SInput type="password" placeholder="lobby pass" bind:value={password} />
      <SButton>join</SButton>
    </form>
  </ModalBlock>
  {#if $lobbies.joinError}
    <p>{$lobbies.joinError}</p>
  {/if}

  <div class="flex gap-4">
    <div class="flex flex-col">
      {#if hasFirstPlayer()}
        <span>{getFirstPlayer().name}</span>
        <span>{getWinRateLine(getFirstPlayer())}</span>
      {:else}
        <SButton on:click={joinHandler}>join</SButton>
      {/if}
    </div>

    <div>
      <span>{lobby.name}</span>
      <span class="font-semibold">
        {lobby.isPrivate ? "private" : "open"}
      </span>
    </div>

    <div class="flex flex-col">
      {#if hasSecondPlayer()}
        <span>{getSecondPlayer().name}</span>
        <span>{getWinRateLine(getSecondPlayer())}</span>
      {:else}
        <SButton on:click={joinHandler}>join</SButton>
      {/if}
    </div>
  </div>
</div>
