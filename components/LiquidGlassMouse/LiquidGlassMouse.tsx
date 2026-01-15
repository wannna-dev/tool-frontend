"use client";
import { CSSProperties, ReactNode, useState, useEffect, useRef } from "react";
import {
  getDisplacementFilter,
  DisplacementOptions,
} from "./getDisplacementFilter";
import { getDisplacementMap } from "./getDisplacementMap";
import styles from "./GlassElement.module.scss";

type GlassElementProps = DisplacementOptions & {
  children?: ReactNode | undefined;
  blur?: number;
  debug?: boolean;
};

export const GlassElement = ({
  height,
  width,
  depth: baseDepth,
  radius,
  children,
  strength,
  chromaticAberration,
  blur = 2,
  debug = false,
}: GlassElementProps) => {
  const [clicked, setClicked] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 }); // start offscreen
  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const depth = baseDepth / (clicked ? 0.7 : 1);

  // Track mouse
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsMoving(true);

      // Clear previous timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Set timer to detect stop
      timeoutRef.current = setTimeout(() => {
        setIsMoving(false);
      }, 10); // 150ms after last move, considered stopped
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const style: CSSProperties = {
    height: isMoving ? `${height}px` : "0px",
    width: isMoving ? `${width}px` : "0px",
    borderRadius: `${radius}px`,
    position: "fixed",
    zIndex: 1000,
    left: `${mousePos.x}px`,
    top: `${mousePos.y}px`,
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
    backdropFilter: `blur(${blur / 2}px) url('${getDisplacementFilter({
      height,
      width,
      radius,
      depth,
      strength,
      chromaticAberration,
    })}') blur(${blur}px) brightness(1) saturate(1)`,
    transition: "width 1s ease, height 1s ease",
  };

  if (debug) {
    style.background = `url("${getDisplacementMap({
      height,
      width,
      radius,
      depth,
    })}")`;
    style.boxShadow = "none";
  }

  return (
    <div
      className={styles.box}
      style={style}
      onMouseDown={() => setClicked(true)}
      onMouseUp={() => setClicked(false)}
    >
      {children}
    </div>
  );
};
