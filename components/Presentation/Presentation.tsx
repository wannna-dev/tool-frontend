"use client";
import styles from "./Presentation.module.scss";
import { useState, useRef } from "react";
import Image from "next/image";
import Header from "@/components/Header/Header";
import { UserType } from "@/types/user";
import { createClient } from "@/utils/supabase/client";


type CardType = "name" | "username" | "birthday" | "location" | "bio" | "image";

interface CardProps {
    type: CardType;
    value?: string;
    setValue?: (val: string) => void;
    day?: number | "";
    month?: number | "";
    year?: number | "";
    location?: string | "";
    bio?: string | "";
    image?: string | "";
    setImage?: (val: string) => void;
    setLocation?: (val: string) => void;
    setBio?: (val: string) => void;
    setDay?: (val: number | "") => void;
    setMonth?: (val: number | "") => void;
    setYear?: (val: number | "") => void;
    handleNext: () => void;
    setImageFile?: (val: File | null) => void;
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
    image,
    setImage,
    setBio,
    setLocation,
    setDay,
    setMonth,
    setYear,
    setImageFile,
    handleNext
}: CardProps) => {

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

                {/* STEP 2 - USERNAME */}
                {type === "username" && (
                    <>
                        <h1 className={styles.card__content__title}>¿Cual quieres que sea tu username?</h1>
                        <div className={styles.card__content__inputs}>
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => {
                                    const sanitized = e.target.value.replace(/\s+/g, "");
                                    setValue?.(sanitized);
                                }}
                                placeholder="Escribe tu username"
                                required
                            />
                            <button
                                type="submit"
                                data-type="primary"
                                className={styles.card__button}
                                disabled={!value}
                            >
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

                {/* STEP 5 - IMAGE */}
                {type === "image" && (
                    <>
                        <h1 className={styles.card__content__title}>¿Cuál es tu imagen de perfil?</h1>
                        <div className={styles.card__content__inputs}>
                            {/* Hidden file input */}
                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setImageFile?.(file);
                                        setImage?.(URL.createObjectURL(file));
                                        // Create preview URL
                                        const previewUrl = URL.createObjectURL(file);
                                        setImagePreview?.(previewUrl);
                                    }
                                }} 
                            />
                            
                            {/* Clickable image preview */}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={styles.card__content__inputs__image}
                            >
                                {imagePreview ? (
                                    <Image 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        width={500}
                                        height={500}
                                        style={{
                                            objectFit: 'cover'
                                        }}
                                    />
                                ) : (
                                    <span style={{ color: '#999', textAlign: 'center' }}>
                                        Click para<br/>seleccionar imagen
                                    </span>
                                )}
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            data-type="primary" 
                            className={styles.card__button} 
                            disabled={!image}
                        >
                            <Image src="/svg/arrow-right-white.svg" alt="Arrow Right" width={24} height={24} />
                        </button>
                    </>
                )}

            </div>
        </form>
    );
};


const Presentation = ({ user }: { user: UserType }) => {
    const [step, setStep] = useState(1);

    // Individual states
    const [name, setName] = useState(user?.full_name);
    const [bio, setBio] = useState(user?.bio);
    const [location, setLocation] = useState(user?.location);
    const [username, setUsername] = useState(user?.username);
    const [image, setImage] = useState(user?.picture);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [day, setDay] = useState<number | "">("");
    const [month, setMonth] = useState<number | "">("");
    const [year, setYear] = useState<number | "">("");

    const handleNext = async () => {
        // If it's the LAST step → update profile
        if (step === 6) {

            let uploadedImageUrl = image;

            if (image) {
                // upload to s3
                const formData = new FormData();
                formData.append("file", imageFile as File);
                formData.append("folder", "profiles");
                const res = await fetch("/api/s3-upload", {
                    method: "POST",
                    body: formData
                });
                const data = await res.json();
                console.log("🚀 data:", data);
                if (data.success) {
                    uploadedImageUrl = data.url;
                } else {
                    console.error("❌ Error uploading image:", data.error);
                    return;
                }
            }

            // upload to supabase storage
            const supabase = createClient();
            const date_of_birth =
                year && month && day
                    ? `${year.toString().padStart(4, "0")}-${month
                        .toString()
                        .padStart(2, "0")}-${day
                        .toString()
                        .padStart(2, "0")}`
                    : null;

            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: name,
                    bio: bio,
                    location: location,
                    date_of_birth: date_of_birth,
                    username: username,
                    picture: uploadedImageUrl,
                })
                .eq("id", user.id);

            if (error) {
                console.error("❌ Error updating profile:", error);
                return;
            }

            console.log("✅ Profile updated!");

            // OPTIONAL: redirect to dashboard
            window.location.href = "/";
            return;
        }
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

            {/* STEP 2 - USERNAME */}
            {step === 2 && (
                <Card
                    type="username"
                    value={username}
                    setValue={setUsername}
                    handleNext={handleNext}
                />
            )}

            {/* STEP 2 - BIRTHDAY */}
            {step === 3 && (
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

            {/* STEP 4 - LOCATION */}
            {step === 4 && (
                <Card
                    type="location"
                    location={location}
                    setLocation={setLocation}
                    handleNext={handleNext}
                />
            )}

            {/* STEP 5 - BIO */}
            {step === 5 && (
                <Card
                    type="bio"
                    bio={bio}
                    setBio={setBio}
                    handleNext={handleNext}
                />
            )}

            {/* STEP 6 - IMAGE */}
            {step === 6 && (
                <Card
                    type="image"
                    image={image}
                    setImage={setImage}
                    setImageFile={setImageFile}
                    handleNext={handleNext}
                />
            )}

            {step !== 6 && (
                <Image className={styles.presentation__image} src="/images/presentation.png" alt="Presentation" width={382} height={382} />
            )}

        </div>
    );
};

export default Presentation;
