<script>
  import LobbyList from "./LobbyList.svelte";
  import MenuBlock from "./MenuBlock.svelte";
  import UserBlock from "./UserBlock.svelte";
</script>

<div class="living-room">
  <div class="living-room__user-block">
    <UserBlock />
  </div>

  <div class="living-room__main">
    <MenuBlock />
    <LobbyList />
  </div>
</div>

<style lang="scss">
  .living-room {
    @apply w-full h-full flex justify-center items-center relative;

    &__user-block {
      @apply absolute top-4 left-4;
    }

    &__main {
      @apply flex gap-4 flex-col items-center;
    }
  }
</style>
