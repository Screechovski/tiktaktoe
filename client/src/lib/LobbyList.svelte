<script lang="ts">
  import { lobbies } from "../store/lobbies";
  import LobbyItem from "./LobbyItem.svelte";
</script>

<div data-lobby>
  {#each $lobbies.list as lobby}
    <li class="flex gap-10">
      <LobbyItem lobby={lobby} />
    </li>
  {/each}
</div>
