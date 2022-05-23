import cx from 'classnames';
import styles from './BingoCard.module.scss';

const BingoCard = ({ title, onClick, checked, isCardWon, idx }) => {
  return (
    <div
      className={cx(styles.card, {
        [styles.checked]: checked,
        [styles.card_win]: isCardWon,
        [styles.free_slot]: idx === 12
      })}
      onClick={onClick}
    >
      <span>{title}</span>
    </div>
  );
};

export default BingoCard;
