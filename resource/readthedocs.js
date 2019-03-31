/*
 *  This file is part of the DITA ReadTheDocs project.
 *  See the accompanying LICENSE file for applicable licenses.
 */

ReadTheDocs = {};

ReadTheDocs.analyseYAML = function(file) {
  var indexFile = org.apache.tools.ant.util.FileUtils.readFully(
    new java.io.FileReader(file)
  );
  var input = indexFile.split("\n");
  var pages = false;
  var title = "";
  var chapters = [{ title: "Abstract", topics: [] }];
  var currentChapter = 0;

  var trimData = function(input, key) {
    text = input
      .replace(key, "")
      .replace("'", "")
      .replace('"', "");
    if (text.endsWith("'") || text.endsWith('"')) {
      return text.substring(0, text.length - 1).trim();
    }
    return text.trim();
  };

  for (var i = 0; i < input.length; i++) {
    var line = input[i].trim();

    if (line.startsWith("site_name:")) {
      title = trimData(line, "site_name:");
    } else if (line.startsWith("pages:")) {
      pages = true;
    } else if (pages) {
      if (line.startsWith("-")) {
        if (line.endsWith(":")) {
          chapters.push({
            title: trimData(line.substring(0, line.length - 1), "-"),
            topics: []
          });
          currentChapter++;
        } else {
          chapters[currentChapter].topics.push({
            title: trimData(line.substring(1, line.indexOf(":")).trim()),
            href: trimData(line.substring(line.indexOf(":") + 1).trim())
          });
        }
      }
    } else if (line.contains(":")) {
      pages = false;
    }
  }

  return {
    title: title,
    chapters: chapters
  };
};

ReadTheDocs.rewriteAsYAML = function(file, dir) {
  var output = [];
  var indent = "";

  var css = project.getProperty("args.css") || "";
  var cssPath = project.getProperty("args.csspath") || "";
  var theme = project.getProperty("args.readthedocs.theme") || "readthedocs";
  var template = project.getProperty("user.readthedocs.template") || null;

  var indexFile = org.apache.tools.ant.util.FileUtils.readFully(
    new java.io.FileReader(dir + "/" + file)
  );
  var input = indexFile.split("\n");
  var indexTopic = null;

  if (template) {
    output.push(
      org.apache.tools.ant.util.FileUtils.readFully(
        new java.io.FileReader(template)
      )
    );
  }

  for (var i = 0; i < input.length; i++) {
    var line = input[i].trim();
    if (line.startsWith("#")) {
      line = "site_name: '" + line.substring(line.indexOf(" ")) + "'\n";
    } else if (line.startsWith("-")) {
      if (line.contains("[")) {
        var title = line.substring(line.indexOf("[") + 1, line.indexOf("]("));
        var url = line.substring(line.indexOf("](") + 2, line.lastIndexOf(")"));

        if (indexTopic) {
          line = indent + " -  '" + title + "': '" + url + "'";
        } else {
          line = "pages:\n-  Home: index.md";
          indexTopic = url;
        }
      } else {
        indent = "    ";
        line = "-  '" + line.substring(line.indexOf(" ")).trim() + "':";
      }
    }

    output.push(line);
  }

  output.push("theme: " + theme);
  if (css !== "") {
    if (cssPath !== "") {
      output.push('extra_css: ["' + cssPath + "/" + css + '"]');
    } else {
      output.push('extra_css: ["' + css + '"]');
    }
  }

  var task = project.createTask("echo");
  task.setFile(new java.io.File(dir + "/mkdocs.yml"));
  task.setMessage(output.join("\n"));
  task.setForce(true);
  task.perform();

  var move = project.createTask("move");
  move.setFile(new java.io.File(dir + "/" + indexTopic));
  move.setTofile(new java.io.File(dir + "/index.md"));
  move.perform();
};

ReadTheDocs.rewriteAsDitamap = function(yaml, dir) {
  var abstractHref = yaml.chapters[0].topics[0].href;

  if (abstractHref === "index.md") {
    var move = project.createTask("move");
    move.setFile(new java.io.File(dir + "/index.md"));
    move.setTofile(new java.io.File(dir + "/abstract.md"));
    move.perform();
    abstractHref = "abstract.md";
  }

  var ditamap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  ditamap += "<!DOCTYPE bookmap\n";
  ditamap += '  PUBLIC "-//OASIS//DTD DITA BookMap//EN" "bookmap.dtd">\n';
  ditamap += "<bookmap>\n";
  ditamap += "  <title>" + yaml.title + "</title>\n";
  ditamap += "  <frontmatter>\n";
  ditamap += '    <bookabstract format="md" href="' + abstractHref + '"/>\n';
  ditamap += "    <booklists>\n";
  ditamap += "      <toc/>\n";
  ditamap += "    </booklists>\n";
  ditamap += "  </frontmatter>\n";

  for (var i = 1; i < yaml.chapters.length; i++) {
    ditamap =
      ditamap +
      "  <chapter>\n    <topicmeta>\n     <navtitle>" +
      yaml.chapters[i].title +
      "</navtitle>\n   </topicmeta>\n";
    for (var j = 0; j < yaml.chapters[i].topics.length; j++) {
      ditamap +=
        '    <topicref format="md" href="' +
        yaml.chapters[i].topics[j].href +
        '"/>\n';
    }
    ditamap += "  </chapter>\n";
  }
  ditamap += "</bookmap>\n";

  var task = project.createTask("echo");
  task.setFile(new java.io.File(dir + "/document.ditamap"));
  task.setMessage(ditamap);
  task.perform();
};
