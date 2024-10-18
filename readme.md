Приложнние "Список дел"
Что сделано в приложении:
- Добавление задачи
   - Задача добавляется при помощи клика мыши и при помощи нажатии кнопки Enter
   - Задачи идут нумерованным списком
   - Имеется два списка задач: активный и удаленый, видимость которых меняется при нажатии на кнопку показывающую/скрывающую списки
- Поле ввода и кнопки прилипают при скролле
- Возможность отметить задачу как выполненную с помощью чекбокса
   - при нажатии на чебокс текст задачи перечеркивается
   - после обратного нажатия текст становится нормальным
   - при смене состояния чекбокса меняется статус задачи в объекте задач (false/true)
- Возможность удаления задачи из общего списка и перенос в отдельный список удаленых задач
- Возможность просмотра списка удаленых задач
- Возможность восстановления не выполненных задач из списка удаленых
- Программа несет в себе объект задач в котором содержится список массивов задач:
  - Список всех задач
  - Активные задачи
  - Выполненные задачи
  - Удаленые задачи
  - При смене статуса задачи в консоль лог обновляется массив задач с сообщением о том в какой список была перемещена задача
  - Если невыаолненная задача была восстановлена из списка удаленых задач, в консоли отображается соответствующее сообщение
  - При попытке ввести пустое значение строки программа выводит предупреждение
  - При нажатии кнопки "Восстановить невыполненные задачи" в остсутвии невыполненных задач выводится сообщение
- Добавлено хранение задач в localStorage с отображением списков задач с их ключами 
