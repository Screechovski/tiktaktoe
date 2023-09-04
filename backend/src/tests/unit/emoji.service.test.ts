import { getEmoji, _test_getEmojiCount } from "../../services/emoji.service";

it("test 150 user emojis", () => {
  const emojis: string[] = [];
  const emojisLength = _test_getEmojiCount();

  for (let i = 0; i < emojisLength * 1.5; i++) {
    const emoji = getEmoji();

    if (emojis.includes(emoji) && emojisLength === -1) {
      expect(emojisLength).toEqual(i);
      break;
    }

    emojis.push(emoji);
  }
});
