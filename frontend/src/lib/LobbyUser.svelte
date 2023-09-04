<script lang="ts">
  import HostIcon from "../icons/host-icon.svelte";
  import { gameIsStarted, gameIsEnd } from "../store/game";
  import { isMe } from "../store/user";

  export let emoji: string = "";
  export let id: number = -1;
  export let isHost: boolean = false;
  export let isPlay: boolean = false;
  export let isReady: boolean = false;
  export let win: number;
  export let lose: number;
  export let draw: number;
  export let name: string;

  $: getClasses = () => {
    let classList = ["lobby-user"];

    if (isPlay && !$gameIsEnd) {
      classList.push("lobby-user__active");
    }

    return classList.join(" ");
  };
</script>

<div class={getClasses()}>
  <p class="lobby-user__headline">
    <span class="relative">
      {emoji}
      {#if isHost}
        <i class="lobby-user__host"><HostIcon /></i>
      {/if}
    </span>
    <span>{name}</span>
    {#if isMe(id)}
      <span class="text-slate-500">(you)</span>
    {/if}
  </p>

  <p class="lobby-user__footer">
    <span title="Win count">W: {win}</span>
    <span title="Lose count">L: {lose}</span>
    <span title="Draw count">D: {draw}</span>
  </p>

  {#if !$gameIsStarted}
    <span class="status status--{isReady ? '' : 'not-'}ready">
      {isReady ? "Ready" : "Not ready"}
    </span>
  {/if}

  {#if isPlay && !$gameIsEnd}
    <div class="lobby-user__filter" />
  {/if}
</div>

<style lang="scss">
  @keyframes filter-animate {
    0% {
      transform: scaleX(1);
    }
    100% {
      transform: scaleX(0);
    }
  }

  .lobby-user {
    @apply flex flex-col gap-2 bg-slate-700 p-4 rounded-lg relative;

    &__filter {
      @apply absolute inset-0 w-full h-full bg-white opacity-20;
      transform-origin: 100% 0%;
      animation: filter-animate 10s linear backwards;
      z-index: 1;
    }

    &__active {
      border: 3px solid;
      @apply border-green-700;
    }

    &__headline {
      @apply flex items-center gap-1 relative;
      z-index: 2;
    }

    &__host {
      height: 20px;
      width: 20px;
      left: calc(50% - 10px);
      top: -12px;
      @apply flex items-center justify-center fill-slate-900 absolute;
    }

    &__footer {
      @apply flex gap-2 relative;
      z-index: 2;
    }
  }

  .status {
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    @apply py-0.5 px-2 text-slate-300 absolute bottom-0 right-0 rounded-tl-lg font-semibold;

    &--ready {
      @apply bg-green-700;
    }

    &--not-ready {
      @apply bg-red-700;
    }
  }
</style>
