"use client";
import styles from "./Presentation.module.scss";
import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";

type CardType = "name" | "birthday" | "location" | "bio";

interface CardProps {
    type: CardType;
    value?: any;
    setValue?: (val: any) => void;
    day?: number | "";
    month?: number | "";
    year?: number | "";
    location?: string | "";
    bio?: string | "";
    setLocation?: (val: string) => void;
    setBio?: (val: string) => void;
    setDay?: (val: number | "") => void;
    setMonth?: (val: number | "") => void;
    setYear?: (val: number | "") => void;
    handleNext: () => void;
}


const Card = ({
    type,
    value,
    setValue,
    day,
    month,
    year,
    location,
    bio,
    setBio,
    setLocation,
    setDay,
    setMonth,
    setYear,
    handleNext
}: CardProps) => {

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleNext();
    };

    return (
        <form className={styles.card} onSubmit={handleSubmit}>
            <div className={styles.card__content}>

                {/* STEP 1 - NAME */}
                {type === "name" && (
                    <>
                        <h1 className={styles.card__content__title}>Hola<br/>¿Cómo te llamas?</h1>

                        <div className={styles.card__content__inputs}>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => setValue?.(e.target.value)}
                                placeholder="Escribe tu nombre"
                                required
                            />
                            <button type="submit" data-type="primary" className={`${styles.card__button}`} disabled={!value}>
                                <Image src="/svg/arrow-right-white.svg" alt="Arrow Right" width={24} height={24} />
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 2 - BIRTHDAY */}
                {type === "birthday" && (
                    <>
                        <h1 className={styles.card__content__title}>Encantado, {value}!<br/>¿Cuándo es tu aniversario?</h1>

                        <div className={styles.card__content__inputs}>
                            <input
                                type="number"
                                placeholder="DD"
                                value={day}
                                min={1}
                                max={31}
                                onChange={(e) =>
                                    setDay?.(e.target.value ? parseInt(e.target.value) : "")
                                }
                                required
                            />

                            <input
                                type="number"
                                placeholder="MM"
                                value={month}
                                min={1}
                                max={12}
                                onChange={(e) =>
                                    setMonth?.(e.target.value ? parseInt(e.target.value) : "")
                                }
                                required
                            />

                            <input
                                type="number"
                                placeholder="YYYY"
                                value={year}
                                min={1900}
                                max={new Date().getFullYear()}
                                onChange={(e) =>
                                    setYear?.(e.target.value ? parseInt(e.target.value) : "")
                                }
                                required
                            />
                            
                            <button type="submit" data-type="primary" className={styles.card__button} disabled={!day || !month || !year}>
                                <Image src="/svg/arrow-right-white.svg" alt="Arrow Right" width={24} height={24} />
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 3 - LOCATION */}
                {type === "location" && (
                    <>
                        <h1 className={styles.card__content__title}>¿Dónde te gustaría localizarte?</h1>
                        <div className={styles.card__content__inputs}>
                            <input
                                type="text"
                                value={location}
                                placeholder="Escribe tu ubicación"
                                onChange={(e) => setLocation?.(e.target.value)}
                                required
                            />
                            <button type="submit" data-type="primary" className={styles.card__button} disabled={!location}>
                                <Image src="/svg/arrow-right-white.svg" alt="Arrow Right" width={24} height={24} />
                            </button>
                        </div>
                    </>
                )}

                {/* STEP 4 - BIO */}
                {type === "bio" && (
                    <>
                        <h1 className={styles.card__content__title}>Algo que quieras contar de ti a la comunidad...</h1>


                        <div className={styles.card__content__textarea}>
                            <div className={styles.card__content__textarea__content}>
                                <textarea
                                    className={styles.card__content__textarea__content__textarea}
                                    maxLength={150}
                                    value={bio}
                                    placeholder="Soy..."
                                    onChange={(e) => setBio?.(e.target.value)}
                                    required
                                />
                                <p className={styles.counter}>{bio?.length}/150</p>
                            </div>
                            <button type="submit" data-type="primary" className={styles.card__button} disabled={!bio}>
                                <Image src="/svg/arrow-right-white.svg" alt="Arrow Right" width={24} height={24} />
                            </button>
                        </div>

                    </>
                )}

            </div>
        </form>
    );
};


const Presentation = () => {
    const [step, setStep] = useState(1);

    // Individual states
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [location, setLocation] = useState("");

    const [day, setDay] = useState<number | "">("");
    const [month, setMonth] = useState<number | "">("");
    const [year, setYear] = useState<number | "">("");

    const handleNext = () => {
        setStep((prev) => prev + 1);
    };

    return (
        <div className={styles.presentation}>
            <Header />

            {/* STEP 1 - NAME */}
            {step === 1 && (
                <Card
                    type="name"
                    value={name}
                    setValue={setName}
                    handleNext={handleNext}
                />
            )}

            {/* STEP 2 - BIRTHDAY */}
            {step === 2 && (
                <Card
                    type="birthday"
                    value={name} // para mostrar "Encantado, X"
                    day={day}
                    month={month}
                    year={year}
                    setDay={setDay}
                    setMonth={setMonth}
                    setYear={setYear}
                    handleNext={handleNext}
                />
            )}

            {/* STEP 3 - LOCATION */}
            {step === 3 && (
                <Card
                    type="location"
                    location={location}
                    setLocation={setLocation}
                    handleNext={handleNext}
                />
            )}

            {/* STEP 4 - BIO */}
            {step === 4 && (
                <Card
                    type="bio"
                    bio={bio}
                    setBio={setBio}
                    handleNext={handleNext}
                />
            )}

            <Image className={styles.presentation__image} src="/images/presentation.png" alt="Presentation" width={382} height={382} />

        </div>
    );
};

export default Presentation;
