import { useState } from "react";
import Markdown from "@/components/mamlesh/Markdown";

export interface CodeTab {
  label: string;
  lang: string;
  code: string;
}

/**
 * Tabbed snippets. The body goes back through the shared Markdown renderer so
 * these get exactly the same highlighting and copy button as the docs pages,
 * rather than a second, slightly-different code treatment.
 */
export default function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [i, setI] = useState(0);
  const tab = tabs[i];

  return (
    <div className="mdm-codepanel">
      <div className="mdm-tabs" role="tablist">
        {tabs.map((t, idx) => (
          <button
            key={t.label}
            type="button"
            role="tab"
            aria-selected={idx === i}
            className={`mdm-tab ${idx === i ? "active" : ""}`}
            onClick={() => setI(idx)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Markdown key={tab.label}>{`\`\`\`${tab.lang}\n${tab.code}\n\`\`\``}</Markdown>
    </div>
  );
}
