# elyts

интернет-магазин с jwt авторизацией и real-time обновлениями статусов заказов.

## функциональность

- регистрация и авторизация через jwt
- каталог товаров с фильтрацией и поиском
- корзина покупок
- создание и отслеживание заказов
- real-time обновления статусов заказов через polling
- пагинация для каталога товаров
- кеширование через redis

## запуск

```bash
docker-compose up -d
```

это запустит:
- postgresql на порту 5432
- redis на порту 6379
- backend на порту 8080
- frontend на порту 3000

откройте http://localhost:3000 в браузере

## эндпоинты

### авторизация

- `POST /api/auth/register` - регистрация нового пользователя
- `POST /api/auth/login` - вход в систему

### товары

- `GET /api/products` - список всех товаров (можно фильтровать по category и search)
- `GET /api/products/{id}` - получить товар по id
- `POST /api/products` - создать товар (требует авторизации)
- `PUT /api/products/{id}` - обновить товар
- `DELETE /api/products/{id}` - удалить товар

### корзина

- `GET /api/cart` - получить корзину пользователя (требует jwt токен)
- `POST /api/cart/add` - добавить товар в корзину
- `PUT /api/cart/update` - обновить количество товара
- `DELETE /api/cart/remove/{productId}` - удалить товар из корзины
- `DELETE /api/cart/clear` - очистить корзину

### заказы

- `GET /api/orders` - получить заказы пользователя (требует jwt токен)
- `GET /api/orders/{id}` - получить заказ по id
- `POST /api/orders/create` - создать заказ из корзины
- `PATCH /api/orders/{id}/status` - изменить статус заказа

## jwt авторизация

после регистрации или входа вы получаете jwt токен. этот токен нужно передавать в заголовке Authorization:

```
Authorization: Bearer <token>
```

токен действителен 24 часа. для доступа к защищенным эндпоинтам (корзина, заказы) требуется валидный токен.

## real-time обновления

статусы заказов обновляются автоматически каждые 5 секунд через polling. при изменении статуса заказа на backend, frontend получит обновление при следующем запросе.

## тесты

запуск тестов backend:
```bash
cd backend
mvn test
```

## структура проекта

```
elyts/
├── backend/
│   ├── src/main/java/com/elyts/
│   │   ├── ElytsApplication.java
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   ├── controller/
│   │   ├── security/
│   │   ├── config/
│   │   └── util/
│   ├── src/test/java/
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml
└── README.md
```

## технологии

- backend: java 11, spring boot, spring security, jwt, spring data jpa, redis
- frontend: react, axios, react-router-dom
- база данных: postgresql
- кеш: redis
- тестирование: junit 5, mockito

