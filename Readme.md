# WriteTime

 - Description: Diary in conjunction with [Yandex disk](https://disk.yandex.ru/).
 - Status: In work.
 - Website: [link](https://writetime.ru/).
 - Techstack: React, TS, Redux, Mongodb, Nodejs, Docker.

## Development
!WARNING!DOCKER IS REQUIRED!

Download dependencies:
```
npm i 
```

Create docker secrets:
- mongo_user
- mongo_pwd
- client_id
- client_secret
- secret_key
- priv_key
- sert
```
docker secret create SECRET_NAME SECRET_PATH
```
Path fo every secret in docker-*.yml files.

Start server: 
```
npm run dev
```

Start watching for client-side:
```
npm run watch
```

