import { useEffect, useState, useRef } from "react";
import { useChat } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import styles from "./WannaChat.module.scss";
import Image from "next/image";
import Loader from "@/components/Loader/Loader";

const WannaChat = ({ initMessage }: { initMessage: string }) => {
  const [input, setInput] = useState("");
  
  const hasSentInitialMessage = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status, error, stop } = useChat();

  useEffect(() => {
    // Only send if we haven't sent it before
    if (initMessage && initMessage.trim() !== "" && !hasSentInitialMessage.current) {
      hasSentInitialMessage.current = true; // ← Mark as sent
      console.log("initMessage", initMessage);
      sendMessage({
        id: "init-message",
        role: "user",
        parts: [{ type: "text", text: initMessage }]
      });
    }
  }, [initMessage, sendMessage]);

  /* -------------------- 📨 SCROLL TO BOTTOM -------------------- */
  useEffect(() => {
    if (messages.length > 0) {

      const container = messagesContainerRef.current;
      if (!container) return;
      queueMicrotask(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") return;
    sendMessage(
      {
        role: "user",
        parts: [{ type: "text", text: input }],
      }
    );
    setInput("");
  }

  return (
      <div className={styles.wannaChat}>
          <div ref={messagesContainerRef} className={styles.wannaChat__messages}>
              {messages.map((message) => (
                  <div
                  key={message.id}
                  className={`${styles.wannaChat__messages__message} ${
                    message.role === "user"
                      ? styles.wannaChat__messages__message__user
                      : `${styles.wannaChat__messages__message__assistant} ${
                          status === "streaming"
                            ? styles.wannaChat__messages__message__assistant__streaming
                            : ""
                        }`
                  }`}
                >
                  {message.parts.map((part, index) => 
                    part.type === "text" ? (
                      <div
                        key={`${message.id}-${index}`}
                            className={`${styles.wannaChat__messages__message__content} ${
                          message.role === "user"
                            ? styles.wannaChat__messages__message__content__user
                            : styles.wannaChat__messages__message__content__avatar
                        }`}
                      >
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw]}
                          components={{
                            p: ({ children }) => <p className={styles.markdown_paragraph}>{children}</p>,
                            strong: ({ children }) => <strong className={styles.markdown_bold}>{children}</strong>,
                            em: ({ children }) => <em className={styles.markdown_italic}>{children}</em>,
                            code: ({ children }) => <code className={styles.markdown_code}>{children}</code>,
                            pre: ({ children }) => <pre className={styles.markdown_pre}>{children}</pre>,
                            ul: ({ children }) => <ul className={styles.markdown_ul}>{children}</ul>,
                            ol: ({ children }) => <ol className={styles.markdown_ol}>{children}</ol>,
                            li: ({ children }) => <li className={styles.markdown_li}>{children}</li>,
                            h1: ({ children }) => <h1 className={styles.markdown_h1}>{children}</h1>,
                            h2: ({ children }) => <h2 className={styles.markdown_h2}>{children}</h2>,
                            h3: ({ children }) => <h3 className={styles.markdown_h3}>{children}</h3>,
                            a: ({ children, href, node, ...props }) => {
                              // Si es un enlace de experiencia
                              if (props.className === 'experience-link') {                            
                                return (
                                    <a 
                                      href={href} 
                                      className={styles.experience_link}
                                      
                                    >
                                      {children}
                                    </a>
      
                                );
                              }
                              return <a href={href} className={styles.markdown_a}>{children}</a>;
                            },
                          }}
                        >
                          {part.text}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      null
                    )
                  )}
                </div>
              ))}
              {(status === "submitted" || status === "streaming") && (
                <div className={styles.wannaChat__messages__message__loading}>
                  <Loader />
                </div>
              )}
          </div>
          
          <div className={styles.wannaChat__input}>
            <form onSubmit={handleSubmit} className={styles.wannaChat__input__form}>
                <input 
                    className={styles.wannaChat__input__form__input}
                    type="text" 
                    placeholder="Escribe tu mensaje"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={status !== "ready"}
                />
                <div className={styles.wannaChat__input__form__buttons}>
                  {status === "submitted" || status === "streaming" ? (
                    <button type="submit" className={styles.wannaChat__input__form__button} onClick={stop}>
                      <Image src="/svg/pause.svg" alt="Pause" width={32} height={32} />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className={styles.wannaChat__input__form__button}
                      disabled={input.trim() === "" || status !== "ready"}
                    >
                      <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16.6265" cy="16.6265" r="16.6265" fill="transparent" />
                        <path d="M12.8594 18.5374L16.6246 14.627L20.3906 18.5374" stroke="var(--color-black)" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                </div>
            </form>
            <div className={`${styles.wannaChat__input__disclaimer}`}>
              <p className={styles.wannaChat__input__disclaimer__text}>Wanna puede cometer errores. Considera verificar la información importante. Ver preferencias de cookies.</p>
            </div>
          </div>
      </div>
  );
};

export default WannaChat;