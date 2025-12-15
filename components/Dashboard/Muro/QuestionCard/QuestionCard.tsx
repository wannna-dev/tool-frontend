import styles from "./QuestionCard.module.scss";
import { QuestionType } from "@/types/question";

const QuestionCard = ({ question }: { question: QuestionType }) => {
    return (
        <div className={styles.questionCard}>
            <p>{question.text}</p>
        </div>
    );
};

export default QuestionCard;