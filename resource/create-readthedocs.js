/*
 *  This file is part of the DITA ReadTheDocs project.
 *  See the accompanying LICENSE file for applicable licenses.
 */

function rewriteAsYAML(file, dir) {
  var output = [];
  var indent = '';

  var css = project.getProperty('args.css') || '';
  var cssPath = project.getProperty('args.csspath') || '';
  var theme = project.getProperty('args.readthedocs.theme') || 'readthedocs';
  var template = project.getProperty('user.readthedocs.template') || null;

  var indexFile = org.apache.tools.ant.util.FileUtils.readFully(new java.io.FileReader(dir + '/' + file));
  var input = indexFile.split('\n');
  var indexTopic = null;

  if (template) {
    output.push(org.apache.tools.ant.util.FileUtils.readFully(new java.io.FileReader(template)));
  }

  for (var i = 0; i < input.length; i++) {
    var line = input[i].trim();
    if (line.startsWith('#')) {
      line = "site_name: '" + line.substring(line.indexOf(' ')) + "'\n";
    } else if (line.startsWith('-')) {
      if (line.contains('[')) {
        var title = line.substring(line.indexOf('[') + 1, line.indexOf(']('));
        var url = line.substring(line.indexOf('](') + 2, line.lastIndexOf(')'));

        if (indexTopic) {
          line = indent + " -  '" + title + "': '" + url + "'";
        } else {
          line = 'pages:\n-  Home: index.md';
          indexTopic = url;
        }
      } else {
        indent = '    ';
        line = "-  '" + line.substring(line.indexOf(' ')).trim() + "':";
      }
    }

    output.push(line);
  }

  output.push('theme: ' + theme);
  if (css !== '') {
    if (cssPath !== '') {
      output.push('extra_css: ["' + cssPath + '/' + css + '"]');
    } else {
      output.push('extra_css: ["' + css + '"]');
    }
  }

  var task = project.createTask('echo');
  task.setFile(new java.io.File(dir + '/mkdocs.yml'));
  task.setMessage(output.join('\n'));
  task.setForce(true);
  task.perform();

  var move = project.createTask('move');
  move.setFile(new java.io.File(dir + '/' + indexTopic));
  move.setTofile(new java.io.File(dir + '/index.md'));
  move.perform();
};

var file = attributes.get("file");
var dir = attributes.get("dir");
rewriteAsYAML(file, dir);