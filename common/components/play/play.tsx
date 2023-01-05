import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import React, {useEffect, useRef, useState} from "react";
import {getItemById, getRandomItem, isArrayWitchLength} from "@/common/utils/array.utils";
import {styled} from "@mui/material/styles";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

// sounds
// @ts-ignore
import errorTrack from './sounds/error.ogg';
// @ts-ignore
import successTrack from './sounds/success.ogg';
import {randomIntFromInterval} from "@/common/utils/number.utils";
import axios from "axios";
import {IconButton} from "@mui/material";
import TextToSpeech from "@/components/play/service/text-to-speech";
import {useRouter} from "next/router";
import useAxios from "@/common/hooks/useAxios";

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
  const { data } = useAxios({url: `/api/get-words?category=${category}&not_complete=true`, params: {}})
  const [userAnswer, setUserAnswer] = useState('');
  const [playStatus, setPlayStatus] = useState(Status.PLAY);
  const [showWord, setShowWord] = useState(null);
  const [countError, setCountError] = useState(0);
  const [isCanPlay, setCanPlay] = useState(false);
  const router = useRouter();

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
    // Все примеры закончились
    if(filteredData.length < 1) {
      router.push('/');
      return;
    }

    setPlayStatus(Status.PLAY);
    setUserAnswer('');
    setCountError(0);

    const random = randomIntFromInterval(1, 6);
    if(random > 4) {
      // Меняем местами вопрос с ответом
      const word    = {...getRandomItem(filteredData)};
      const answer  = word.answer;
      word.answer   = word.question;
      word.question = answer;
      word.play = '';
      setCanPlay(false);
      setShowWord(word);
    } else if(random > 2) {
      // только озвучка
      const word = {...getRandomItem(filteredData)};
      word.play = word.question;
      TextToSpeech.play(word.play);
      word.question = '******';
      setCanPlay(true);
      setShowWord(word);
    } else {
      // Обычный режим
      const word = {...getRandomItem(filteredData)};
      word.play = word.question;
      TextToSpeech.play(word.play);
      setCanPlay(true);
      setShowWord(word);
    }
  }

  useEffect(() => {
    if(!isArrayWitchLength(data)) return;
    selectWord();
  }, [data]);

  // Получен ответ
  const onAnswer = (inputLetters: string) => {
    // подготовка
    const userLetters = inputLetters.toLowerCase();
    const answerLetters = showWord.answer.toLowerCase();

    // Ответ верный
    if(answerLetters === userLetters) {
      setUserAnswer(inputLetters);
      setPlayStatus(Status.SUCCESS);
      successPlayer.current.play();

      // Если ошибок нет убираем повтор
      const word = getItemById(data, showWord.id);
      if(countError === 0) {
        word.repeats = Number(word.repeats) - 1;
      } else {
        word.wrongs = Number(word.wrongs) + 1;
      }
      console.log(word.repeats, '3');
      // Сохранение данных
      axios.patch('/api/edit-word', {...word})

      // Переходим на следующий
      setTimeout(() => {
        // Выбираем следующее слово
        selectWord();
      }, 2000);
    }
    // Пользователь вводит пока верно, без ошибок
    else if(answerLetters.indexOf(userLetters) === 0) {
      setPlayStatus(Status.PLAY);
      // Даем вводить в поле дальше
      setUserAnswer(inputLetters);
    }
    // Пользователь ошибся
    else {
      setPlayStatus(Status.ERROR);
      // Записываем количество ошибок
      setCountError((count) => count + 1);
      errorPlayer.current.play();
    }
  }

  if(!showWord) return null;

  return (
      <>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <QuestionMarkIcon />
        </Avatar>
        <Typography component="h1" variant="h4" sx={{ marginTop: '30px' }}>
          {showWord.question}
          {isCanPlay && <IconButton sx={{marginLeft: '10px'}} aria-label="voice" size="small" onClick={() => TextToSpeech.play(showWord.play)}><VolumeUpIcon /></IconButton>}
        </Typography>
        <CssTextField
            className={playStatus === Status.SUCCESS ? 'success' : (playStatus === Status.ERROR ? 'error' : '')}
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
        {playStatus === Status.ERROR && (
          <Typography component="span" variant="subtitle1" sx={{ color: 'red', marginTop: '20px' }}>
            {showWord.answer}
          </Typography>
        )}
        {playStatus === Status.SUCCESS && (
          <Typography component="span" variant="subtitle1" sx={{ color: 'green', marginTop: '20px' }}>
            Верно!
          </Typography>
        )}
      </>
  )
}
export default Play;
