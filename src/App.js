import { useEffect, useState, useRef } from 'react';
import { useReward } from 'react-rewards';
import BingoCard from './components/BingoCard';
import styles from './App.module.scss';
import shuffle from './utils/shuffleArray';
import { confTopicData, range } from './utils/constants';

const shuffledData = shuffle(confTopicData);

const App = () => {
  const [checked, setChecked] = useState({ 12: true });
  const [winingCards, setWiningCards] = useState({});
  const [bingos, setBingos] = useState(localStorage.getItem('bingos') || 0);

  const data = [...shuffledData.slice(0, 12), 'CONF CALL BINGO', ...shuffledData.slice(12)];

  const { reward } = useReward('rewardId', 'emoji', {
    emoji: ['🎧', '💻', '👨‍🚀'],
    elementSize: 44,
    elementCount: 40,
    lifetime: 600
  });
  const ref = useRef({
    winingCardLength: 0
  });

  useEffect(() => {
    if (ref.current.winingCardLength < Object.keys(winingCards).length) {
      setBingos((bingos) => parseInt(bingos) + 1);
      reward();
    }
    ref.current.winingCardLength = Object.keys(winingCards).length;
  }, [Object.keys(winingCards).length]);

  useEffect(() => {
    localStorage.setItem('bingos', bingos);
  }, [bingos]);

  const isWin = (data) => {
    const isRow = range
      .filter((row) => range.every((value) => data[row * 5 + value]))
      .map((row) => range.map((value) => row * 5 + value));
    const isColumn = range
      .filter((column) => range.every((value) => data[column + value * 5]))
      .map((column) => range.map((value) => column + value * 5));
    const isDiagonal1 = range.every((value) => data[value * 6]);
    const isDiagonal2 = range.every((value) => data[value * 4 + 4]);

    const winingCardsArray = [
      ...(isRow.length ? isRow : []),
      ...(isColumn.length ? isColumn : []),
      ...(isDiagonal1 ? [range.map((value) => value * 6)] : []),
      ...(isDiagonal2 ? [range.map((value) => value * 4 + 4)] : [])
    ];

    setWiningCards(Object.assign({}, winingCardsArray));
  };

  const isCardWon = (id) =>
    Object.values(winingCards).some((winingCards) => winingCards.includes(id));

  const toggleCard = (id) => {
    const newChecked = {
      ...checked,
      [id]: !checked[id]
    };
    isWin(newChecked);
    setChecked(newChecked);
  };

  const handleClickCard = (idx) => (idx !== 12 ? toggleCard(idx) : () => {});

  return (
    <div id="rewardId" className={styles.app}>
      <div className={styles.multiple_win}>
        <span>Bingos :</span>
        <span>{bingos}</span>
      </div>
      <div className={styles.title}>
        <h1>
          Bingo<span>Conference Call</span>
        </h1>
      </div>

      <div className={styles.wrapper}>
        {data.map((title, idx) => (
          <BingoCard
            key={idx}
            title={title}
            onClick={() => handleClickCard(idx)}
            checked={checked[idx]}
            isCardWon={isCardWon(idx)}
            idx={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
