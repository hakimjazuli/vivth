## HOW TO INSTALL

- example uses `npm`, you can allways use your own favourite package manager;

```shell
npm i vivth
```

---

## vivth

- `vivth` are intended to be a collections of usefull `primitives`, and not to be directly used as
  underlying framework;
- `vivth` are leaning to `esm(.mjs)+jsdoc` first;
  > - some functionality "might need" work around if you are using other than `esm+jsdoc`;
- contains helpers to help you write data driven javascript program, including:
  > - collections of ⚡ performant `signal` classes;
  >   > - `vivth` deliberately take away `auto-subscription`:
  >   >   > - and introducing more imperative way of subsrciption yet still simple enough, which in
  >   >   >   turn, it completely removes abstraction performance headsup on previously needed auto
  >   >   >   subsrciption process on first run;
  >   >   > - and also make previously unthinkable dynamic subscription on conditionals that runs
  >   >   >   outside first run, now completely possible;
  > - collections of `queue-helper` classes;
  > - fully typed `worker-threads` abstraction;
  > - ` error as value` function helper;
  > - opionated `autoDocumentation`;
  > - opionated `bundler`:
  >   > - abstracted via `esbuild`;
  > - opionated `compiler`;
  >   > - abstracted via `bun`;
- core `dependency`:
  > - `bunJS`(hard mandatory);
  > - `nodeJS`(checks for compatibility if you need to run things in node instead of bun);

---

## versions:

- `1.0.0+:beta`:

  > - beta release;
  > - checking edge cases;
  > - <strike>stable API, the exposed API access are highly unlikely to changes, only the underlying
  >   code might changes for improving performance</strike>;

- `1.3.x:beta`:
  > - type should now fully fixed, even with strict ts check;
- `1.3.3+:beta`:
  > - added class `Dev` for testing and `Dev`/`preBundled` only code block;
- `1.5.x:rc`:
  > - move code stripping to [BundledV](#bundledv);
  > - [EnvMode](#envmode) are now independent from whether it's bundled or not, and need to be
  >   separately declared;
  > - add mechanism for `Effect` callback to run periodically when under heavy calls;
  > - move all logic for `FSInline` to [FSasar](#fsasar);
  > - modify [JSautoDoc](#jsautodoc) for `multi-exports`, as to prevent runtime to run incorrect
  >   platform module due to importing from `libName` still walktrhough all of listed exports
  >   regardless if it's being imported or not;
