# Sign switch

## Requisites

You need Node 22. I recommend FNM, which will change the version used by yout Node projects automatically based in the file `node-version`.

To work with WSL:

```zsh
sudo apt-get install libnss3 libnspr4 libasound2t64
```

## Start

Create and edit `.env` file.

```zsh
cp .env.sample .env
```

Install dependencies:

```zsh
npm install
```

## Use

### Sign in

```zsh
npm run sign-in
```

### Sing out

```zsh
npm run sign-out
```
