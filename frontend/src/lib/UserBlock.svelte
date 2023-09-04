<script lang="ts">
  import { user } from "../store/user";
</script>

<div class="flex flex-col gap-1 bg-slate-700 w-fit px-4 py-2 rounded-lg">
  <div class="flex gap-2">
    <span>{$user.emoji}</span>
    <span>{$user.name}</span>
  </div>

  <div class="flex gap-1">
    <span class="font-semibold">Wins:</span>{$user.win}<span />
    <span class="font-semibold">Losses:</span>{$user.lose}<span />
    <span class="font-semibold">Draws:</span>{$user.draw}<span />
  </div>
</div>
