```
cd app

bun run gen-i18n // 生成jsons文件夹下的所有json文件

bun run gen-i18n {sheetName} // 生成locales文件夹下的对应模块文件

eg: bun run gen-i18n 佣金奖励 // 生成locales文件夹下的佣金奖励模块文件

bun run gen-i18n {sheetName} {scopeName} // 生成locales文件夹下的对应模块文件并且合并到lacales下 
值得注意的是 如果scopeName为空 则不会合并到locales下 只会在jsons下生成json文件 

#scopeName不能重名！！！

eg: bun run gen-i18n 佣金奖励 newtrans // 生成locales文件夹下的佣金奖励模块文件并且合并到lacales下


其中key: 自增key
```
