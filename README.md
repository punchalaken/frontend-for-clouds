# Запуск frontend части приложения локально: 

1. Скачать репозиторий:
```
git clone https://github.com/punchalaken/frontend-for-clouds
```

2. Переходим в папку с frontend частью проекта.
```
cd frontend-for-clouds
```

2. Устанавливаем зависимости.
```
npm i 
```

3. Запускаем проект локально для разработки.
```
npm run dev
```

[Запуск bakcend части приложениея](https://github.com/punchalaken/Cloud-for-fiels)

# Запуск на сервере: 


1. Скачать репозиторий:
```
git clone https://github.com/punchalaken/frontend-for-clouds
```
2. Переходим в папку с frontend частью проекта.
```
cd frontend-for-clouds
```
3. Билдим проект:
```
npm run build
```
4. Вписать в консоле: 
```
scp -r dist [ubuntu]@[url]:/home/[ubuntu]/Cloud-for-fiels/
```
Где ubuntu - имя юзера, а url - урл сервера
