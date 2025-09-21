import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content?: string }) {
  if (!content) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (props) => <p className="my-4 text-base leading-relaxed text-charcoal/85" {...props} />,
        a: (props) => (
          <a className="text-brand-primary underline-offset-4 hover:underline" {...props} />
        ),
        h3: (props) => <h3 className="mt-8 text-xl font-semibold text-charcoal" {...props} />,
        ul: (props) => <ul className="my-4 list-disc space-y-2 pl-6 text-charcoal/80" {...props} />,
        ol: (props) => <ol className="my-4 list-decimal space-y-2 pl-6 text-charcoal/80" {...props} />,
        li: (props) => <li {...props} />,
        blockquote: (props) => (
          <blockquote className="my-4 border-l-4 border-brand-primary/40 pl-4 italic text-charcoal/80" {...props} />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
