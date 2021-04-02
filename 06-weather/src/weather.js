'use strict';

global.fetch = require('node-fetch');

/**
 * @typedef {object} TripItem Город, который является частью маршрута.
 * @property {number} geoid Идентификатор города
 * @property {number} day Порядковое число дня маршрута
 */

function fetchGeoid(geoid) {
  return global.fetch(
    `https://api.weather.yandex.ru/v1/forecast?hours=false&limit=7&geoid=${geoid}`
  );
}

class TripBuilder {
  constructor(geoids) {
    this.plan = [];
    this.geoids = geoids;
    this.maxInOneCity = Infinity;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества солнечных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `clear`;
   * * `partly-cloudy`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  sunny(daysCount) {
    for (let i = 0; i < daysCount; i++) {
      this.plan.push(['clear', 'partly-cloudy']);
    }

    return this;
  }

  /**
   * Метод, добавляющий условие наличия в маршруте
   * указанного количества пасмурных дней
   * Согласно API Яндекс.Погоды, к солнечным дням
   * можно приравнять следующие значения `condition`:
   * * `cloudy`;
   * * `overcast`.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  cloudy(daysCount) {
    for (let i = 0; i < daysCount; i++) {
      this.plan.push(['cloudy', 'overcast']);
    }

    return this;
  }

  /**
   * Метод, добавляющий условие максимального количества дней.
   * @param {number} daysCount количество дней
   * @returns {object} Объект планировщика маршрута
   */
  max(daysCount) {
    this.maxInOneCity = daysCount;

    return this;
  }

  /**
   * Метод, возвращающий Promise с планируемым маршрутом.
   * @returns {Promise<TripItem[]>} Список городов маршрута
   */
  build() {
    return Promise.all(
      this.geoids.map(geoid => fetchGeoid(geoid).then(response => response.json()))
    ).then(result => {
      const geoidsConditions = result.map(weatherInfo => ({
        geoid: weatherInfo['info']['geoid'],
        conditions: weatherInfo['forecasts'].map(dayWeather =>
          dayWeather['parts']['day_short']['condition'].split('-and-')
        )
      }));

      const isOkConditions = function(conditions, requiredConditions) {
        let isOkey = false;
        for (const requiredCondition of requiredConditions) {
          if (conditions.indexOf(requiredCondition) !== -1) {
            isOkey = true;
          }
        }

        return (
          isOkey &&
          conditions.filter(
            condition =>
              !(
                condition === 'partly-cloudy' ||
                condition === 'clear' ||
                condition === 'overcast' ||
                condition === 'cloudy'
              )
          ).length === 0
        );
      };

      const visited = [];
      let lastVisited = undefined;
      let inOneCity = 1;
      while (this.plan.length !== 0) {
        const curPlan = this.plan.shift();
        const curDay = visited.length;

        if (
          lastVisited !== undefined &&
          inOneCity < this.maxInOneCity &&
          isOkConditions(lastVisited['conditions'][curDay], curPlan)
        ) {
          visited.push({ geoid: lastVisited['geoid'], day: curDay + 1 });
          inOneCity++;
        } else {
          let noPath = true;
          for (const conditions of geoidsConditions) {
            if (isOkConditions(conditions['conditions'][curDay], curPlan)) {
              visited.push({ geoid: conditions['geoid'], day: curDay + 1 });
              lastVisited = conditions;
              noPath = false;
              inOneCity = 1;
              geoidsConditions.splice(geoidsConditions.indexOf(conditions), 1);
              break;
            }
          }
          if (noPath) {
            throw new Error('Не могу построить маршрут!');
          }
        }
      }

      return visited;
    });
  }
}

/**
 * Фабрика для получения планировщика маршрута.
 * Принимает на вход список идентификаторов городов, а
 * возвращает планировщик маршрута по данным городам.
 *
 * @param {number[]} geoids Список идентификаторов городов
 * @returns {TripBuilder} Объект планировщика маршрута
 * @see https://yandex.ru/dev/xml/doc/dg/reference/regions-docpage/
 */
function planTrip(geoids) {
  return new TripBuilder(geoids);
}

module.exports = {
  planTrip
};
