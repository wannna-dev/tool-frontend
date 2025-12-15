import styles from "./EditProfile.module.scss";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { PostType } from "@/types/post";

interface UserProfileType {
  id: string;
  username: string;
  avatar_url: string;
  full_name: string;
  bio: string;
  date_of_birth: string;
  location: string;
  picture: string;
  posts: PostType[];
}

interface EditProfileProps {
  userProfile: UserProfileType;
  setIsEditingProfile: (isEditingProfile: boolean) => void;
  onSave?: (updatedProfile: Partial<UserProfileType>) => Promise<void>;
}

const EditProfile = ({ 
  userProfile, 
  setIsEditingProfile,
  onSave 
}: EditProfileProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local state for form data
  const [formData, setFormData] = useState({
    username: userProfile.username,
    full_name: userProfile.full_name,
    bio: userProfile.bio || "",
  });
  
  const [profileImage, setProfileImage] = useState<string>(
    userProfile.picture || "/images/empty-profile.png"
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Track if form has unsaved changes
  useEffect(() => {
    const hasFormChanges = 
      formData.username !== userProfile.username ||
      formData.full_name !== userProfile.full_name ||
      formData.bio !== (userProfile.bio || "") ||
      selectedFile !== null;
    
    setHasChanges(hasFormChanges);
  }, [formData, selectedFile, userProfile]);

  const handleClose = () => {
    if (hasChanges) {
      const confirmClose = window.confirm(
        "Tienes cambios sin guardar. ¿Estás seguro de que quieres cerrar?"
      );
      if (!confirmClose) return;
    }
    setIsEditingProfile(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ 
        ...prev, 
        image: "Por favor, selecciona un archivo de imagen válido" 
      }));
      return;
    }

    // Validate file size (e.g., max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors((prev) => ({ 
        ...prev, 
        image: "La imagen no puede superar los 5MB" 
      }));
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear any previous image errors
    if (errors.image) {
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido";
    } else if (formData.username.length < 3) {
      newErrors.username = "El nombre de usuario debe tener al menos 3 caracteres";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = "Solo se permiten letras, números y guiones bajos";
    }

    if (!formData.full_name.trim()) {
      newErrors.full_name = "El nombre es requerido";
    }

    if (formData.bio.length > 150) {
      newErrors.bio = "La biografía no puede superar los 150 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updates: Partial<UserProfileType> = {
        username: formData.username,
        full_name: formData.full_name,
        bio: formData.bio,
      };

      // If there's a callback for saving, call it
      if (onSave) {
        await onSave(updates);
      }

      // TODO: Handle image upload separately if needed
      if (selectedFile) {
        console.log("Image to upload:", selectedFile);
        // await uploadProfileImage(selectedFile);
      }

      setIsEditingProfile(false);
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        submit: "Error al guardar los cambios. Por favor, inténtalo de nuevo.",
      }));
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [hasChanges]);

  return (
    <div className={styles.edit}>
      <div 
        className={styles.edit__bg} 
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className={styles.edit__modal} role="dialog" aria-labelledby="edit-profile-title">
        <div className={styles.edit__modal__header}>
          <button 
            onClick={handleClose} 
            aria-label="Cerrar modal de edición"
            disabled={isLoading}
          >
            <Image src="/svg/close.svg" alt="" width={16} height={16} />
          </button>
        </div>

        <div className={styles.edit__modal__content}>
          <div 
            className={styles.edit__modal__content__image} 
            onClick={handleImageClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick();
              }
            }}
            aria-label="Cambiar foto de perfil"
          >
            <Image
              className={styles.edit__modal__content__image__img}
              src={profileImage}
              alt={formData.full_name || "Imagen de perfil"}
              width={100}
              height={100}
            />
            <Image
              className={styles.edit__modal__content__image__camera}
              src="/svg/camera.svg"
              alt=""
              width={35}
              height={35}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
              disabled={isLoading}
              aria-label="Seleccionar imagen de perfil"
            />
          </div>
          {errors.image && (
            <p className={styles.error} role="alert">{errors.image}</p>
          )}

          <form className={styles.edit__modal__content__form} onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}>
            <div className={styles.edit__modal__content__form__item}>
              <label htmlFor="username">Nombre de usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.username}
                aria-describedby={errors.username ? "username-error" : undefined}
              />
              {errors.username && (
                <p id="username-error" className={styles.error} role="alert">
                  {errors.username}
                </p>
              )}
            </div>

            <div className={styles.edit__modal__content__form__item}>
              <label htmlFor="full_name">
                ¿Cómo te gustaría que te llamara Wanna?
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                placeholder="Nombre"
                value={formData.full_name}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.full_name}
                aria-describedby={errors.full_name ? "name-error" : undefined}
              />
              {errors.full_name && (
                <p id="name-error" className={styles.error} role="alert">
                  {errors.full_name}
                </p>
              )}
            </div>

            <div className={styles.edit__modal__content__form__item}>
              <label htmlFor="bio">BIO</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Bio"
                maxLength={150}
                value={formData.bio}
                onChange={handleChange}
                disabled={isLoading}
                aria-invalid={!!errors.bio}
                aria-describedby="bio-counter"
              />
              <p 
                id="bio-counter"
                className={styles.edit__modal__content__form__item__counter}
                aria-live="polite"
              >
                {formData.bio.length}/150
              </p>
              {errors.bio && (
                <p className={styles.error} role="alert">{errors.bio}</p>
              )}
            </div>

            {errors.submit && (
              <p className={styles.error} role="alert">{errors.submit}</p>
            )}

            <div className={styles.edit__modal__content__form__button}>
              <button 
                type="submit"
                data-type="secondary"
                disabled={isLoading || !hasChanges}
              >
                {isLoading ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;