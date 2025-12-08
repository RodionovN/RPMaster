# RPMaster

Приложение-помощник для мастера настольных ролевых игр.

## Установка

```bash
npm install
```

## Запуск

### Запуск Expo сервера
```bash
npm start
```

Затем:
- Нажмите `a` для запуска на Android эмуляторе
- Нажмите `i` для запуска на iOS симуляторе
- Отсканируйте QR-код в приложении Expo Go на вашем устройстве

### Прямой запуск
```bash
npm run android  # Android
npm run ios      # iOS
npm run web      # Web (для тестирования)
```

## Разработка

Проект использует:
- Expo SDK ~50.0.0
- React Native 0.73.2
- TypeScript
- React Context API для управления состоянием

## Структура проекта

```
src/
├── components/    # React компоненты
├── screens/       # Экраны приложения
└── types/         # TypeScript типы
```
