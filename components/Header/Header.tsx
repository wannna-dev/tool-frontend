import styles from "./Header.module.scss";
import Image from "next/image";
const Header = () => {
    return (
        <div className={styles.header}>
            <Image src="/svg/logo.svg" alt="Wanna" width={100} height={13} />
        </div>
    );
};

export default Header;