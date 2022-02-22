# PKG 📦

> You need have [installed Deno](https://deno.land/#installation).

A tool for managing the packages (repositories) on which your application depends. Easily and locally.

## Run

```bash
# Run directly
deno run pkg.ts --config=config.json

# Run directly from remote
deno run https://raw.githubusercontent.com/adamjosefus/pkg/main/pkg.ts --config=config.json

# Run bundled
deno run pkg.bundled.js --config=config.json

# Run compiled for macOS
./pkg.macos --config=config.json

# Run compiled for Windows
./pkg.exe --config=config.json

# Run compiled for Linux
./pkg.linux --config=config.json

```


## Help

```bash
deno run pkg.ts --help

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


## Config

### Schema

```js
{
    "destination": <path-to-dir>, // Optional
    "variables": {
        <name>: <value>,
        <name>: {
            "from": <path-to-file>
        }
    }, // Optional
    "packages": {
        <repo-reference>: {
            "destination": <path-to-dir> // Optional
            "name": <name> // Optional
            "tag": <tag> // Optional
            "variables": {
                <name>: <value>,
                <name>: {
                    "from": <path-to-file>
                }
            } // Optional
        }
    }
}
```

### Example
```json
{
    "destination": "./packages",
    "variables": {
        "ACCESS_TOKEN": {
            "from": "./sercet.txt"
        }
    },
    "packages": {
        "https://github.com/foo.git": [
            {
                "name": "Foo_v1",
                "tag": "v1.0.0"
            },
            {
                "name": "Foo_v2",
                "tag": "v2.1.1"
            }
        ],
        "https://username:${ACCESS_TOKEN}@dev.azure.com/bar": {
            "name": "Bar"
        }
    }
}
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
