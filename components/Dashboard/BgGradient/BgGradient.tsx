import styles from "./BgGradient.module.scss";

const BgGradient = () => {
    return (
        <div className={styles.bgGradient}>
          <svg xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id='goo'>
                <feGaussianBlur in='SourceGraphic' stdDeviation='10' result='blur' />
                <feColorMatrix in='blur' mode='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8' result='goo' />
                <feComposite in='SourceGraphic' in2='goo' />
              </filter>
            </defs>
          </svg>

          <div className={styles.bgGradient__container}>
              <div className={styles.bgGradient__g1}></div>
              <div className={styles.bgGradient__g2}></div>
              <div className={styles.bgGradient__g3}></div>
              <div className={styles.bgGradient__g4}></div>
          </div>
        </div>
    );
};

export default BgGradient;