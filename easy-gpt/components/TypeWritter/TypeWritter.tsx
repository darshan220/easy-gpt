import React, { JSX, useEffect, useState } from "react";

type Block = {
  id: string; // unique id for React key
  tag: string;
  text: string;
  className?: string;
};

export const TypewriterEffect = ({
  blocks,
  speed,
}: {
  blocks: Block[];
  speed: number;
}) => {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [visibleBlocks, setVisibleBlocks] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // Reset typing state when new blocks arrive
    setCurrentBlockIndex(0);
    setTypedText("");
    setVisibleBlocks([]);
  }, [blocks]); // re-run if blocks change

  useEffect(() => {
    if (currentBlockIndex >= blocks.length) return;

    const { id, tag, text, className } = blocks[currentBlockIndex];
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeNextChar = () => {
      if (charIndex <= text.length) {
        setTypedText(text.slice(0, charIndex));
        charIndex++;
        timeoutId = setTimeout(typeNextChar, speed);
      } else {
        // block done: add to visible
        setVisibleBlocks((prev) => [
          ...prev,
          React.createElement(tag, { key: id, className }, text),
        ]);
        setTypedText("");
        setCurrentBlockIndex((prev) => prev + 1);
      }
    };

    typeNextChar();
    return () => clearTimeout(timeoutId);
  }, [currentBlockIndex, blocks, speed]);

  const currentBlock = blocks[currentBlockIndex];

  return (
    <div className="typewriter-text space-y-2">
      {visibleBlocks}
      {currentBlock && (
        React.createElement(
          currentBlock.tag,
          { key: currentBlock.id, className: currentBlock.className },
          typedText
        )
      )}
    </div>
  );
};
