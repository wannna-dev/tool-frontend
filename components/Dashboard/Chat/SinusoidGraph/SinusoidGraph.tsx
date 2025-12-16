"use client";

import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import styles from "./SinusoidGraph.module.scss";
import { MoodType } from "@/types/mood";
import { useAppContext } from "@/context/AppContext";

// Define wave parameters for each mood using musical notes
const moodConfigs: Record<MoodType, { note: string; amplitude: number }> = {
  resueno: { note: "C2", amplitude: 40 },    // Deep, resonant (65.41 Hz)
  enseno: { note: "G3", amplitude: 35 },     // Calm, educational (196 Hz)
  emociona: { note: "C4", amplitude: 50 },   // Exciting, energetic (261.63 Hz)
  alegra: { note: "E4", amplitude: 45 },     // Joyful, upbeat (329.63 Hz)
};

// Convert note to Hz for visual parameters
const noteToHz = (note: string): number => {
  return Tone.Frequency(note).toFrequency();
};

// Convert Hz to visual parameters
const hzToVisualParams = (hz: number) => {
  const visualFrequency = (hz / 10) * 1.2;
  const animationSpeed = 0.01 + (hz / 200) * 0.05;
  
  return {
    frequency: visualFrequency,
    speed: animationSpeed,
  };
};

// Lerp function
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

const SinusoidGraph = () => {

  const { mood } = useAppContext();

  const pathRef1 = useRef<SVGPathElement>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const isAudioStartedRef = useRef(false);
  
  // Get initial config
  const initialConfig = moodConfigs[mood];
  const initialHz = noteToHz(initialConfig.note);
  const initialParams = hzToVisualParams(initialHz);
  
  // Current animated values
  const currentValues = useRef({
    frequency: initialParams.frequency,
    speed: initialParams.speed,
    amplitude: initialConfig.amplitude,
  });

  // Target values based on mood
  const [targetValues, setTargetValues] = useState({
    frequency: initialParams.frequency,
    speed: initialParams.speed,
    amplitude: initialConfig.amplitude,
  });

  // Initialize Tone.js synth
  useEffect(() => {
    // Create synth with triangle oscillator and envelope for pip sound
    synthRef.current = new Tone.Synth({
      oscillator: {
        type: "triangle",
        partialCount: 0,
        phase: 0,
      },
      envelope: {
        attack: 0.005,  // Quick attack for pip
        decay: 0.1,
        sustain: 0.3,
        release: 0.1,   // Quick release for pip
      },
      volume: 0,
    }).toDestination();

    return () => {
      // Cleanup
      if (synthRef.current) {
        synthRef.current.dispose();
      }
    };
  }, []);

  // Play pip sound when mood changes
  useEffect(() => {
    const playPip = async () => {
      if (!synthRef.current) return;

      const config = moodConfigs[mood];
      
      // Start Tone.js context on first interaction (required by browsers)
      if (!isAudioStartedRef.current) {
        await Tone.start();
        isAudioStartedRef.current = true;
      }

      // Play a short pip sound with the note
      synthRef.current.triggerAttackRelease(config.note, "8n");
    };

    playPip();

    const config = moodConfigs[mood];
    const hz = noteToHz(config.note);
    const params = hzToVisualParams(hz);
    
    setTimeout(() => {
      setTargetValues({
        frequency: params.frequency,
        speed: params.speed,
        amplitude: config.amplitude,
      });
    }, 100);
  }, [mood]);

  useEffect(() => {
    const generateSinePath = (amplitude: number, frequency: number, phase: number) => {
      const width = 800;
      const height = 200;
      const points = 2000;
      let path = `M 0 ${height / 2}`;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * width;
        const y = height / 2 + amplitude * Math.sin((i / points) * frequency * Math.PI * 2 + phase);
        path += ` L ${x} ${y}`;
      }

      return path;
    };

    let animationFrame: number;
    let phase1 = 0;
    const lerpFactor = 0.05;

    const animate = () => {
      currentValues.current.frequency = lerp(
        currentValues.current.frequency,
        targetValues.frequency,
        lerpFactor
      );
      currentValues.current.speed = lerp(
        currentValues.current.speed,
        targetValues.speed,
        lerpFactor
      );
      currentValues.current.amplitude = lerp(
        currentValues.current.amplitude,
        targetValues.amplitude,
        lerpFactor
      );

      phase1 += currentValues.current.speed;

      if (pathRef1.current) {
        pathRef1.current.setAttribute(
          "d",
          generateSinePath(
            currentValues.current.amplitude,
            currentValues.current.frequency,
            phase1
          )
        );
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [targetValues]);

  return (
    <div className={styles.sinusoidGraph}>
      <svg
        viewBox="0 0 800 200"
        className={styles.svg}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="15%" stopColor="white" stopOpacity="1" />
            <stop offset="85%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          
          <mask id="fadeMask">
            <rect x="0" y="0" width="800" height="200" fill="url(#fadeGradient)" />
          </mask>
        </defs>

        <g mask="url(#fadeMask)">
          <line x1="0" y1="100" x2="800" y2="100" className={styles.gridLine} />
          <path ref={pathRef1} className={styles.wave1} />
        </g>
      </svg>
    </div>
  );
};

export default SinusoidGraph;