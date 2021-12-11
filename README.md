# PKG 📦

Nástroj na správu balíčků (repozitářů), na kterých je závislá vaše aplikace.

```bash
# Raw Deno
deno --unstable run --allow-all main.ts --config=pkg.json --help


# Compiled Deno
./pkg --help
```

```bash
  --config, --c
        Cesta na konfugurační soubor s balíčky. Výchozí hodnota je "./pkg.json"


  --install, --i
        Naistaluje balíčky z konfiguračního souboru.


  --delete, --uninstall, --clear, --remove
        Smaže balíčky podle konfiguračního souboru.
```


---


## Kompilace spustitelného souboru
Při kompilaci se soubor sám pojmenuje podle operačního systému.

```bash
deno run -A ./bin/compile.ts 
```
```bash
Compile to /some/path/pkg/pkg.macos
> deno --unstable compile --output=pkg.macos --allow-all ./main.ts
> Succeed
```