# PKG 📦

> You need have [installed Deno](https://deno.land/#installation).

A tool for managing the packages (repositories) on which your application depends. Easily and locally.

```bash
# Raw Deno
deno run -A pkg.ts --config=pkg.json --help


# Compiled Deno
./pkg --help
```

```bash

  --config, --c
        Path to the package configuration file.
        Default value: "pkg.json"


  --install, --i
        Installs packages from the configuration file.
        Default value: false


  --delete, --uninstall
        Deletes packages according to the configuration file.
        Default value: false

```


---


## Compilation to an executable file
During compilation, the file names itself according to the operating system.

```bash
deno run -A ./bin/compile.ts 
```
```bash
Compile to /your-path/pkg.macos
> deno compile --output=pkg.macos --allow-all ./pkg.ts
> Succeed
```



## Bundle to a single executable js file

```bash
deno run -A ./bin/bundle.ts
```
```bash
Bundle to /your-path/pkg.bundled.js
> deno bundle ./pkg.ts ./pkg.bundled.js
> Succeed
```
