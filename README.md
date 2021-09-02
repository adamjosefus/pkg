# Packager 📦

Nástroj na správu balíčků (repozitářů), na kterých je závislá vaše aplikace.

```bash
# Raw Deno
deno --unstable run --allow-read=. --allow-write=. --allow-run=git mod.ts --config=lib/packager.json --help


# Compiled Deno
./packager --help
```

```bash
  --config, --c
        Cesta na konfugurační soubor s balíčky. Výchozí hodnota je "./packager.json"


  --install, --i
        Naistaluje balíčky z konfiguračního souboru.


  --delete, --uninstall, --clear, --remove
        Smaže balíčky podle konfiguračního souboru.
```
