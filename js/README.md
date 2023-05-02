Until the Gradle build does it automatically, changes to the JS sub-project need to be synced to the parent project:
```shell
yarn build && cp dist/index.js ../src/main/resources/index.js
```