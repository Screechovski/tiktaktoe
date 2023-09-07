<script lang="ts">
  import { activeLobby, activeLobbyId } from "../store/lobbies";
  import { leaveLobby, makeStep, sendReady } from "../store/socket";
  import SButton from "../ui/SButton.svelte";
  import UserBlock from "./UserBlock.svelte";
  import {
    showIsReady,
    gameInstance,
    gameIsStarted,
    gameIsEnd,
    statusGame,
  } from "../store/game";
  import LobbyUser from "./LobbyUser.svelte";
  import PulseLoader from "./PulseLoader.svelte";

  function leaveLobbyHandler() {
    leaveLobby($activeLobbyId);
  }

  function readyHandler() {
    sendReady($activeLobbyId);
  }

  function stepHandler(i: number, j: number) {
    makeStep($activeLobbyId, i, j);
  }

  $: gameGridStyles = () => {
    if ($gameInstance === null) return "";

    return (
      `grid-template-columns: repeat(${$gameInstance.length}, 1fr);` +
      `grid-template-rows: repeat(${$gameInstance[0].length}, 1fr);`
    );
  };

  $: firstUser = () => {
    if ($activeLobby !== null && $activeLobby.users[0]) {
      return $activeLobby.users[0];
    }
    return null;
  };

  $: secondUser = () => {
    if ($activeLobby !== null && $activeLobby.users[1]) {
      return $activeLobby.users[1];
    }
    return null;
  };

  $: cellDisabled = $gameIsEnd || !$gameIsStarted;
</script>

<div class="game-page">
  <div class="game-page-area">
    <div class="game-page-area__user-wrapper">
      {#if firstUser()}
        <div class="game-page-area__user">
          <LobbyUser {...firstUser()} />
        </div>
      {/if}
    </div>

    <div class="game-page-area__grid game-grid" style={gameGridStyles()}>
      {#if $gameIsEnd}
        <p class="game-grid__end-game">
          {#if $statusGame === 1}
            <span class="win">✨WIN🎉</span>
          {:else if $statusGame === -1}
            <span class="lose">😔LOSE🤕</span>
          {:else}
            <span class="draw">😐DRAW❓</span>
          {/if}
          <span>GAME END</span>
        </p>
      {/if}
      {#if $gameInstance !== null}
        {#each $gameInstance as row, i (i)}
          {#each row as item, j (j)}
            <button
              disabled={cellDisabled || item.value !== -1}
              class="game-grid__button"
              on:click={() => stepHandler(i, j)}
            >
              {#if item.value === 1}
                <span>❌</span>
              {:else if item.value === 0}
                <span>⭕️</span>
              {/if}
            </button>
          {/each}
        {/each}
      {:else}
        <div class="flex flex-col gap-3 items-center">
          <PulseLoader />
          <span>Waiting for an opponent</span>
        </div>
      {/if}
    </div>

    <div class="game-page-area__user-wrapper">
      {#if secondUser()}
        <div class="game-page-area__user">
          <LobbyUser {...secondUser()} />
        </div>
      {/if}
    </div>
  </div>

  <div class="game-page-ready">
    {#if $showIsReady}
      <SButton on:click={readyHandler}>Ready</SButton>
    {/if}
  </div>

  <div class="game-page-user-block">
    <UserBlock />
  </div>

  <div class="game-page-leave">
    <SButton on:click={leaveLobbyHandler}>Leave</SButton>
  </div>
</div>

<style lang="scss">
  .game-page {
    @apply flex flex-col justify-center h-full items-center gap-4;
  }

  .game-page-ready {
    height: 50px;
  }

  .game-page-user-block {
    @apply absolute top-4 left-4;
  }

  .game-page-leave {
    @apply absolute top-4 right-4;
  }

  .game-page-area {
    width: 900px;
    @apply flex justify-between items-center;

    &__user-wrapper {
      width: 250px;
    }
  }

  .game-grid {
    @apply grid gap-2 w-fit relative;

    &__end-game {
      @apply absolute flex flex-col z-10 rounded-xl bg-white bg-opacity-20 items-center justify-end;
      width: 200%;
      left: -50%;
      height: calc(100% + 120px);
      top: -20px;
      padding-bottom: 20px;

      span:first-child {
        letter-spacing: 2px;
        @apply text-3xl font-bold;
      }

      span:last-child {
        letter-spacing: 2px;
        @apply text-xl font-bold;
      }

      .lose {
        @apply text-red-600;
      }

      .win {
        @apply text-green-700;
      }

      .draw {
        @apply text-gray-800;
      }
    }

    &__button {
      @apply h-12 w-12 flex items-center justify-center rounded-xl bg-slate-900;

      &:disabled {
        @apply opacity-60;
      }

      &:hover:not(:disabled) {
        @apply opacity-90;
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
  }
</style>
