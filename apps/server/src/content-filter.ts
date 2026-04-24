/**
 * Content filter for wall messages.
 *
 * Two matchers:
 *  1. English  — obscenity's built-in englishDataset with recommended transformers
 *               (handles leet-speak, confusables, Unicode lookalikes, etc.)
 *  2. Thai     — custom DataSet with no transformers (raw Unicode substring match)
 *               Uses both exact words AND wholeword-boundary-free patterns so
 *               "อีสัตว์", "ไอ้สัตว์", "สัตว์มึง" are all caught by one phrase.
 */
import {
  RegExpMatcher,
  DataSet,
  pattern,
  englishDataset,
  englishRecommendedTransformers,
  skipNonAlphabeticTransformer,
} from "obscenity";

// ── Thai word list ────────────────────────────────────────────────────────────
// Each entry is the core offensive substring.
// obscenity matches it anywhere inside the input (no word-boundary requirement),
// so "อีสัตว์", "ไอ้สัตว์", "ควายบ้า" etc. are all caught automatically.
const THAI_BAD_WORDS: string[] = [
  // Core profanity
  "ควย",
  "หี",
  "เหี้ย",
  "สัตว์",   // catches อีสัตว์, ไอ้สัตว์, สัตว์นรก …
  "สัด",     // catches อีสัด, ไอ้สัด …
  "เย็ด",
  "ระยำ",
  "ชาติหมา",
  // Standalone insults (short, but common)
  "มึง",
  "กู",
  "ควาย",
  "ฉิบหาย",
  "หน้าหี",
  "หน้าหมา",
  "แม่มึง",
  "พ่อมึง",
  "ไอ้บ้า",
  "อีบ้า",
  "ไอ้โง่",
  "อีโง่",
  "แรด",
  "หมาเน่า",
  // Slurs
  "อีกะเทย",
  "ไอ้กะเทย",
];

// ── Build Thai matcher (no transformers — raw Unicode) ────────────────────────
function buildThaiMatcher(): RegExpMatcher {
  const ds = new DataSet<{ word: string }>();
  for (const word of THAI_BAD_WORDS) {
    ds.addPhrase((b) =>
      b.addPattern(pattern`${word}`).setMetadata({ word })
    );
  }
  return new RegExpMatcher({
    ...ds.build(),
    blacklistMatcherTransformers: [],
    whitelistMatcherTransformers: [],
  });
}

// ── Build English matcher (full obscenity transformer pipeline) ───────────────
// Adds skipNonAlphabeticTransformer on top of the recommended set so that
// spaced-out evasions like "f u c k" are also caught.
function buildEnglishMatcher(): RegExpMatcher {
  return new RegExpMatcher({
    ...englishDataset.build(),
    ...englishRecommendedTransformers,
    blacklistMatcherTransformers: [
      ...(englishRecommendedTransformers.blacklistMatcherTransformers ?? []),
      skipNonAlphabeticTransformer(),
    ],
  });
}

const thaiMatcher = buildThaiMatcher();
const englishMatcher = buildEnglishMatcher();

// ── Public API ────────────────────────────────────────────────────────────────

export interface FilterResult {
  /** true → block the submission */
  blocked: boolean;
  /** Human-readable reason in Thai (shown to the user) */
  reason?: string;
}

/**
 * Run content filter on submitted text.
 * Returns { blocked: false } when clean, or { blocked: true, reason } when not.
 */
export function filterContent(text: string): FilterResult {
  if (!text?.trim()) return { blocked: false };

  if (thaiMatcher.hasMatch(text) || englishMatcher.hasMatch(text)) {
    return {
      blocked: true,
      reason: "ข้อความของคุณมีคำที่ไม่เหมาะสม กรุณาส่งข้อความที่สุภาพ",
    };
  }

  return { blocked: false };
}
