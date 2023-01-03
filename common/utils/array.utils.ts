/**
 * Вспомогательные функции для работы с массивами
 */

/**
 * Удалить элемент из массива по id
 */
export function removeItemById(array: any, id: any, obj: boolean = true) {
	let remove_index = -1;

	if (obj) {
		// Ищем id внутри обьекта
		for (let i = 0; i < array.length; i++) {
			if (array[i].id === id) {
				remove_index = i;
				break;
			}
		}
	}
	else {
		// Просто ищем id в массиве
		for (let i = 0; i < array.length; i++) {
			if (array[i] === id) {
				remove_index = i;
				break;
			}
		}
	}

	if (-1 !== remove_index) {
		array.splice(remove_index, 1);
	}

	return remove_index;
}

/**
 * Вернуть элемент из массива по id
 * @param array
 * @param id
 * @param obj boolean id внутри обьекта или нет
 */
export function getItemById(array: any, id: any, obj: boolean = true) {
	if (obj) {
		return array.filter((item: any) => {
			return parseInt(item.id) === parseInt(id);
		})[0];
	}

	return array.filter((item: any) => {
		return parseInt(item) === parseInt(id);
	})[0];
}

/**
 * Проверить присутствие элемента в массиве
 * @param array
 * @param element
 */
export function isExitItem(array: any, element: any): boolean {
	return array.filter((item: any) => {
		return item === element;
	})[0];
}

/**
 * Получить рандомный элемент из массива
 */
export function getRandomItem(array: any): any {
	return array[Math.floor(Math.random() * array.length)];
}

/**
 * Массив не пустой
 */
export function isArrayWitchLength(array:any) {
	return Array.isArray(array) && array.length > 0;
}

/**
 * Сортирует массивы методом sort() и возвращает первое неравенство.
 * @param arr1
 * @param arr2
 */
export function compareArrays(arr1: any, arr2: any) {
	const len = Math.max(arr1.length, arr2.length);
	const sorted1 = arr1.slice().sort();
	const sorted2 = arr2.slice().sort();

	for (let i = 0; i < len; i++) {
		if (sorted1[i] !== sorted2[i]) {
			return sorted1[i] || sorted2[i];
		}
	}

	return true;
}

/**
 * Глубокое копирование обьектов
 * @param obj обьект для копирования
 */
export function deepCloneObject(obj: any) {
	if (null === obj) return null;
	// Создаем поверхностный клона оригинала.
	const clone = Object.assign({}, obj);

	// Определяем, какие пары ключ-значение
	// необходимо глубоко клонировать.
	Object.keys(clone).forEach(
		(key) => (clone[key] = 'object' === typeof obj[key] ? deepCloneObject(obj[key]) : obj[key]),
	);

	// Проверяем является ли obj массивом и не пустой ли он.
	return Array.isArray(obj) && obj.length
		// eslint-disable-next-line operator-linebreak
		? // Если obj массив и он не пуст, тогда
	// указываем объекту clone длину исходного массива что бы
	// конвертировать clone в массив и вернуть его.
		(clone.length = obj.length) && Array.from(clone) // Если obj пустой массив,
		: Array.isArray(obj)
			// eslint-disable-next-line operator-linebreak
			? // то возвращаем его
			Array.from(obj)
			// eslint-disable-next-line operator-linebreak
			: // в других случаях obj это объект и мы возвращаем копию clone.
			clone;
}
