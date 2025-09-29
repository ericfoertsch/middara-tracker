import React from "react";
import ReactMarkdown from "react-markdown";
import { replacementMap, type ReplacementType } from "@/utils/replacements";

function replaceTextWithElements(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let i = 0;

  // Matches :{KEY|NUMBER}: or :{KEY}:
  const regex = /:\{([^}|]+)(?:\|(\d+))?\}:/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, key, barNumber] = match;

    // Push text before the match
    if (lastIndex < match.index) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const replacement: ReplacementType | undefined = replacementMap[key];

    if (replacement) {
      switch (replacement.type) {
        case "icon":
          parts.push(<span key={`icon-${i}`}>{replacement.element}</span>);
          break;
        case "text":
          parts.push(
            <span
              key={`text-${i}`}
              className={replacement.tooltip ? "underline decoration-dotted cursor-help" : ""}
              title={replacement.tooltip}
            >
              {replacement.label}
            </span>
          );
          break;
        case "bar":
          parts.push(
            <span key={`bar-${i}`} className="inline-flex items-center bg-gray-800 text-white px-2 rounded">
              {replacement.label}
              {barNumber && <span className="ml-1 font-bold">{barNumber}</span>}
            </span>
          );
          break;
      }
    }
    // If no replacement, skip output entirely

    lastIndex = match.index + fullMatch.length;
    i++;
  }

  // Push remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

// Recursive replacement for React children
function replaceChildren(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return replaceTextWithElements(child);
    }

    if (React.isValidElement(child)) {
      const el = child as React.ReactElement<React.PropsWithChildren<unknown>>;
      return React.cloneElement(el, {
        children: replaceChildren(el.props.children),
      });
    }

    return child;
  });
}

export function renderWithReplacements(markdown: string) {
  return (
    <ReactMarkdown
      components={{
        p({ children }) {
          return <div className="markdown-paragraph">{replaceChildren(children)}</div>;
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
