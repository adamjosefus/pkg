# PKG 📦

PKG is a CLI tool for managing dependecies in your project.

No more copy/paste yours  frameworks, libraries or helpers across multiple works.


---


## Agenda
- [Installations](#installations)
- [Config file](#config-file)
- [Command Line Interface](#command-line-interface)


---


# Installations

1. [Install **Deno 🦕**](https://deno.land/#installation)
2. [Check if your `.deno` folder is in PATH](https://deno.land/manual/tools/script_installer#script-installer)
3. Clone this repository
4. **Install it!**


## Install via **Visual Studio Code**
- Open Repository in VS Code
- Open Command Pallete _(`Ctrl + Shift + P` / `⌘ + Shift + P`)_
    - Select → `Tasks: Run Task`
    - Run → `Install PKG`


## Install via **Terminal**
```sh
deno install \
 --allow-read \
 --allow-write \
 --allow-env \
 --allow-run \
 --allow-net \
 --no-prompt \
 --name pkg \
 ./pkg.ts
```

## Uninstallations
Simple!
```sh
deno uninstall pkg
```


---



## Config File

In your project root folder, must exist configuration file of PKG. Name of the file must be `dependecies.jsonc` or `dependecies.json`. (JSOC is a extension for [JSON with Comments](https://www.npmjs.com/package/jsonc-parser))


### `version`

Version property is a string that represents the version of schema.

Format should be [sematic version](https://semver.org).
 - `1.0.0` is eqivalent to `v1.0.0`
 - `1.2` is eqivalent to `v1.2.0`
 - `1` is eqivalent to `v1.0.0`
 - `1.2.3.4` is eqivalent to `v1.2.3`


```jsonc
{
  "version": "v3.0.0",
}
```

This is a **required** property.


### Destination

Path to the folder where the dependencies will be installed. Relative to localtion of config file.

Value can be `string` or `null`.

```jsonc
{
  "destination": "./dependencies",
}
```


### Repositories
A key-value object of repositories.

The key is the reference/url of the repository. Value is:
- tag of the repository
- specication of the repository
- array of specifications of the repository

```jsonc
{
    "repositories": {
        "<repo>": "<tag>",
        "<repo>": {
            "destination": "<destination>",
            "name": "<name>",
            "tag": "<tag>",
            "disabled": "<boolean>",
        },
        "<repo>": [
            {
                "destination": "<destination>",
                "name": "<name>",
                "tag": "<tag>",
                "disabled": "<boolean>",
            },
            {
                "destination": "<destination>",
                "name": "<name>",
                "tag": "<tag>",
                "disabled": "<boolean>",
            },
            // ...
        ],
        // ...
    },
}
```

#### `destination`
Directory where the dependency will be installed.
If not specified, then fallback to [the common destination](#destination).

```jsonc
{
    "destination": "<destination>",
    "repositories": {
        "<repo>": {
            "destination": "<destination>",
        }
    }
}
```

#### `name`
Name of the dependency folder.
If not specified, then fallback to name of the repository.

```jsonc
{
    "repositories": {
        "<repo>": {
            "name": "<name>",
        }
    }
}
```

#### `tag`
Tag or branch of the repository.
If not specified, then fallback to default branch of repository.

```jsonc
{
    "repositories": {
        "<repo>": "<tag>",
        "<repo>": {
            "tag": "<tag>",
        }
    }
}
```


#### `disabled`
Boolean value that indicates if the dependency is disabled.
Default value is `false`.

```jsonc
{
    "repositories": {
        "<repo>": {
            "disabled": "<boolean>",
        }
    }
}
```


### Ignore
When your project is a package, you can use `ignore` property to ignore (delete) some files or directories after installation.

For specifying the files or directories, you can use [glob syntax](https://www.npmjs.com/package/glob).

All path witch are pointing outside of package be ignored.

```jsonc
{
    "ignore": [
        "<path>",
        "<glob>",
        // ...
    ]
}
```


### Options

```jsonc
{
    "options": {
        "updateNpmConfig": false,
        "installNpmModules": false,
        "useGlobalTokens": false
    }
}
```

#### `updateNpmConfig`

If `true`, then PKG update your `package.json` by dependecies of installed packages.

Default value is `false`.


#### `installNpmModules`

If `true`, then PKG install NPM modules (`npm install`) after installation.

Default value is `false`.


#### `useGlobalTokens`

If `true`, then PKG use global tokens.

Default value is `false`.

---

### Example of a valid configuration file

```jsonc
{
    "destination": "./packages",
    "repositories": {
        "https://github.com/foo.git": [
            {
                "name": "foo_v2",
                "tag": "v2.0.1"
            },
            {
                "name": "foo_v1",
                "tag": "v1.4.2"
            }
        ],
        "https://dev.azure.com/bar": {
            "tag": "v1.0.0"
        }
    },
    "tokens": {
        "dev.azure.com": { "file": "./sercet.txt" }
    },
    "ignore": [
        "src",
        "package-lock.json",
        "tsconfig.json",
        "README.md"
    ],
    "options": {
        "updateNpmConfig": true,
        "installNpmModules": true,
        "useGlobalTokens": true
    }
}
```


---


# Command line Interface

Desciption of the interface you can show with `pkg --help`.

```bash

  --install, --i
        Installs packages from the config file.

  --uninstall, --ui
        Deletes packages according to the config file.
        Requires comfirmation.

  --delete-destinations, --deldest
        Deletes the destination directory.
        Requires comfirmation.

  --tokens, --token
        Extends the token list with the given tokens. (--tokens=<token>@<origin>,...)

  --version, --v
        Print version.
        Stops execution.

  --init
        Initialize config file.
        Use can specify the file extension using the "--init=json" or "--init=jsonc".
        Stops execution.

  --add-global-tokens, --add-global-token
        Sets global tokens to use. (--add-global-tokens=<token>@<origin>,...)
        Tokens will be added to the "/Users/<USER>/.deno/pkg_global_tokens.json".
        Stops execution.

  --update-npm-config
        Overwrites "option.updateNpmConfig" of the config file to update "package.json".
        --update-npm-config=<boolean>

  --install-npm-modules
        Overrides "option.installNpmModules" of the config file to install npm modules.
        --install-npm-modules=<boolean>

  --use-global-tokens
        Overrides "option.useGlobalTokens" of the config file to use global tokens.
        --use-global-tokens=<boolean>

  --skip-version-check
        Disables checking the version of the config files.

  --force
        If true, the script will not ask for confirmation.

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
Bundle to ./your-path/pkg.js
> deno bundle ./pkg.ts ./your-path/pkg.js
> Succeed
```
