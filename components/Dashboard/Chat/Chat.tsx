"use client";

import styles from "./Chat.module.scss";
import { useAppContext } from "@/context/AppContext";
import SinusoidGraph from "./SinusoidGraph/SinusoidGraph";
import { useState, useRef } from "react";
import Image from "next/image";
import { MoodType } from "@/types/mood";


// Map mood to color
const moodColors: { [key: string]: string } = {
    'resueno': '#FF00BB',
    'emociona': '#3C66F5',
    'enseno': '#0DEAF5',
    'alegra': '#E8E807'
};

const Chat = () => {
    const { user, mood, setMood } = useAppContext();
    const [showMoods, setShowMoods] = useState(false);
    const editableRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        // You can handle the content here if needed
        if (editableRef.current) {
            const content = editableRef.current.innerText;
            console.log(content);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Optional: Handle specific keys like Enter + Shift for line breaks
        // or Enter alone to submit
        if (e.key === 'Enter' && !e.shiftKey) {
            // e.preventDefault(); // Uncomment to prevent new line on Enter
            // Submit logic here
        }
    };

    const handleMood = (mood: string) => {
        console.log(mood);
        
        
        
        // Update CSS variable
        if (moodColors[mood]) {
            document.documentElement.style.setProperty('--color-main', moodColors[mood]);
        }
        setMood(mood as MoodType);
        setShowMoods(false);
    };
    
    return (
        <div className={styles.chat}>
            <div className={styles.chat__container}>
                <div className={styles.chat__header}>
                    <h1 className={styles.chat__header__title}>Hey {user?.full_name},</h1>
                    <h1 className={styles.chat__header__title}>¿Cómo te va la vida?</h1>
                </div>

                <div className={styles.chat__input}>
                    <div
                        ref={editableRef}
                        className={styles.chat__input__editable}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        data-placeholder="Cuentame..."
                    />

                    <div className={styles.chat__input__buttons}>
                        {/* Moods */}
                        <div className={styles.chat__input__buttons__moods}>
                            <button className={styles.chat__input__buttons__moods__button} data-variant="icon" onClick={() => setShowMoods(!showMoods)}>
                                <svg className={styles.chat__input__buttons__moods__button__icon} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke={ mood ? moodColors[mood] : "#FF00BB"} d="M3 12H7.3406C7.74063 12 8.10217 12.2384 8.25975 12.6061L10.8435 18.6348C10.9384 18.8563 11.1563 19 11.3974 19C11.7302 19 12 18.7302 12 18.3974V5.60262C12 5.2698 12.2698 5 12.6026 5C12.8437 5 13.0616 5.14367 13.1565 5.36526L15.7399 11.3939C15.8975 11.7616 16.259 12 16.6591 12H20.9996" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>

                            {showMoods && (
                                <div className={styles.chat__input__buttons__moods__buttons}>
                                    <button data-variant="icon" className={styles.chat__input__buttons__moods__buttons__button} onClick={() => handleMood("resueno")}>Me siento empático</button>
                                    <button data-variant="icon" className={styles.chat__input__buttons__moods__buttons__button} onClick={() => handleMood("emociona")}>Me siento sensible</button>
                                    <button data-variant="icon" className={styles.chat__input__buttons__moods__buttons__button} onClick={() => handleMood("enseno")}>Me siento receptivo</button>
                                    <button data-variant="icon" className={styles.chat__input__buttons__moods__buttons__button} onClick={() => handleMood("alegra")}>Me siento juguetón</button>
                                </div>
                            )}
                        </div>

                        {/* Microhpone */}
                        <button className={styles.chat__input__buttons__button} data-variant="icon">
                            <Image src="/svg/microphone.svg" alt="microphone" width={24} height={24} />
                        </button>
                    </div>
                </div>

                <div className={styles.chat__graph}>
                    <SinusoidGraph />
                </div>
            </div>
        </div>
    );
};

export default Chat;