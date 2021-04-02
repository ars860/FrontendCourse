'use strict';

/**
 * Складывает два целых числа
 * @param {Number} a Первое целое
 * @param {Number} b Второе целое
 * @throws {TypeError} Когда в аргументы переданы не числа
 * @returns {Number} Сумма аргументов
 */
function abProblem(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new TypeError('Expected two numbers');
  }

  if (!Number.isInteger(a) || !Number.isInteger(b)) {
    throw new RangeError('Expected two integers');
  }

  return a + b;
}

/**
 * Определяет век по году
 * @param {Number} year Год, целое положительное число
 * @throws {TypeError} Когда в качестве года передано не число
 * @throws {RangeError} Когда год – отрицательное значение
 * @returns {Number} Век, полученный из года
 */
function centuryByYearProblem(year) {
  if (typeof year !== 'number') {
    throw new TypeError('Expected number');
  }
  if (!Number.isInteger(year) || year <= 0) {
    throw new RangeError('Expected integer greater than zero');
  }
  return Math.ceil(year / 100);
}

/**
 * Переводит цвет из формата HEX в формат RGB
 * @param {String} hexColor Цвет в формате HEX, например, '#FFFFFF'
 * @throws {TypeError} Когда цвет передан не строкой
 * @throws {RangeError} Когда значения цвета выходят за пределы допустимых
 * @returns {String} Цвет в формате RGB, например, '(255, 255, 255)'
 */
function colorsProblem(hexColor) {
  if (typeof hexColor !== 'string') {
    throw new TypeError('Expected string');
  }

  let colors = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (!colors) {
    colors = /^#([a-f\d])([a-f\d])([a-f\d])$/i.exec(hexColor);
    if (!colors) {
      throw new RangeError('Expected hex color');
    }
    colors[1] += colors[1];
    colors[2] += colors[2];
    colors[3] += colors[3];
  }
  return `(${parseInt(colors[1], 16)}, ${parseInt(colors[2], 16)}, ${parseInt(colors[3], 16)})`;
}

/**
 * Находит n-ое число Фибоначчи
 * @param {Number} n Положение числа в ряде Фибоначчи
 * @throws {TypeError} Когда в качестве положения в ряде передано не число
 * @throws {RangeError} Когда положение в ряде не является целым положительным числом
 * @returns {Number} Число Фибоначчи, находящееся на n-ой позиции
 */
function fibonacciProblem(n) {
  if (typeof n !== 'number') {
    throw new TypeError('Expected number');
  }
  if (n <= 0 || !Number.isInteger(n)) {
    throw new RangeError('Expected integer greater than zero');
  }
  let a = 0,
    b = 1;
  for (let i = 0; i < n - 1; i++) {
    b = b + a;
    a = b - a;
  }
  return b;
}

/**
 * Транспонирует матрицу
 * @param {(Any[])[]} matrix Матрица размерности MxN
 * @throws {TypeError} Когда в функцию передаётся не двумерный массив
 * @returns {(Any[])[]} Транспонированная матрица размера NxM
 */
function matrixProblem(matrix) {
  if (!Array.isArray(matrix)) {
    throw new TypeError('Expected array');
  }
  const n = matrix.length;
  if (!Array.isArray(matrix[0])) {
    throw new TypeError('Expected two-dimensional array');
  }
  const m = matrix[0].length;
  matrix.forEach(function(element) {
    if (!Array.isArray(element) || element.length !== m) {
      throw new TypeError('Expected two-dimensional array');
    }
  });
  const ans = [];
  for (let i = 0; i < m; i++) {
    ans.push([]);
    for (let j = 0; j < n; j++) {
      ans[i].push(matrix[j][i]);
    }
  }
  return ans;
}

/**
 * Переводит число в другую систему счисления
 * @param {Number} n Число для перевода в другую систему счисления
 * @param {Number} targetNs Система счисления, в которую нужно перевести (Число от 2 до 36)
 * @throws {TypeError} Когда переданы аргументы некорректного типа
 * @throws {RangeError} Когда система счисления выходит за пределы значений [2, 36]
 * @returns {String} Число n в системе счисления targetNs
 */
function numberSystemProblem(n, targetNs) {
  if (typeof n !== 'number' || typeof targetNs !== 'number') {
    throw new TypeError('Expected two integers');
  }
  if (!Number.isInteger(targetNs) || targetNs < 2 || targetNs > 36) {
    throw new RangeError('Second argument must be integer in range of (2,36)');
  }

  return n.toString(targetNs);
}

/**
 * Проверяет соответствие телефонного номера формату
 * @param {String} phoneNumber Номер телефона в формате '8–800–xxx–xx–xx'
 * @throws {TypeError} phoneNumber не string
 * @returns {Boolean} Если соответствует формату, то true, а иначе false
 */
function phoneProblem(phoneNumber) {
  if (typeof phoneNumber !== 'string') {
    throw new TypeError('Expected string');
  }

  return /^8-800-\d{3}-\d{2}-\d{2}$/.test(phoneNumber);
}

/**
 * Определяет количество улыбающихся смайликов в строке
 * @param {String} text Строка в которой производится поиск
 * @throws {TypeError} Когда в качестве аргумента передаётся не строка
 * @returns {Number} Количество улыбающихся смайликов в строке
 */
function smilesProblem(text) {
  if (typeof text !== 'string') {
    throw new TypeError('Expected string');
  }
  const matchesFirst = text.match(/\(-:/g);
  const matchesSecond = text.match(/:-\)/g);
  return (matchesFirst ? matchesFirst.length : 0) + (matchesSecond ? matchesSecond.length : 0);
}

/**
 * Определяет победителя в игре "Крестики-нолики"
 * Тестами гарантируются корректные аргументы.
 * @param {(('x' | 'o')[])[]} field Игровое поле 3x3 завершённой игры
 * @returns {'x' | 'o' | 'draw'} Результат игры
 */
function ticTacToeProblem(field) {
  let oWin = false,
    xWin = false;
  for (let i = 0; i < 3; i++) {
    if (field[i][0] === field[i][1] && field[i][1] === field[i][2]) {
      if (field[i][0] === 'o') {
        oWin = true;
      } else {
        xWin = true;
      }
    }
    if (field[0][i] === field[1][i] && field[1][i] === field[2][i]) {
      if (field[0][i] === 'o') {
        oWin = true;
      } else {
        xWin = true;
      }
    }
  }

  if (field[0][0] === field[1][1] && field[1][1] === field[2][2]) {
    if (field[0][0] === 'o') {
      oWin = true;
    } else {
      xWin = true;
    }
  }

  if (field[0][2] === field[1][1] && field[1][1] === field[2][0]) {
    if (field[0][2] === 'o') {
      oWin = true;
    } else {
      xWin = true;
    }
  }

  if ((oWin && xWin) || (!oWin && !xWin)) {
    return 'draw';
  }
  return xWin ? 'x' : 'o';
}

module.exports = {
  abProblem,
  centuryByYearProblem,
  colorsProblem,
  fibonacciProblem,
  matrixProblem,
  numberSystemProblem,
  phoneProblem,
  smilesProblem,
  ticTacToeProblem
};
