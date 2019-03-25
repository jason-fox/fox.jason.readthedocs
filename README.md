# ReadTheDocs Plugin for DITA-OT

[![license](https://img.shields.io/github/license/jason-fox/fox.jason.readthedocs.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![DITA-OT 3.3](https://img.shields.io/badge/DITA--OT-3.3-blue.svg)](http://www.dita-ot.org/3.3/)<br/>
[![Documentation Status](https://readthedocs.org/projects/readthedocsdita-ot/badge/?version=latest)](https://readthedocsdita-ot.readthedocs.io/en/latest/?badge=latest)


This is a DITA-OT Plug-in which creates a set of output files suitable to create a [ReadTheDocs](https://readthedocs.org) Documentation Project. The transform is an extension of the existing DITA-OT markdown plug-in (`org.lwdita`)
and creates a well-formatted `mkdocs.yaml` file

### Sample `mkdocs.yaml` File

```yaml
site_name: 'ReadTheDocs Plug-in'

pages:
  -  Home: index.md
  -  'ReadTheDocs':
       -  'Examples': 'topics/examples.md'
       -  'Full list of features': 'topics/features-full.md'
       -  'Basic usage': 'topics/basic-usage.md'

theme: mkdocs
```

# Table of Contents

-   [Install](#install)
    -   [Installing DITA-OT](#installing-dita-ot)
    -   [Installing the Plug-in](#installing-the-plug-in)
-   [Usage](#usage)
    -   [Creating a ReadtheDocs Project from DITA content](#creating-a-readthedocs-Project-from-dita-content)
    -   [Parameter Reference](#parameter-reference)
-   [Contribute](#contribute)
-   [License](#license)

# Install

The ReadTheDocs Plug-in for DITA-OT has been tested against [DITA-OT 3.x](http://www.dita-ot.org/download). It is recommended
that you upgrade to the latest version.

## Installing DITA-OT

The ReadTheDocs Plug-in for DITA-OT is a plug-in for the DITA Open Toolkit.

-   Full installation instructions for downloading DITA-OT can be found
    [here](https://www.dita-ot.org/3.2/topics/installing-client.html).

    1.  Download the `dita-ot-3.3.zip` package from the project website at
        [dita-ot.org/download](https://www.dita-ot.org/download)
    2.  Extract the contents of the package to the directory where you want to install DITA-OT.
    3.  **Optional**: Add the absolute path for the `bin` directory to the _PATH_ system variable. This defines the
        necessary environment variable to run the `dita` command from the command line.

```console
curl -LO https://github.com/dita-ot/dita-ot/releases/download/3.3/dita-ot-3.3.zip
unzip -q dita-ot-3.3.zip
rm dita-ot-3.3.zip
```

## Installing the Plug-in

-   Run the plug-in installation command:

```console
dita -install https://github.com/jason-fox/fox.jason.readthedocs/archive/master.zip
```

The `dita` command line tool requires no additional configuration.

# Usage

Like any other transform, when invoked directly, the readthedocs transform requires an input document

### Creating a ReadtheDocs Project from DITA content

To create the files for a ReadtheDocs project, use the `readthedocs` transform,  set the `--input` parameter to point to a `*.ditamap` file:

```bash
PATH_TO_DITA_OT/bin/dita -f readthedocs -i document.ditamap
```

### Parameter Reference

-    `args.css` - Specifies the name of a custom `.css` file. The css is added to the `mkdocs.yml` file as `extra_css`
-    `args.csspath` - Specifies the location of a copied `.css` file relative to the output directory.
-    `args.cssroot` - Specifies the directory that contains the custom `.css` file.
-    `args.readthedocs.theme` - Specifies a `theme` to style the ReadTheDocs output (default: `readthedocs`)
-    `args.readthedocs.template` - Specifies a template `mkdocs.yml` file to use - the template can hold additional readthedocs attributes which are not generated by the transform.

# Contribute

PRs accepted.

# License

[Apache 2.0](LICENSE) © 2019 Jason Fox
