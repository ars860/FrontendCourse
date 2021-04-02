'use strict';

/**
 * Флаг решения дополнительной задачи
 * @see README.md
 */
const isExtraTaskSolved = true;

const MINUTES_IN_HOUR = 60;
const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = MINUTES_IN_HOUR * HOURS_IN_DAY;

const dayToMinutes = { ПН: 0, ВТ: MINUTES_IN_DAY, СР: 2 * MINUTES_IN_DAY };
const upperBound = 3 * MINUTES_IN_DAY - 1;

function timeToMinutes(workingHours) {
  const parts = /(\d\d):(\d\d)\+(\d)/.exec(workingHours);

  const timeZone = parseInt(parts[3]);
  const hours = parseInt(parts[1]);
  const minutes = parseInt(parts[2]);

  return { time: hours * MINUTES_IN_HOUR + minutes, timezone: timeZone };
}

/**
 * @return {number}
 */
function dayAndTimeToMinutes(dayAndTime, bankTimeZone) {
  const parts = /([А-Я]{2}) (\d\d:\d\d\+\d)/.exec(dayAndTime);
  const dayMinutes = dayToMinutes[parts[1]];
  if (dayMinutes === undefined) {
    return upperBound;
  }

  const time = timeToMinutes(parts[2]);

  return dayMinutes + time.time + (bankTimeZone - time.timezone) * MINUTES_IN_HOUR;
}

let intervalsByName = {};

function reverseIntervals(intervals) {
  let prev = { from: 0, to: 0 };
  const result = [];
  for (let i = 0; i < intervals.length; i++) {
    result.push({ from: prev.to, to: intervals[i].from });
    prev = intervals[i];
  }
  result.push({ from: prev.to, to: upperBound });

  return result;
}

function addIntervals(name, schedule, bankTimeZone) {
  intervalsByName[name] = [];
  Object.keys(schedule).forEach(key =>
    intervalsByName[name].push(entryToInterval(schedule[key], bankTimeZone))
  );
  intervalsByName[name].sort((interval1, interval2) =>
    interval1.from > interval2.from ? 1 : interval1.from < interval2.from ? -1 : 0
  );
  intervalsByName[name] = reverseIntervals(intervalsByName[name]);

  return intervalsByName[name];
}

function parseBankSchedule(workingHours) {
  const timeFrom = timeToMinutes(workingHours.from);
  const timeTo = timeToMinutes(workingHours.to);
  const interval1 = { from: timeFrom.time, to: timeTo.time };
  const interval2 = { from: interval1.from + MINUTES_IN_DAY, to: interval1.to + MINUTES_IN_DAY };
  const interval3 = { from: interval2.from + MINUTES_IN_DAY, to: interval2.to + MINUTES_IN_DAY };

  return { intervals: [interval1, interval2, interval3], timezone: timeTo.timezone };
}

function entryToInterval(entry, bankTimeZone) {
  const fromMinutes = dayAndTimeToMinutes(entry.from, bankTimeZone);
  const toMinutes = dayAndTimeToMinutes(entry.to, bankTimeZone);

  if (fromMinutes === upperBound) {
    return null;
  }

  return { from: fromMinutes, to: toMinutes };
}

function intersectIntervals(intervals1, intervals2) {
  let pos1 = 0;
  let pos2 = 0;

  const result = [];

  while (pos1 !== intervals1.length && pos2 !== intervals2.length) {
    const from1 = intervals1[pos1].from;
    const to1 = intervals1[pos1].to;
    const from2 = intervals2[pos2].from;
    const to2 = intervals2[pos2].to;

    if (from2 > to1) {
      pos1++;
      continue;
    }

    if (from1 > to2) {
      pos2++;
      continue;
    }

    if (from1 <= from2) {
      if (to2 <= to1) {
        result.push({ from: from2, to: to2 });
        pos2++;
      }

      if (to2 === to1) {
        pos1++;
      }

      if (to2 > to1) {
        result.push({ from: from2, to: to1 });
        pos1++;
      }
    } else {
      if (to1 <= to2) {
        result.push({ from: from1, to: to1 });
        pos1++;
      }

      if (to2 === to1) {
        pos2++;
      }

      if (to1 > to2) {
        result.push({ from: from1, to: to2 });
        pos2++;
      }
    }
  }

  return result;
}

function intersectAll() {
  let keys = Object.keys(intervalsByName);
  while (keys.length !== 1) {
    const intersected = {
      name: keys[0] + '&' + keys[1],
      intervals: intersectIntervals(intervalsByName[keys[0]], intervalsByName[keys[1]])
    };
    delete intervalsByName[keys[0]];
    delete intervalsByName[keys[1]];
    intervalsByName[intersected.name] = intersected.intervals;
    keys = Object.keys(intervalsByName);
  }
}

/**
 * @param {Object} schedule Расписание Банды
 * @param {number} duration Время на ограбление в минутах
 * @param {Object} workingHours Время работы банка
 * @param {string} workingHours.from Время открытия, например, "10:00+5"
 * @param {string} workingHours.to Время закрытия, например, "18:00+5"
 * @returns {Object}
 */
function getAppropriateMoment(schedule, duration, workingHours) {
  intervalsByName = {};
  const offset = 30;
  const bank = parseBankSchedule(workingHours);
  Object.keys(schedule).forEach(name => addIntervals(name, schedule[name], bank.timezone));

  intervalsByName['Mr.Bank'] = [];
  bank.intervals.forEach(interval => intervalsByName['Mr.Bank'].push(interval));
  intervalsByName['Mr.Bank'].sort((interval1, interval2) =>
    interval1.from > interval2.from ? 1 : interval1.from < interval2.from ? -1 : 0
  );

  intersectAll();

  const intervals = Object.keys(intervalsByName)
    .map(key => intervalsByName[key])[0]
    .filter(interval => interval.to - interval.from >= duration);

  let result = intervals[0];
  let pos = 0;

  return {
    /**
     * Найдено ли время
     * @returns {boolean}
     */
    exists() {
      return result !== undefined;
    },

    /**
     * Возвращает отформатированную строку с часами
     * для ограбления во временной зоне банка
     *
     * @param {string} template
     * @returns {string}
     *
     * @example
     * ```js
     * getAppropriateMoment(...).format('Начинаем в %HH:%MM (%DD)') // => Начинаем в 14:59 (СР)
     * ```
     */
    format(template) {
      if (result === undefined) {
        return '';
      }

      const day = Math.floor(result.from / MINUTES_IN_DAY);
      const hours = Math.floor((result.from - day * MINUTES_IN_DAY) / MINUTES_IN_HOUR);
      const minutes = result.from - day * MINUTES_IN_DAY - hours * MINUTES_IN_HOUR;

      const intToDay = ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'];

      return template
        .replace('%HH', hours.toString() < 10 ? `0${hours.toString()}` : hours.toString())
        .replace('%MM', minutes.toString() < 10 ? `0${minutes.toString()}` : minutes.toString())
        .replace('%DD', intToDay[day]);
    },

    /**
     * Попробовать найти часы для ограбления позже [*]
     * @note Не забудь при реализации выставить флаг `isExtraTaskSolved`
     * @returns {boolean}
     */
    tryLater() {
      if (result.to - result.from - offset >= duration) {
        result.from += offset;

        return true;
      }

      pos++;
      while (
        pos !== intervals.length &&
        Math.max(result.from + offset, intervals[pos].from) + duration > intervals[pos].to
      ) {
        pos++;
      }

      if (pos !== intervals.length) {
        const from = Math.max(result.from + offset, intervals[pos].from);
        result = intervals[pos];
        result.from = from;

        return true;
      }

      return false;
    }
  };
}

module.exports = {
  getAppropriateMoment,

  isExtraTaskSolved
};
