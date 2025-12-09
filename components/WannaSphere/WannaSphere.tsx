"use client";
import { useEffect, useRef } from "react";
import Output from "./Output";
import styles from "./WannaSphere.module.scss";

const WannaSphere = () => {
  const outputRef = useRef<Output | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    outputRef.current = new Output({
      window,
      targetElement: containerRef.current as HTMLDivElement,
    });
  }, []);

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} className={styles.wanna} />
  );
};

export default WannaSphere;