'use strict';

/**
 * Если вы решили сделать дополнительное задание и реализовали функцию importFromDsv,
 * то выставьте значение переменной isExtraTaskSolved в true.
 */
const isExtraTaskSolved = true;

/**
 * Телефонная книга
 */
const phoneBook = {};

function checkEntry(phone, name, email) {
  return !(
    typeof phone !== 'string' ||
    typeof name !== 'string' ||
    name.length === 0 ||
    (email && typeof email !== 'string') ||
    !/^\d{10}$/.test(phone)
  );
}

/**
 * Добавление записи в телефонную книгу
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function add(phone, name, email) {
  if (!checkEntry(phone, name, email)) {
    return false;
  }

  if (phoneBook[phone] !== undefined) {
    return false;
  }

  phoneBook[phone] = { name: name, email: email };

  return true;
}

/**
 * Обновление записи в телефонной книге
 * @param {string} phone
 * @param {string} [name]
 * @param {string} [email]
 * @returns {boolean}
 */
function update(phone, name, email) {
  if (!checkEntry(phone, name, email)) {
    return false;
  }

  if (phoneBook[phone] === undefined) {
    return false;
  }

  phoneBook[phone] = { name: name, email: email };

  return true;
}

function findAsArray(query) {
  if (typeof query !== 'string' || query.length === 0) {
    return [];
  }

  const entriesWithPhones = Object.keys(phoneBook).map(key => {
    const element = phoneBook[key];

    return { phone: key, name: element.name, email: element.email };
  });

  if (query === '*') {
    return entriesWithPhones;
  }

  return entriesWithPhones.filter(
    element =>
      element.phone.includes(query) ||
      element.name.includes(query) ||
      (element.email !== undefined && element.email.includes(query))
  );
}

function formatPhone(phone) {
  return phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '+7 ($1) $2-$3-$4');
}

/**
 * Поиск записей по запросу в телефонной книге
 * @param {string} query
 * @returns {string[]}
 */
function find(query) {
  return findAsArray(query)
    .map(element => {
      const name = element.name;
      const phone = formatPhone(element.phone);
      const email = element.email !== undefined ? `, ${element.email}` : '';

      return `${name}, ${phone}${email}`;
    })
    .sort();
}

/**
 * Удаление записей по запросу из телефонной книги
 * @param {string} query
 * @returns {number}
 */
function findAndRemove(query) {
  const numbersToDelete = findAsArray(query).map(element => element.phone);
  for (const number of numbersToDelete) {
    delete phoneBook[number];
  }

  return numbersToDelete.length;
}

/**
 * Импорт записей из dsv-формата
 * @param {string} dsv
 * @returns {number} Количество добавленных и обновленных записей
 */
function importFromDsv(dsv) {
  if (typeof dsv !== 'string') {
    return 0;
  }

  let ans = 0;
  for (const str of dsv.split('\n')) {
    const tokens = str.split(';');
    if (update(tokens[1], tokens[0], tokens[2]) || add(tokens[1], tokens[0], tokens[2])) {
      ans++;
    }
  }

  return ans;
}

module.exports = {
  add,
  update,
  find,
  findAndRemove,
  importFromDsv,

  isExtraTaskSolved
};
