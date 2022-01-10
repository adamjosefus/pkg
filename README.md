# PKG 📦

Nástroj na správu balíčků (repozitářů), na kterých je závislá vaše aplikace.

```bash
# Raw Deno
deno run -A main.ts --config=pkg.json --help


# Compiled Deno
./pkg --help
```

```bash
Verze: 1.1.3

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



## Bundle to jednoho javavascript souboru

```bash
deno run -A ./bin/bundle.ts
```
```bash
Bundle to /some/path/pkg/pkg.bundled.js
> deno bundle ./main.ts ./pkg.bundled.js
> Succeed
```



# VS Code Settings
Aby výstupný vhled byl nejkrásnější, nastavte ve **VS Code**:
```json
{
      ...
      "terminal.integrated.drawBoldTextInBrightColors": false,
      ...
}
```
