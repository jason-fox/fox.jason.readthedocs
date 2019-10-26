/*
 *  This file is part of the DITA ReadTheDocs project.
 *  See the accompanying LICENSE file for applicable licenses.
 */

var file = attributes.get("file");
var dir = attributes.get("dir");

function analyseYAML(filename) {
  var indexFile = org.apache.tools.ant.util.FileUtils.readFully(new java.io.FileReader(filename));
  var input = indexFile.split('\n');
  var pages = false;
  var title = '';
  var chapters = [{ title: 'Abstract', topics: [] }];
  var currentChapter = 0;

  var trimData = function(inputText, key) {
    var text = inputText
      .replace(key, '')
      .replace("'", '')
      .replace('"', '');
    if (text.endsWith("'") || text.endsWith('"')) {
      return text.substring(0, text.length - 1).trim();
    }
    return text.trim();
  };

  for (var i = 0; i < input.length; i++) {
    var line = input[i].trim();

    if (line.startsWith('site_name:')) {
      title = trimData(line, 'site_name:');
    } else if (line.startsWith('pages:')) {
      pages = true;
    } else if (pages) {
      if (line.startsWith('-')) {
        if (line.endsWith(':')) {
          chapters.push({
            title: trimData(line.substring(0, line.length - 1), '-'),
            topics: []
          });
          currentChapter++;
        } else {
          chapters[currentChapter].topics.push({
            title: trimData(line.substring(1, line.indexOf(':')).trim()),
            href: trimData(line.substring(line.indexOf(':') + 1).trim())
          });
        }
      }
    } else if (line.contains(':')) {
      pages = false;
    }
  }

  return {
    title: title,
    chapters: chapters
  };
}

function rewriteAsDitamap (yaml) {
  var abstractHref = yaml.chapters[0].topics[0].href;

  if (abstractHref === 'index.md') {
    var move = project.createTask('move');
    move.setFile(new java.io.File(dir + '/index.md'));
    move.setTofile(new java.io.File(dir + '/abstract.md'));
    move.perform();
    abstractHref = 'abstract.md';
  }

  var ditamap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  ditamap += '<!DOCTYPE bookmap\n';
  ditamap += '  PUBLIC "-//OASIS//DTD DITA BookMap//EN" "bookmap.dtd">\n';
  ditamap += '<bookmap>\n';
  ditamap += '  <title>' + yaml.title + '</title>\n';
  ditamap += '  <frontmatter>\n';
  ditamap += '    <bookabstract format="md" href="' + abstractHref + '"/>\n';
  ditamap += '    <booklists>\n';
  ditamap += '      <toc/>\n';
  ditamap += '    </booklists>\n';
  ditamap += '  </frontmatter>\n';

  for (var i = 1; i < yaml.chapters.length; i++) {
    ditamap =
      ditamap +
      '  <chapter>\n    <topicmeta>\n     <navtitle>' +
      yaml.chapters[i].title +
      '</navtitle>\n   </topicmeta>\n';
    for (var j = 0; j < yaml.chapters[i].topics.length; j++) {
      ditamap += '    <topicref format="md" href="' + yaml.chapters[i].topics[j].href + '"/>\n';
    }
    ditamap += '  </chapter>\n';
  }
  ditamap += '</bookmap>\n';

  var task = project.createTask('echo');
  task.setFile(new java.io.File(dir + '/document.ditamap'));
  task.setMessage(ditamap);
  task.perform();
}


rewriteAsDitamap(analyseYAML(file));