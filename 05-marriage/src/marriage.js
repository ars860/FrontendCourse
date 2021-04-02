'use strict';

/**
 * @typedef {Object} Friend
 * @property {string} name Имя
 * @property {'male' | 'female'} gender Пол
 * @property {boolean} best Лучший ли друг?
 * @property {string[]} friends Список имён друзей
 */

const nameComp = (f, s) => f.name.localeCompare(s.name);

/**
 * Итератор по друзьям
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 */
function Iterator(friends, filter) {
  const friendsDict = friends.reduce((acc, curFriend) => {
    acc[curFriend.name] = curFriend;

    return acc;
  }, {});

  if (!(filter instanceof Filter)) {
    throw new TypeError('filter is not Filter');
  }

  const processed = new Set();

  function hasAndAdd(friend) {
    const res = processed.has(friend);
    processed.add(friend);

    return res;
  }

  const circles = [friends.filter(friend => friend.best && !hasAndAdd(friend.name)).sort(nameComp)];
  let inCirclePos = 0;
  let curCircle = 0;
  this.maxCircle = Infinity;

  function genNextCircle(circle) {
    const newCircle = [];

    for (const friend of circle) {
      newCircle.push(
        ...friend.friends.filter(name => !hasAndAdd(name)).map(name => friendsDict[name])
      );
    }

    circles.push(newCircle.sort(nameComp));
  }

  function genAllCirclesAndFilter() {
    while (circles[circles.length - 1].length > 0) {
      genNextCircle(circles[circles.length - 1]);
    }

    circles.pop();

    for (let i = 0; i < circles.length; i++) {
      circles[i] = circles[i].filter(person => filter.check(person));
    }
  }

  genAllCirclesAndFilter();

  this.done = function() {
    return (
      circles.length === 0 ||
      curCircle > this.maxCircle ||
      (curCircle === this.maxCircle && inCirclePos === circles[curCircle].length) ||
      (curCircle === circles.length - 1 && inCirclePos === circles[curCircle].length)
    );
  };

  this.next = function() {
    if (this.done()) {
      return null;
    }

    if (inCirclePos === circles[curCircle].length) {
      curCircle++;
      inCirclePos = 0;
    }

    return circles[curCircle][inCirclePos++];
  };
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Friend[]} friends Список друзей
 * @param {Filter} filter Фильтр друзей
 * @param {Number} maxLevel Максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
  Iterator.call(this, friends, filter);

  this.maxCircle = maxLevel - 1;
}

LimitedIterator.prototype = Object.create(Iterator.prototype);
LimitedIterator.prototype.constructor = LimitedIterator;

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
  this.check = function() {
    return true;
  };
}

/**
 * Фильтр друзей-парней
 * @extends Filter
 * @constructor
 */
function MaleFilter() {
  Filter.call(this);

  this.check = function(friend) {
    return friend.gender === 'male';
  };
}

MaleFilter.prototype = Object.create(Filter.prototype);
MaleFilter.prototype.constructor = MaleFilter;

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
  Filter.call(this);

  this.check = function(friend) {
    return friend.gender === 'female';
  };
}

FemaleFilter.prototype = Object.create(Filter.prototype);
FemaleFilter.prototype.constructor = FemaleFilter;

module.exports = {
  Iterator,
  LimitedIterator,
  Filter,
  MaleFilter,
  FemaleFilter
};
