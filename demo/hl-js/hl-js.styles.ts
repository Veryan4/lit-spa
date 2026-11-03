import { css } from "lit";

export const styles = css`
  :host {
    display: block;
    max-width: 100%;
    min-width: 0;
  }

  .code-container {
    max-width: 100%;
    min-width: 0;
  }

  .file {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    border-radius: 6px;
    overflow: hidden;
    margin: 0;
    border: 1px solid var(--outline-color, #b0bec5);
  }

  .file-dark {
    background-color: #0d1117;
  }

  .file .file-meta {
    padding: 10px;
    font-size: 12px;
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .file .file-meta-light {
    color: #586069;
    background-color: #f7f7f7;
    border-top: 1px solid var(--outline-color, #b0bec5);
  }

  .file .file-meta-dark {
    color: #f7f7f7;
    background-color: #3a3a3a;
    border-top: 1px solid var(--outline-color, #8b949e);
  }

  .file .file-meta a {
    font-weight: 600;
    text-decoration: none;
    border: 0;
  }

  .file .file-meta-light a {
    color: #666;
  }

  .file .file-meta-dark a {
    color: #fff;
  }

  .file .code-area {
    position: relative;
    max-width: 100%;
    overflow-x: auto;
    padding: 0.8em;
    box-sizing: border-box;
  }

  .file .code-area pre {
    margin: 0;
    padding: 0;
  }

  .file .code-area pre,
  .file .code-area code {
    font-family:
      ui-monospace,
      SFMono-Regular,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
    font-size: 0.8125rem;
    line-height: 1.5;
  }

  .file .code-area pre code {
    width: max-content;
    min-width: 100%;
    padding: 0;
    overflow: visible;
    box-sizing: border-box;
  }

  .file .code-area .hljs-ln-numbers {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    text-align: right;
    color: #aaa;
    vertical-align: top;
  }

  .file .code-area td.hljs-ln-numbers {
    padding-right: 1rem;
  }

  .file .code-area td.hljs-ln-line {
    line-height: 21px;
    font-size: 12px;
    font-family:
      ui-monospace,
      SFMono-Regular,
      SF Mono,
      Menlo,
      Consolas,
      Liberation Mono,
      monospace;
    border: 0;
  }

  .file .code-area table.hljs-ln {
    border: 0;
    margin: 0;
  }

  .file .code-area pre code.hljs {
    padding: 0;
  }

  .file .code-area .hide-line-numbers .hljs-ln-numbers {
    display: none;
  }
  .file .html-area pre {
    padding: 0;
  }

  .file .html-area .nb-output pre {
    padding: 16px;
  }

  .file .html-area .nb-cell {
    position: relative;
  }

  .file .html-area .nb-output:before,
  .file .html-area .nb-input:before {
    position: absolute;
    font-family: monospace;
    color: #999;
    left: -7.5em;
    width: 7em;
    text-align: right;
    font-size: 13px;
  }

  .file .html-area .nb-input:before {
    content: "In [" attr(data-prompt-number) "]:";
  }

  .file .html-area .nb-output:before {
    content: "Out [" attr(data-prompt-number) "]:";
  }
`;

export const defaultStyles = css`
  pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
  }

  code.hljs {
    padding: 3px 5px;
  }

  .hljs {
    background: #f3f3f3;
    color: #444;
  }

  .hljs-formula,
  .hljs-attr,
  .hljs-property,
  .hljs-params {
  }

  .hljs-comment {
    color: #697070;
  }
  .hljs-tag,
  .hljs-punctuation {
    color: #444a;
  }

  .hljs-tag .hljs-name,
  .hljs-tag .hljs-attr {
    color: #444;
  }

  .hljs-keyword,
  .hljs-attribute,
  .hljs-selector-tag,
  .hljs-meta .hljs-keyword,
  .hljs-doctag,
  .hljs-name {
    font-weight: bold;
  }

  .hljs-type,
  .hljs-string,
  .hljs-number,
  .hljs-selector-id,
  .hljs-selector-class,
  .hljs-quote,
  .hljs-template-tag,
  .hljs-deletion {
    color: #880000;
  }

  .hljs-title,
  .hljs-section {
    color: #880000;
    font-weight: bold;
  }

  .hljs-regexp,
  .hljs-symbol,
  .hljs-variable,
  .hljs-template-variable,
  .hljs-link,
  .hljs-selector-attr,
  .hljs-operator,
  .hljs-selector-pseudo {
    color: #ab5656;
  }

  .hljs-literal {
    color: #695;
  }

  .hljs-built_in,
  .hljs-bullet,
  .hljs-code,
  .hljs-addition {
    color: #397300;
  }

  .hljs-meta {
    color: #1f7199;
  }

  .hljs-meta .hljs-string {
    color: #38a;
  }

  .hljs-emphasis {
    font-style: italic;
  }

  .hljs-strong {
    font-weight: bold;
  }
`;

export const githubStyles = css`
  .hljs {
    color: #24292e;
    background: #ffffff;
  }

  .hljs-doctag,
  .hljs-keyword,
  .hljs-meta .hljs-keyword,
  .hljs-template-tag,
  .hljs-template-variable,
  .hljs-type,
  .hljs-variable.language_ {
    /* prettylights-syntax-keyword */
    color: #d73a49;
  }

  .hljs-title,
  .hljs-title.class_,
  .hljs-title.class_.inherited__,
  .hljs-title.function_ {
    /* prettylights-syntax-entity */
    color: #6f42c1;
  }

  .hljs-attr,
  .hljs-attribute,
  .hljs-literal,
  .hljs-meta,
  .hljs-number,
  .hljs-operator,
  .hljs-variable,
  .hljs-selector-attr,
  .hljs-selector-class,
  .hljs-selector-id {
    /* prettylights-syntax-constant */
    color: #005cc5;
  }

  .hljs-regexp,
  .hljs-string,
  .hljs-meta .hljs-string {
    /* prettylights-syntax-string */
    color: #032f62;
  }

  .hljs-built_in,
  .hljs-symbol {
    /* prettylights-syntax-variable */
    color: #e36209;
  }

  .hljs-comment,
  .hljs-code,
  .hljs-formula {
    /* prettylights-syntax-comment */
    color: #6a737d;
  }

  .hljs-name,
  .hljs-quote,
  .hljs-selector-tag,
  .hljs-selector-pseudo {
    /* prettylights-syntax-entity-tag */
    color: #22863a;
  }

  .hljs-subst {
    /* prettylights-syntax-storage-modifier-import */
    color: #24292e;
  }

  .hljs-section {
    /* prettylights-syntax-markup-heading */
    color: #005cc5;
    font-weight: bold;
  }

  .hljs-bullet {
    /* prettylights-syntax-markup-list */
    color: #735c0f;
  }

  .hljs-emphasis {
    /* prettylights-syntax-markup-italic */
    color: #24292e;
    font-style: italic;
  }

  .hljs-strong {
    /* prettylights-syntax-markup-bold */
    color: #24292e;
    font-weight: bold;
  }

  .hljs-addition {
    /* prettylights-syntax-markup-inserted */
    color: #22863a;
    background-color: #f0fff4;
  }

  .hljs-deletion {
    /* prettylights-syntax-markup-deleted */
    color: #b31d28;
    background-color: #ffeef0;
  }

  .hljs-char.escape_,
  .hljs-link,
  .hljs-params,
  .hljs-property,
  .hljs-punctuation,
  .hljs-tag {
    /* purposely ignored */
  }
`;

/** VS Code Light+ / Dark+ colors, split by the classes highlight.js actually emits. */
export const ideStyles = css`
  .file-light .hljs {
    color: #000000;
    background: #ffffff;
  }

  .file-dark .hljs {
    color: #d4d4d4;
    background: transparent;
  }

  .file-light .hljs-keyword,
  .file-light .hljs-title,
  .file-light .hljs-name,
  .file-light .hljs-section,
  .file-light .hljs-doctag,
  .file-light .hljs-selector-tag,
  .file-dark .hljs-keyword,
  .file-dark .hljs-title,
  .file-dark .hljs-name,
  .file-dark .hljs-section,
  .file-dark .hljs-doctag,
  .file-dark .hljs-selector-tag {
    font-weight: normal;
  }

  .file-light .hljs-comment,
  .file-light .hljs-quote {
    color: #008000;
  }

  .file-dark .hljs-comment,
  .file-dark .hljs-quote {
    color: #6a9955;
  }

  .file-light .hljs-keyword,
  .file-light .hljs-meta .hljs-keyword,
  .file-light .hljs-doctag,
  .file-light .hljs-literal,
  .file-light .hljs-variable.language_ {
    color: #0000ff;
  }

  .file-dark .hljs-keyword,
  .file-dark .hljs-meta .hljs-keyword,
  .file-dark .hljs-doctag {
    color: #c586c0;
  }

  .file-dark .hljs-literal,
  .file-dark .hljs-variable.language_ {
    color: #569cd6;
  }

  .file-light .hljs-string,
  .file-light .hljs-meta .hljs-string {
    color: #a31515;
  }

  .file-dark .hljs-string,
  .file-dark .hljs-meta .hljs-string {
    color: #ce9178;
  }

  .file-light .hljs-number {
    color: #098658;
  }

  .file-dark .hljs-number {
    color: #b5cea8;
  }

  .file-light .hljs-regexp,
  .file-light .hljs-char.escape_ {
    color: #811f3f;
  }

  .file-dark .hljs-regexp,
  .file-dark .hljs-char.escape_ {
    color: #d16969;
  }

  .file-light .hljs-title.function_,
  .file-light .hljs-built_in,
  .file-light .hljs-meta {
    color: #795e26;
  }

  .file-dark .hljs-title.function_,
  .file-dark .hljs-built_in,
  .file-dark .hljs-meta {
    color: #dcdcaa;
  }

  .file-light .hljs-title.class_,
  .file-light .hljs-title.class_.inherited__,
  .file-light .hljs-type {
    color: #267f99;
  }

  .file-dark .hljs-title.class_,
  .file-dark .hljs-title.class_.inherited__,
  .file-dark .hljs-type {
    color: #4ec9b0;
  }

  .file-light .hljs-attr,
  .file-light .hljs-attribute,
  .file-light .hljs-variable,
  .file-light .hljs-params,
  .file-light .hljs-property,
  .file-light .hljs-template-variable {
    color: #001080;
  }

  .file-dark .hljs-attr,
  .file-dark .hljs-attribute,
  .file-dark .hljs-variable,
  .file-dark .hljs-params,
  .file-dark .hljs-property,
  .file-dark .hljs-template-variable {
    color: #9cdcfe;
  }

  .file-light .hljs-tag {
    color: #800000;
  }

  .file-light .hljs-tag .hljs-name,
  .file-light .hljs-selector-tag,
  .file-light .hljs-selector-class,
  .file-light .hljs-selector-id,
  .file-light .hljs-selector-attr,
  .file-light .hljs-selector-pseudo {
    color: #800000;
  }

  .file-light .hljs-tag .hljs-attr {
    color: #e50000;
  }

  .file-dark .hljs-tag,
  .file-dark .hljs-punctuation,
  .file-dark .hljs-operator,
  .file-dark .hljs-subst {
    color: #d4d4d4;
  }

  .file-dark .hljs-tag .hljs-name,
  .file-dark .hljs-selector-tag {
    color: #569cd6;
  }

  .file-dark .hljs-tag .hljs-attr,
  .file-dark .hljs-selector-attr,
  .file-dark .hljs-selector-pseudo {
    color: #9cdcfe;
  }

  .file-dark .hljs-selector-class,
  .file-dark .hljs-selector-id {
    color: #d7ba7d;
  }

  .file-light .hljs-operator,
  .file-light .hljs-punctuation,
  .file-light .hljs-subst,
  .file-light .hljs-template-tag {
    color: #000000;
  }

  .file-dark .hljs-template-tag {
    color: #d4d4d4;
  }
`;
