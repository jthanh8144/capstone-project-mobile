# Safe Talk mobile application

## Release version

- [Latest](https://minio.jthanh8144.studio/safe-talk-production/SafeTalk.apk)

<!-- ## Demo
[![Demo](https://img.youtube.com/vi/_8mVyfxF-9o/0.jpg)](https://www.youtube.com/watch?v=_8mVyfxF-9o) -->

## Debug steps

1. Install dependencies
```
yarn install --frozen-lockfile
```

2. Create `.env` file
```
cp example.env .env
```

3. Fill API url, socket url and VideoSDK token to `.env` file.

4. Run debug application

- For Android
```
yarn android
```

- For iOS
```
yarn ios
```
