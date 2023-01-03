class TextToSpeech {
  speech: any;

  lang: string = 'en';
  rate: number = 1;
  volume: number = 1;
  pitch: number = 1;

  constructor() {
		if(typeof window === 'undefined') return;

  	this.speech = new SpeechSynthesisUtterance();
  	// Load voice
  	window.speechSynthesis.onvoiceschanged = () => {
  		// On Voices Loaded
  		// Get List of Voices
  		const voices = window.speechSynthesis.getVoices();

  		// Initially set the First Voice in the Array.
  		this.speech.voice = voices[0];
  	};
  }

  play(text: string) {
  	// Настройки
  	this.speech.text = text;
  	this.speech.lang = this.lang;
  	this.speech.volume = this.volume;
  	this.speech.pitch = this.pitch;
  	this.speech.rate = this.rate;

  	window.speechSynthesis.speak(this.speech);
  }

  pause() {
  	window.speechSynthesis.pause();
  }

  resume() {
  	window.speechSynthesis.resume();
  }
}
export default new TextToSpeech();
