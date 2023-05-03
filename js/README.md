Until the Gradle build does it automatically, changes to the JS sub-project need to be synced to the parent project.

The first time you check out the project, or when you change `package.json`, run (all commands from the `js` dir):
```shell
nvm use
yarn install
```

You will also need to run `nvm use` any time you are using a fresh terminal.

When you make changes to `index.ts`, run:
```shell
yarn build && cp dist/index.js ../src/main/resources/index.js
```

When you make changes to code generation, run:
```shell
yarn generate
```