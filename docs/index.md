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