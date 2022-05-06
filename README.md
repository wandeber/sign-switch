# How to use

## Configuration

```sh
cp cypress.env.sample.json cypress.env.json
```

Edit `cypress.env.json` to set environment variables.

## Open the browser for check or edit tests

```sh
yarn run cypress:open
```

## Auto sign-in and sign-out

For sign in:

```sh
yarn run cypress:run:sign-in
```

For sign out:

```sh
yarn run cypress:run:sign-out
```

## Video of the process

After run any operation, you can find an MP4 video of every step in ./cypress/videos
