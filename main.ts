import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// The entry: exactly one emoji — a hugging face, the warmest single
// emoji for a stranger: a friendly hug, kind at first glance, universal,
// and chosen rather than the default smiley.
const EMOJI = "\u{1F917}"; // U+1F917 HUGGING FACE

// The competition gate: /output/entry.txt must be UTF-8 text of 1 to 8
// characters, not only white space, and the entry is exactly one emoji.
// Fail loudly instead of writing anything that could never be judged.
const codePoints = [...EMOJI].length;
if (codePoints < 1 || codePoints > 8) {
  throw new Error(`entry is ${codePoints} code points, outside the 1-8 gate`);
}
if (EMOJI.trim().length === 0) {
  throw new Error("entry is whitespace only");
}
if (codePoints !== 1) {
  throw new Error("entry must be exactly one emoji (one code point)");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", EMOJI, "utf8");

// Read back what was written and confirm it is byte-for-byte the emoji
// we validated above, so a partial or mangled write can never pass
// silently as a valid entry. Also confirm the written text is a single
// emoji by Unicode property, not just a single code point.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== EMOJI) {
  throw new Error("entry.txt does not match the validated emoji");
}
if (!/^\p{Extended_Pictographic}$/u.test(written)) {
  throw new Error("entry.txt is not a single emoji");
}
if (Buffer.byteLength(written, "utf8") !== 4) {
  throw new Error("entry.txt is not the expected 4-byte emoji");
}
