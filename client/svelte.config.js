import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { reactivePreprocess } from "svelte-reactive-preprocessor";

export default {
  preprocess: [vitePreprocess(), reactivePreprocess({
    enabled: true,
    state: true,
  })],
}
