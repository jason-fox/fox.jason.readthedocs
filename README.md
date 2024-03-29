# ReadTheDocs Plugin for DITA-OT [<img src="https://jason-fox.github.io/fox.jason.readthedocs/readthedocs.png" align="right" width="300">](https://readthedocsdita-ot.rtfd.io/)

[![license](https://img.shields.io/github/license/jason-fox/fox.jason.readthedocs.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![DITA-OT 4.0](https://img.shields.io/badge/DITA--OT-4.0-green.svg)](http://www.dita-ot.org/4.0)
[![CI](https://github.com/jason-fox/fox.jason.readthedocs/workflows/CI/badge.svg)](https://github.com/jason-fox/fox.jason.readthedocs/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/jason-fox/fox.jason.readthedocs/badge.svg?branch=master)](https://coveralls.io/github/jason-fox/fox.jason.readthedocs?branch=master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=fox.jason.readthedocs&metric=alert_status)](https://sonarcloud.io/dashboard?id=fox.jason.readthedocs)

This is a [DITA-OT Plug-in](https://www.dita-ot.org/plugins) which creates a set of output files suitable to create a
[ReadTheDocs](https://readthedocs.org) Documentation Project. The transform is an extension of the existing DITA-OT
markdown plug-in (`org.lwdita`) and creates a well-formatted `mkdocs.yaml` file

### Sample `mkdocs.yaml` File

```yaml
site_name: "ReadTheDocs Plug-in"

pages:
    - Home: index.md
    - "ReadTheDocs":
          - "Examples": "topics/examples.md"
          - "Full list of features": "topics/features-full.md"
          - "Basic usage": "topics/basic-usage.md"

theme: mkdocs
```

:arrow_forward: [Video from DITA-OT Day 2019](https://youtu.be/vobY_ha5nd0)

[![](https://jason-fox.github.io/fox.jason.readthedocs/javascript-video.png)](https://youtu.be/vobY_ha5nd0)

<details>
<summary><strong>Table of Contents</strong></summary>

-   [Install](#install)
    -   [Installing DITA-OT](#installing-dita-ot)
    -   [Installing the Plug-in](#installing-the-plug-in)
-   [Usage](#usage)
    -   [Creating a ReadtheDocs Project out of existing DITA content](#creating-a-readthedocs-project-out-of-existing-dita-content)
    -   [Coverting a ReadtheDocs Project into DITA content](#coverting-a-readthedocs-into-dita)
    -   [Parameter Reference](#parameter-reference)
-   [Contribute](#contribute)
-   [License](#license)

</details>

## Install

The ReadTheDocs Plug-in for DITA-OT has been tested against [DITA-OT 4.x](http://www.dita-ot.org/download). It is
recommended that you upgrade to the latest version.

### Installing DITA-OT

<a href="https://www.dita-ot.org"><img src="https://www.dita-ot.org/images/dita-ot-logo.svg" align="right" width="55" height="55"></a>

The ReadTheDocs Plug-in for DITA-OT is a plug-in for the DITA Open Toolkit.

-   Full installation instructions for downloading DITA-OT can be found
    [here](https://www.dita-ot.org/4.0/topics/installing-client.html).

    1.  Download the `dita-ot-4.0.zip` package from the project website at
        [dita-ot.org/download](https://www.dita-ot.org/download)
    2.  Extract the contents of the package to the directory where you want to install DITA-OT.
    3.  **Optional**: Add the absolute path for the `bin` directory to the _PATH_ system variable. This defines the
        necessary environment variable to run the `dita` command from the command line.

```console
curl -LO https://github.com/dita-ot/dita-ot/releases/download/4.0/dita-ot-4.0.zip
unzip -q dita-ot-4.0.zip
rm dita-ot-4.0.zip
```

### Installing the Plug-in

-   Run the plug-in installation command:

```console
dita install https://github.com/jason-fox/fox.jason.readthedocs/archive/master.zip
```

The `dita` command line tool requires no additional configuration.

---

## Usage

Like any other transform, when invoked directly, the ReadTheDocs transforms require an input document

### Creating a ReadtheDocs Project out of existing DITA content

To create the files for a ReadtheDocs project, use the `readthedocs` transform, set the `--input` parameter to point to
a `*.ditamap` file:

```console
PATH_TO_DITA_OT/bin/dita -f readthedocs -i document.ditamap
```

### Coverting a ReadtheDocs Project into DITA content

To create the files for a DITA-OT project, use the `mkdocs2dita` transform and set the `--input` parameter to point to a
`mkdocs.yml` file:

```console
PATH_TO_DITA_OT/bin/dita -f mkdocs2dita -i mkdocs.yml
```

### Parameter Reference

-   `args.css` - Specifies the name of a custom `.css` file. The css is added to the `mkdocs.yml` file as `extra_css`
-   `args.csspath` - Specifies the location of a copied `.css` file relative to the output directory.
-   `args.cssroot` - Specifies the directory that contains the custom `.css` file.
-   `args.readthedocs.theme` - Specifies a `theme` to style the ReadTheDocs output (default: `readthedocs`)
-   `args.readthedocs.template` - Specifies a template `mkdocs.yml` file to use - the template can hold additional
    readthedocs attributes which are not generated by the transform.
-   `args.readthedocs.use.pages` -  Specifies whether to use `pages` rather than `nav` (default `no`)

## Contribute

PRs accepted.

## License

[Apache 2.0](LICENSE) © 2019 - 2022 Jason Fox
