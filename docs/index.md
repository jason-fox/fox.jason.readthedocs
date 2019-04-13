<h1>ReadTheDocs Plugin for DITA-OT</h1>


This is a DITA-OT Plug-in which creates a set of output files suitable to create a [ReadTheDocs](https://readthedocs.org) documentation project. The transform is an extension of the existing DITA-OT markdown plug-in (`org.lwdita`) and creates a well-formatted `mkdocs.yaml` file

### Sample MkDocs.yaml File

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


Additionally it is possible to use the plug-in to create a `*.ditamap` file from an existing `mkdocs.yaml` file

### Sample Ditamap

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE bookmap
  PUBLIC "-//OASIS//DTD DITA BookMap//EN" "bookmap.dtd">
<bookmap>
  <title>ReadTheDocs Plug-in</title>
  <frontmatter>
    <bookabstract format="md" href="index.md"/>
    <booklists>
      <toc/>
    </booklists>
  </frontmatter>
  <chapter>
    <topicmeta>
        <navtitle>ReadTheDocs</navtitle>
    </topicmeta>
    <topicref format="md" href="topics/examples.md"/>
    <topicref format="md" href="topics/features-full.md"/>
    <topicref format="md" href="topics/basic-usage.md"/>
  </chapter>
</bookmap>
```

### Limitations

It is assumed that the underlying markdown is well-formed and usable by DITA-OT - in other words every
heading must be at most one level deeper that the previous heading. To ensure this, it is recommended 
to  prettify the existing markdown using [prettier](https://prettier.io) and fix the markup levels
using the [DITA Validator](https://dita-validator-for-dita-ot.readthedocs.io/en/latest/) `fix-dita`
transform.

In general, the structure of a ReadTheDocs project is more limited than a typical `*.ditamap`, for 
example, an  `index.md` summary file is should be found root of the project  - this is the equivalent
of a `<bookabstract>`. For the `readthedocs` transform, the opening topic of the ditamap will be used 
as the `index.md` if no `<bookabstract>` is found. Also `<chapter>` divisions should be given a 
`<navtitle>` only and no `href` if they are to be recognized as such in the ReadTheDocs navigation 
sidebar. 


