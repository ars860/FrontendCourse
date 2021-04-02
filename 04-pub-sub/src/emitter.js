'use strict';

/**
 * Сделано дополнительное задание: реализованы методы several и through.
 */
const isExtraTaskSolved = true;

/**
 * Получение нового Emitter'а
 * @returns {Object}
 */
function getEmitter() {
  const events = {};

  function hasOwnProperty(object, property) {
    return Object.hasOwnProperty.call(object, property);
  }

  function onExtended(event, context, handler, remover, checker) {
    if (!hasOwnProperty(events, event)) {
      events[event] = [];
    }

    if (remover === undefined) {
      remover = { remove: () => false };
    }
    if (checker === undefined) {
      checker = { check: () => true };
    }

    events[event].push({ context: context, handler: handler, remover: remover, checker: checker });
  }

  return {
    /**
     * Подписка на событие
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     */
    on: function(event, context, handler) {
      onExtended(event, context, handler);

      return this;
    },

    /**
     * Отписка от события
     * @param {string} event
     * @param {Object} context
     */
    off: function(event, context) {
      for (const key of Object.keys(events)) {
        if (key === event || key.startsWith(`${event}.`)) {
          events[key] = events[key].filter(element => element.context !== context);
        }
      }

      return this;
    },

    /**
     * Уведомление о событии
     * @param {string} event
     */
    emit: function(event) {
      while (event !== undefined) {
        const slitted = /(.*)\.(.*)/.exec(event);
        const curEvent = slitted !== null ? slitted[0] : event;
        event = slitted !== null ? slitted[1] : undefined;

        if (!hasOwnProperty(events, curEvent)) {
          continue;
        }

        for (const a of events[curEvent]) {
          if (a.checker.check()) {
            a.handler.call(a.context);
          }
        }

        events[curEvent] = events[curEvent].filter(element => !element.remover.remove());
      }

      return this;
    },

    /**
     * Подписка на событие с ограничением по количеству отправляемых уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} times Сколько раз отправить уведомление
     */
    several: function(event, context, handler, times) {
      const remover = {
        curCount: 0,
        maxCount: times,
        remove: function() {
          this.curCount++;

          return this.curCount === this.maxCount;
        }
      };

      onExtended(event, context, handler, remover);

      return this;
    },

    /**
     * Подписка на событие с ограничением по частоте отправки уведомлений
     * @param {string} event
     * @param {Object} context
     * @param {Function} handler
     * @param {number} frequency Как часто уведомлять
     */
    through: function(event, context, handler, frequency) {
      const checker = {
        curCount: -1,
        maxCount: frequency,
        check: function() {
          this.curCount = (this.curCount + 1) % frequency;

          return this.curCount === 0;
        }
      };

      onExtended(event, context, handler, undefined, checker);

      return this;
    }
  };
}

module.exports = {
  getEmitter,

  isExtraTaskSolved
};
