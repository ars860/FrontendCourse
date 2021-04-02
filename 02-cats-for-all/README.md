# Задача «Котики для всех»

> Мы очень хотим, чтобы код вы написали сами, а не пользовались внешними библиотеками.

## Основное задание

:warning: Задание необходимо выполнить **не используя JS**, но используя flex и grid.

Благодаря нам многие котики уже нашли новый дом.

Но вот оставшиеся все никак не найдут своего человека. Бабуленька недавно прочитала про адаптивный дизайн и теперь думает, что все дело в том, что на многих мобильных девайсах наша верстка выглядит не очень.

Предлагаем вам для каждого типа устройств сделать свою версию отображения. Чтобы заждавшиеся котики наконец обрели свою семью.

Написать стили для различных устройств можно используя `@media` (для разных размеров экрана).

- За мобильные устройства взять диапазон от 375px до 730px;
- За планшеты - от 730px до 1200px;
- Все, что больше 1200px - считать за десктоп.

Ниже мы прикладываем три макета, как это должно выглядеть:

- для мобильных

![hw6-mobile](https://user-images.githubusercontent.com/5352441/48191359-b48b5680-e366-11e8-9b16-91e30eb41f67.png)

- для планшетов

![hw6-ipad](https://user-images.githubusercontent.com/5352441/48191357-b2c19300-e366-11e8-87d0-640ca6a840ca.png)

- для десктопов

![hw6-desktop](https://user-images.githubusercontent.com/5352441/48191352-b0f7cf80-e366-11e8-9422-79c40e72e059.png)

Описание для десктопов:

- карточки котиков, размещенные в ряд, имеют одинаковую высоту.
- линия, разделяющая карточку, находится для всех карточек на одном уровне
- фотографии всегда одинакового размера
- если высота фото меньше, чем размер верхней части, она выравнивается по верхнему краю (+отступ)
- фильтр с указанием возраста просто свертстать
- фильтр по породам (можно выбрать только одну) должен работать: при выборе породы, карточки с котиками других пород перестают отображаться (или проявите свою фантазию и придумайте какое-нибудь более эффектное решение ;)

:warning: Обратите внимание, что во всех вариантах футер выглядит по-разному

> Приведенные макеты являются лишь рекомендацией, и вам не нужно на 100% следовать им. Вы вольны проявить фантазию. Так что самое время применить ваши знания UI и UX :)

## Доступные команды

> Перед тем, как запускать приведенные ниже команды, необходимо установить зависимости с помощью команды `npm install`

Запускаются так: `npm run <command>`

| Команда   | Действие               |
| --------- | ---------------------- |
| lint      | Проверка кода линтером |
| lint:html | Линтинг HTML           |
| lint:css  | Линтинг CSS            |
| format    | Форматирование кода    |