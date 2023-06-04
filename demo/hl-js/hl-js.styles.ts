import { css } from "lit";

export const styles = css`
  .file {
    border-radius: 6px;
    overflow: hidden;
    margin: 1em 0;
  }

  .file-light {
    border: 1px solid #ccc;
  }

  .file-dark {
    border: 1px solid #555;
    background-color: #0d1117;
  }

  .file .file-meta {
    padding: 10px;
    font-size: 12px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial,
      sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  }

  .file .file-meta-light {
    color: #586069;
    background-color: #f7f7f7;
    border-top: 1px solid #ccc;
  }

  .file .file-meta-dark {
    color: #f7f7f7;
    background-color: #586069;
    border-top: 1px solid #555;
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
  }

 
  .file .code-area pre {
    margin: 0;
    padding: 0;
    
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
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
      Liberation Mono, monospace;
    border: 0;
  }

  .file .code-area table.hljs-ln {
    border: 0;
    margin: 0;
  }

  .file .code-area pre code.hljs {
    padding: 0.8em;
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
