import GithubSlugger from "github-slugger";

export interface DocHeading {
  id: string;
  depth: number; // 1-6
  text: string;
  children: DocHeading[];
}

/**
 * Pulls `#`..`###` headings out of raw markdown, skipping fenced code blocks
 * (docs/sdk.md has `#`-prefixed comments inside ```python examples that are
 * not headings). Ids are generated with the same slugger rehype-slug uses
 * internally, so they match the ids actually rendered onto the page.
 */
export function extractHeadings(
  markdown: string,
  maxDepth = 3,
  minDepth = 1
): DocHeading[] {
  const slugger = new GithubSlugger();
  const flat: { depth: number; text: string; id: string }[] = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{1,6})\s+(.*)$/.exec(line.trim());
    if (!match) continue;

    const depth = match[1].length;
    const text = match[2].replace(/`/g, "").trim();
    // Ids must be generated for every heading rehype-slug will see (even
    // ones below minDepth), or the slug counter used for de-duplicating
    // repeated headings drifts out of sync with what's actually rendered.
    const id = slugger.slug(text || " ");
    if (!text || depth > maxDepth || depth < minDepth) continue;

    flat.push({ depth, text, id });
  }

  // Nest depth-3 (and deeper) headings under the nearest shallower one.
  const roots: DocHeading[] = [];
  const stack: DocHeading[] = [];

  for (const h of flat) {
    const node: DocHeading = { ...h, children: [] };
    while (stack.length && stack[stack.length - 1].depth >= node.depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  return roots;
}

/**
 * Drops a top-level heading (matched case-insensitively) and everything
 * under it, up to the next heading of the same or shallower depth. Used to
 * remove a manual "## Contents" index from the source doc — the site
 * already renders real sidebar + on-page navigation, so an inline link list
 * would just repeat it.
 */
export function stripSection(markdown: string, headingText: string): string {
  const lines = markdown.split("\n");
  const out: string[] = [];
  let skipping = false;
  let skipDepth = 0;
  let inFence = false;

  for (const line of lines) {
    const fenceToggled = /^\s*```/.test(line);
    const headingMatch = !inFence && !fenceToggled ? /^(#{1,6})\s+(.*)$/.exec(line.trim()) : null;

    if (headingMatch) {
      const depth = headingMatch[1].length;
      const text = headingMatch[2].replace(/`/g, "").trim();

      if (skipping) {
        if (depth <= skipDepth) {
          skipping = false;
        } else {
          continue;
        }
      }
      if (!skipping && text.toLowerCase() === headingText.toLowerCase()) {
        skipping = true;
        skipDepth = depth;
        continue;
      }
    } else if (skipping) {
      continue;
    }

    if (fenceToggled) inFence = !inFence;
    out.push(line);
  }

  return out.join("\n");
}
