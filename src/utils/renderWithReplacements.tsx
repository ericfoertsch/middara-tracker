import React from "react";
import ReactMarkdown from "react-markdown";
import { replacementMap } from "@/utils/replacementMap";
import { renderReplacement } from "@/utils/replacementRenderers";

// Matches :{KEY}: or :{KEY|NUMBER}:
const TOKEN_REGEX = /:\{([^}|]+)(?:\|(\d+))?\}:/g;

/**
 * Takes a raw string, replaces tokens like :{Exhaust}: or :{SP|2}:
 * with corresponding rendered React elements (icons, text, etc).
 */
function replaceTextWithElements(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let counter = 0;

  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    const [fullMatch, key, barNumber] = match;

    // Push preceding text chunk
    if (lastIndex < match.index) {
      parts.push(text.slice(lastIndex, match.index));
    }

    // Render the replacement, if available
    const replacement = replacementMap[key];
    if (replacement) {
      parts.push(
        renderReplacement(replacement, barNumber ?? undefined, `${key}-${counter}`)
      );
    }

    lastIndex = match.index + fullMatch.length;
    counter++;
  }

  // Push any remaining text after the last token
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

/**
 * Recursively traverses ReactMarkdown children
 * and applies text replacements to all text nodes.
 */
function replaceChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return replaceTextWithElements(child);
    }

    if (React.isValidElement(child)) {
      const el = child as React.ReactElement<{ children?: React.ReactNode }>;
      return React.cloneElement(el, {
        children: replaceChildren(el.props.children),
      });
    }

    return child;
  });
}

/**
 * Public entrypoint — call this wherever markdown text
 * with tokens needs to be rendered (e.g., card descriptions).
 */
export function renderWithReplacements(markdown: string) {
  return (
    <ReactMarkdown
      components={{
        p({ children }) {
          return (
            <div className="markdown-paragraph space-y-2">
              {replaceChildren(children)}
            </div>
          );
        },
        li({ children }) {
          return <li className="markdown-li">{replaceChildren(children)}</li>;
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}
