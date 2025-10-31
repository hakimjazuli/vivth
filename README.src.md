## HOW TO INSTALL

- example uses `npm`, you can allways use your own favourite package manager;

```shell
npm i vivth
```

## vivth

- `vivth` are intended to be a collections of usefull `primitives`, and not to be directly used as
  underlying framework;
- `vivth` are leaning to `esm(.mjs)+jsdoc` first;
  > - some functionality "might need" work around if you are using other than `esm+jsdoc`;
  > - `CompileJS`, `ESBundler` expose `format` option for some leeway for `commonJS`;
- completely `JSruntime` agnostic:
  > - instead of `vivth` trying to guess, all runtime specific API should be provided by dev;
- contains helpers to help you write data driven javascript program, including:
  > - collections of extremely ⚡ performant `signal` classes;
  >   > - `vivth` deliberately take away `auto-subscription`:
  >   >   > - and introducing more imperative way of subsrciption yet still simple enough, which in
  >   >   >   turn, it completely removes total code blocking on previously needed auto subsrciption
  >   >   >   process on first run;
  >   >   > - and also make previously unthinkable dynamic subscription on conditionals that runs
  >   >   >   outside first run, now completely possible;
  > - collections of `queue-helper` classes;
  > - fully typed `worker-threads` abstraction;
  > - ` error as value` function helper;
  > - opionated `autoDocumentation`;
  > - opionated `bundler`:
  >   > - abstracted via `esbuild`;
  > - opionated `compiler`;
  >   > - abstracted via `pkg`, `deno`, and `bun`;

## versions:

- `1.0.0+:beta`:

  > - beta release;
  > - checking edge cases;
  > - stable API, the exposed API access are highly unlikely to changes, only the underlying code
  >   might changes for improving performance;

- `1.3.x:beta`:
  > - type should now fully fixed, even with strict ts check;
- `1.3.3+:beta`:
  > - added class `Dev` for testing and `Dev`/`preBundled` only code block;
