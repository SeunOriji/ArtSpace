import { readFile } from "fs/promises";
import path from "path";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { BackLink } from "@/components/legal/back-link";

/** Renders a Markdown file from content/ as a styled legal page. Headings get slug ids for deep links. */
export async function LegalDocument({ file }: { file: string }) {
  const markdown = await readFile(path.join(process.cwd(), "content", file), "utf8");

  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="mb-8">
        <BackLink />
      </div>
      <div className="prose prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-heading prose-a:text-accent hover:prose-a:text-accent-hover prose-strong:text-foreground prose-th:text-foreground">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSlug]}
          // Drops raw HTML, so <!-- comments --> (e.g. internal drafting notes) never reach the page.
          skipHtml
          components={{
            // Wide tables scroll sideways on small screens instead of overflowing the page.
            table: ({ children }) => (
              <div className="overflow-x-auto">
                <table>{children}</table>
              </div>
            ),
          }}
        >
          {markdown}
        </ReactMarkdown>
      </div>
    </article>
  );
}
