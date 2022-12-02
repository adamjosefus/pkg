# Packager <img src="https://upload.wikimedia.org/wikipedia/commons/e/e8/Deno_2021.svg" style="width: 1em; vertical-align: text-bottom; margin: .1em .3em">

Packager is a CLI tool for managing dependecies in your project.

No more copy/paste yours  frameworks, libraries or helpers across multiple works.

---

- [Installations](#installations)
- [Config file](#config-file)
  - [Example of config file](#example-of-config-file)
  - [Schema of config file](#schema-of-config-file)
  - [Properties of Config file](#properties-of-config-file)
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
    - Run → `Install Packager`


## Install via **Terminal**
```sh
deno install \
 --allow-read \
 --allow-write \
 --allow-env \
 --allow-run \
 --allow-net \
 --no-prompt \
 --name packager \
 ./packager.ts
```

## Uninstallations
Simple!
```sh
deno uninstall packager
```


---



# Config file

**In your project root folder** must be created Packager configuration file named  `dependecies.jsonc` or `dependecies.json`. (JSOC is a extension for [JSON with Comments](https://www.npmjs.com/package/jsonc-parser))
You can create it by two different ways: **by hand or by command line**.



## Example of Config file

```jsonc
{
    "version": "v2.1.3",
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
        "https://dev.azure.com/bar": "v1.0.0"
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


## Schema of config file

```ts
{
    "version": "<version>",
    "destination"?: "<path-to-dir>",
    "repositories"?: {
        "<repo>": "<tag>",
        "<repo>": {
            "destination"?: "<path-to-dir>",
            "name"?: "<name>",
            "tag"?: "<tag>",
            "disabled"?: "<boolean>",
        },
        "<repo>": [
            {
                "destination"?: "<path-to-dir>",
                "name"?: "<name>",
                "tag"?: "<tag>",
                "disabled"?: "<boolean>",
            },
            // ...
        ],
        // ...
    },
    "tokens"?: {
        "<origin>": { "file": "<path-to-secret>" },
        "<origin>": "<secret>",
        // ...
    },
    "ignore"?: [
        "<glob-path>",
        // ...
    ],
    "options"?: {
        "updateNpmConfig"?: "<boolean>",
        "installNpmModules"?: "<boolean>",
        "useGlobalTokens"?: "<boolean>"
    }
}
```


---


## Properties of Config file

### Version

Version property is a string that represents the version of schema.

Format should be [sematic version](https://semver.org).
 - `1.0.0` is eqivalent to `v1.0.0`
 - `1.2` is eqivalent to `v1.2.0`
 - `1` is eqivalent to `v1.0.0`
 - `1.2.3.4` is eqivalent to `v1.2.3`

This is a **required** property.


---


### Destination

Path to the folder where the dependencies will be installed. Relative to localtion of config file.

Value can be `string` or `null`.


---


### Repositories
A key-value object of repositories.

The key is the reference/url of the repository. Value could be:
- tag of the repository
- specication of the repository
- array of specifications of the repository


#### Repo Destination
Directory where the dependency will be installed.
If not specified, then fallback to [the common destination](#destination).


#### Repo Name
Name of the dependency folder.
If not specified, then fallback to name of the repository.


#### Repo Tag
Tag or branch of the repository.
If not specified, then fallback to default branch of repository.


#### Repo Disabled
Boolean value that indicates if the dependency is disabled. That could be useful for debugging.
<br> value is `false`.


---


### Ignore
When your project is a package, you can use `ignore` property to ignore (delete) some files or directories after installation.

For specifying the files or directories, you can use [glob syntax (`**/*`)](https://www.npmjs.com/package/glob).

All path witch are pointing outside of package be skipped.


---


### Options
#### Option Update NPM Config

If `true`, then Packager update your `package.json` by dependecies of installed packages.
<br>Default value is `false`.


#### Option Install NPM Config

If `true`, then Packager install NPM modules (`npm install`) after installation.
<br>Default value is `false`.


#### Option Use Global Tokens

If `true`, then Packager use global tokens.
<br>Default value is `false`.



---



# Command line Interface

Desciption of the interface you can show with: `packager --help`.

```bash

  --init
        Initialize config file.
        Use can specify the file extension using the "--init=json" or "--init=jsonc".
        Stops execution.

  --install, --i
        Installs packages from the config file.

  --uninstall
        Deletes packages according to the config file.
        Requires comfirmation.

  --update, --reinstall, --u
        Shortcut for "--uninstall" and "--install".

  --delete-destinations, --deldest
        Deletes the destination directory.
        Requires comfirmation.

  --tokens, --token
        Extends the token list with the given tokens. (--tokens=<token>@<origin>,...)

  --version, --v
        Print version.
        Stops execution.

  --add-global-tokens, --add-global-token
        Sets global tokens to use. (--add-global-tokens=<token>@<origin>,...)
        Tokens will be added to the "/Users/<USER>/.deno/packager_global_tokens.json".
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

  --force, --f
        If true, the script will not ask for confirmation.

```
