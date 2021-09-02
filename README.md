# PKG 📦

Nástroj na správu balíčků (repozitářů), na kterých je závislá vaše aplikace.

```bash
# Raw Deno
deno --unstable run -a main.ts --config=lib/pkg.json --help


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
