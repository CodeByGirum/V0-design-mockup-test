/**
 * Purpose: Defines a custom CodeMirror theme and syntax highlighting style.
 * Features: Uses a uniform dark background color consistent with the chat panel.
 * Used in: components/embedded-sql-preview.tsx
 * Notes: The color palette is chosen for clarity and a modern aesthetic.
 */
import { EditorView } from "@codemirror/view"
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language"
import { tags as t } from "@lezer/highlight"
import type { Extension } from "@codemirror/state"

const vscodeDark = {
  background: "#121212",
  foreground: "#d4d4d4",
  selection: "rgba(90, 150, 215, 0.3)",
  caret: "#aeafad",
  keyword: "#569cd6",
  string: "#ce9178",
  number: "#b5cea8",
  function: "#dcdcaa",
  comment: "#6a9955",
  identifier: "#9cdcfe",
  type: "#4ec9b0",
  operator: "#d4d4d4",
  punctuation: "#808080",
  invalid: "#f44747",
}

export const sweepoTheme: Extension = EditorView.theme(
  {
    "&": {
      color: vscodeDark.foreground,
      backgroundColor: `${vscodeDark.background} !important`,
      fontFamily: "var(--font-mono)",
    },
    ".cm-content": {
      caretColor: vscodeDark.caret,
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: vscodeDark.caret,
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: vscodeDark.selection,
    },
    ".cm-gutters": {
      backgroundColor: vscodeDark.background,
      color: vscodeDark.punctuation,
      border: "none",
    },
  },
  { dark: true },
)

export const sweepoSyntaxHighlighting: Extension = syntaxHighlighting(
  HighlightStyle.define([
    { tag: [t.keyword, t.operatorKeyword], color: vscodeDark.keyword },
    { tag: [t.string, t.regexp, t.special(t.string)], color: vscodeDark.string },
    { tag: [t.number, t.bool, t.null], color: vscodeDark.number },
    { tag: [t.function(t.variableName), t.function(t.propertyName)], color: vscodeDark.function },
    { tag: t.comment, color: vscodeDark.comment, fontStyle: "italic" },
    { tag: [t.name, t.standard(t.name), t.definition(t.variableName)], color: vscodeDark.identifier },
    { tag: t.typeName, color: vscodeDark.type },
    { tag: t.operator, color: vscodeDark.operator },
    { tag: t.punctuation, color: vscodeDark.punctuation },
    { tag: t.invalid, color: vscodeDark.invalid },
  ]),
)
