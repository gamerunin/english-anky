import {randomIntFromInterval} from "@/common/utils/number.utils";
import {getRandomItem} from "@/common/utils/array.utils";
import TextToSpeech from "@/components/play/service/text-to-speech";

class SelectWord {
	getWord() {
		// console.log('selectWord ', dataArray);
		// if(!dataArray) return  null;
		// // Фильтруем те у которых есть повторы
		// const filteredData = dataArray.filter((word) => word.repeats > 0);
		//
		// console.log(filteredData, 'filteredData');
		// // // все задания выполнены!
		// // if(filteredData.length < 1) {
		// //   // router.push('/words');
		// //   return;
		// // }
		//
		// setStatus(Status.PLAY);
		// setUserAnswer('');
		// setCountError(0);
		//
		// const random = randomIntFromInterval(1, 6);
		// console.log(random, 'random');
		// if(random > 4) {
		// 	// Меняем местами вопрос с ответом
		// 	const word    = {...getRandomItem(filteredData)};
		// 	const answer  = word.answer;
		// 	word.answer   = word.question;
		// 	word.question = answer;
		// 	setTimeout(() => {
		// 		setShowWord(word);
		// 	}, 500);
		// 	setCanPlay(false);
		// } else if(random > 2) {
		// 	console.log('only voice')
		// 	const newWord = {...getRandomItem(filteredData)};
		// 	TextToSpeech.play(newWord.question);
		// 	newWord.question = '**********';
		// 	setCanPlay(true);
		// 	setShowWord(newWord);
		// } else {
		// 	// Обычный режим
		// 	const newWord = {...getRandomItem(filteredData)};
		// 	setShowWord(newWord);
		// 	TextToSpeech.play(newWord.question);
		// 	setCanPlay(true);
		// }
	}
}
export default new SelectWord();