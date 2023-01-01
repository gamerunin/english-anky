/**
 * Предложение для упражнений
 */
export interface Word {
	id: number;
	question: string;
	answer: string;
	wrongs: string;
	repeats: string;
	category_id: number;
}