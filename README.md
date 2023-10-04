# PrivataFrontend

This is Privata Client using electron, typescript & react, and bundled by ElectronForge.

## How is this been set up

- https://www.electronforge.io/templates/typescript-+-webpack-template
- https://www.electronforge.io/guides/framework-integration/react-with-typescript
- https://samdecrock.medium.com/building-electron-js-apps-with-react-js-2022-4d14fb2924ac

## Delevopment

### Read Before Coding

1. 公有的类型声明放在 [`common-types`](https://github.com/AierLab/privata-types) 里面，引用时使用 `@privata/types/xxx`。
2. 每个项目的私有类型声明都是 `types` 打头， e.g. `types/security-key`。
   > 为什么不用 `@types`? 因为 `@types` 是个保留，会去找 `node_modules/@types`。
3. 如果你遇到了引用出问题的情况，可以运行 `tsc --traceResolution`，然后搜索你引用的包名即可。

### Run in development

1. Navigate to `react-app` and `electron-app`, in both folder, run `npm install`.
2. Navigate to `react-app`, run following command to start react development server, and leave it running.
   ```console
   $ npm run start
   ```
3. Navigate to `electron-app`, run following command to open electron window
   ```console
   $ npm run start
   ```

## Build

1. Run `npm run build` at `react-app` folder to build react pages.
2. Run `npm run make` at `electorn` folder to bundle react app & electron into one package.

---

## Git

新的功能在主分支上新建分支 (还是不要在功能分支上再建分支了，不然不好合并)

做完后在 github 上 new `pull request` -> master, 看下没问题的话自己 merge 了就 OK, 顺手 `Delete branch` 把分支删掉

当然时间久了, 本地难免会出现很多在 github 上早已被删的冗余分支, 清理: `git fetch -p`
