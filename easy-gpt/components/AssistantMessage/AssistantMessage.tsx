import { MessageProps } from "@/types/type";
import "./assistantMessage.css";

const AssistantMessage: React.FC<MessageProps> = ({ message }) => {
  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(message.content);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const renderMarkdown = (text: string): string => {
    const lines = text.split("\n");
  
    let isInCodeBlock = false;
    let html = "";
  
    const escapeHtml = (str: string) =>
      str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  
    const processInline = (line: string) => {
      // Replace **bold**
      line = line.replace(/\*\*(.+?)\*\*/g, `<strong>$1</strong>`);
      // Replace `inline code`
      line = line.replace(/`([^`]+?)`/g, `<code class="inline-code">$1</code>`);
      return line;
    };
  
    for (const line of lines) {
      const trimmed = line.trim();
  
      // Code block (triple backticks)
      if (/^```/.test(trimmed)) {
        if (isInCodeBlock) {
          html += `</code></pre>`;
          isInCodeBlock = false;
        } else {
          isInCodeBlock = true;
          html += `<pre class="code-block"><code>`;
        }
        continue;
      }
  
      if (isInCodeBlock) {
        html += `${escapeHtml(line)}\n`;
        continue;
      }
  
      // ✅ Tip box
      if (/^✅\s*/.test(trimmed)) {
        html += `<div class="tip-box">✅ ${processInline(
          trimmed.replace(/^✅\s*/, "")
        )}</div>`;
        continue;
      }
  
      // ### Heading
      if (trimmed.startsWith("###")) {
        html += `<h3 class="assistant-heading">${processInline(
          trimmed.replace(/^###\s*/, "")
        )}</h3>`;
        continue;
      }
  
      // - **Title**: rest (custom bullet with bold title)
      const bulletMatch = trimmed.match(/^- \*\*(.+?)\*\*:\s*(.+)/);
      if (bulletMatch) {
        const title = bulletMatch[1];
        const content = bulletMatch[2];
        html += `<ul><li class="assistant-paragraph"><h4 class="assistant-subheading">${processInline(
          title
        )}</h4>${processInline(content)}</li></ul>`;
        continue;
      }
  
      // * Bullet point (basic bullet starting with *)
      if (/^\*\s+/.test(trimmed)) {
        const bulletContent = trimmed.replace(/^\*\s+/, "");
        html += `<ul><li class="assistant-paragraph">${processInline(
          bulletContent
        )}</li></ul>`;
        continue;
      }
  
      // One-line code snippet or logic line
      if (/^(\s{2,}|\/\/|const |let |function |return )/.test(trimmed)) {
        html += `<pre class="code-block"><code>${escapeHtml(line)}</code></pre>`;
        continue;
      }
  
      // Normal paragraph
      if (trimmed) {
        html += `<p class="assistant-paragraph">${processInline(line)}</p>`;
      }
    }
  
    // Close any open code blocks
    if (isInCodeBlock) html += "</code></pre>";
  
    return html;
  };
  
  
  return (
    <div className="flex justify-start">
      <div className="max-w-xs lg:max-w-2xl">
        <div className="flex items-start space-x-3">
          {/* Bot icon */}
          {/* <div className="w-8 rounded-full flex items-center justify-center flex-shrink-0">
            <Bot />
          </div> */}

          <div className="text-white px-4 py-2 flex-1">
            <div
              className="text-sm"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(message?.content ?? ""),
              }}
            />
            {message.streaming && (
              <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse" />
            )}
          </div>

          <button
            onClick={copyToClipboard}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy message"
            aria-label="Copy message to clipboard"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* Assistant timestamp details */}
        {/* {message.timestamp && (
          <div className="ml-11 mt-1">
            <span className="text-xs text-gray-500">{message.timestamp}</span>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AssistantMessage;
