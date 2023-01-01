import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import React, {useEffect, useRef, useState} from "react";
import useSWR from "swr";
import {getItemById, getRandomItem} from "@/common/utils/array.utils";
import {styled} from "@mui/material/styles";
const fetcher = (url) => fetch(url).then((res) => res.json());

// sounds
// @ts-ignore
import errorTrack from './sounds/error.ogg';
// @ts-ignore
import successTrack from './sounds/success.ogg';
import {randomIntFromInterval} from "@/common/utils/number.utils";
import axios from "axios";

const CssTextField = styled(TextField)({
  '&.success .MuiOutlinedInput-root': {
    '& input': {
      color: 'green',
    },
    '& fieldset': {
      borderColor: 'green',
    },
    '&:hover fieldset': {
      borderColor: 'green',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'green',
    },
  },
  '&.error .MuiOutlinedInput-root': {
    '& input': {
      color: 'red',
    },
    '& fieldset': {
      borderColor: 'red',
    },
    '&:hover fieldset': {
      borderColor: 'red',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'red',
    },
  },
});

enum Status {
  PLAY,
  SUCCESS,
  ERROR,
}

interface PlayProps {
  category: number,
}

const Play: React.FC<PlayProps> = ({ category }): JSX.Element => {
  const { data, error, isLoading, mutate } = useSWR(`/api/get-words?category=${category}&not_complete=true`, fetcher);
  const [userAnswer, setUserAnswer] = useState('');
  const [status, setStatus] = useState(Status.PLAY);
  const [showWord, setShowWord] = useState(null);
  const [countError, setCountError] = useState(0);

  const errorPlayer = useRef<HTMLAudioElement | undefined>(
      typeof Audio !== "undefined" ? new Audio(errorTrack) : undefined
  );
  const successPlayer = useRef<HTMLAudioElement | undefined>(
      typeof Audio !== "undefined" ? new Audio(successTrack) : undefined
  );


  // Выбор слова
  const selectWord = () => {
    if(!data) return  null;
    // Фильтруем те у которых есть повторы
    const filteredData = data.filter((word) => word.repeats > 0);

    setStatus(Status.PLAY);
    setUserAnswer('');
    setCountError(0);

    const random = randomIntFromInterval(1, 6);
    if(random > 3) {
      // Меняем местами вопрос с ответом
      const word = {...getRandomItem(filteredData)};
      const answer = word.answer;
      word.answer = word.question;
      word.question = answer;
      setTimeout(() => {
        setShowWord(word);
      }, 500);
    } else {
      // Обычный режим
      setShowWord({...getRandomItem(filteredData)});
    }
  }

  // Данные загружены
  useEffect(() => {
    if(!(!isLoading && data && data.length > 0)) return;

    // Выбираем первое слово
    selectWord();
  }, [isLoading])


  // Получен ответ
  const onAnswer = (inputLetters: string) => {
    // подготовка
    const userLetters = inputLetters.toLowerCase();
    const answerLetters = showWord.answer.toLowerCase();


    // Ответ верный
    if(answerLetters === userLetters) {
      setUserAnswer(inputLetters);
      setStatus(Status.SUCCESS);
      successPlayer.current.play();

      // Если ошибок нет убираем повтор
      const word = getItemById(data, showWord.id);
      if(countError === 0) {
        console.log(Number(word.repeats) - 1, 'repeats')
        word.repeats = Number(word.repeats) - 1;
      } else {
        word.wrongs = Number(word.wrongs) + 1;
      }
      // Сохранение данных
      axios.patch('/api/edit-word', {...word})
      setTimeout(() => {
        mutate([...data]);
      }, 1000);

      // Сохраняем пример, переходим на следующий
      setTimeout(() => {
        console.log(data, 'data');
        // Выбираем следующее слово
        selectWord();
      }, 1500);
    }
    // Пользователь вводит пока верно, без ошибок
    else if(answerLetters.indexOf(userLetters) === 0) {
      setStatus(Status.PLAY);
      // Даем вводить в поле дальше
      setUserAnswer(inputLetters);
    }
    // Пользователь ошибся
    else {
      setStatus(Status.ERROR);
      // Записываем количество ошибок
      setCountError((count) => count + 1);
      errorPlayer.current.play();
    }
  }

  if(error || isLoading) return  null;
  if(!showWord) return null;

  return (
      <>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <QuestionMarkIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ marginTop: '30px' }}>
          {showWord.question}
        </Typography>
        <CssTextField
            className={status === Status.SUCCESS ? 'success' : (status === Status.ERROR ? 'error' : '')}
            sx={{ maxWidth: '50ch', marginTop: '30px', '& > input': {color: 'green'} }}
            hiddenLabel
            margin="normal"
            required
            fullWidth
            id="text"
            name="text"
            autoFocus
            value={userAnswer}
            onChange={(e) => {
              onAnswer(e.target.value);
            }}
        />
        {status === Status.ERROR && (
          <Typography component="span" variant="subtitle1" sx={{ color: 'red', marginTop: '20px' }}>
            {showWord.answer}
          </Typography>
        )}
        {status === Status.SUCCESS && (
          <Typography component="span" variant="subtitle1" sx={{ color: 'green', marginTop: '20px' }}>
            Верно!
          </Typography>
        )}
      </>
  )
}
export default Play;
