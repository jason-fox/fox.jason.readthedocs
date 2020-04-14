/*
 *  This file is part of the DITA-OT ReadtheDocs Plug-in project.
 *  See the accompanying LICENSE file for applicable licenses.
 */

package fox.jason.readthedocs.tasks;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.apache.tools.ant.BuildException;
import org.apache.tools.ant.Task;
import org.apache.tools.ant.taskdefs.Echo;
import org.apache.tools.ant.taskdefs.Move;

//   This function creates ReadTheDocs YAML from a ditamap

public class CreateReadTheDocsTask extends Task {
  /**
   * Field file.
   */
  private String file;

  /**
   * Field dir.
   */
  private String dir;

  /**
   * Creates a new <code>CreateReadTheDocsTask</code> instance.
   */
  public CreateReadTheDocsTask() {
    super();
    this.dir = null;
    this.file = null;
  }

  /**
   * Method setDir.
   *
   * @param dir String
   */
  public void setDir(String dir) {
    this.dir = dir;
  }

  /**
   * Method setFile.
   *
   * @param file String
   */
  public void setFile(String file) {
    this.file = file;
  }

  private String getPropertyOrDefault(String key, String defaultValue) {
    return getProject().getProperty(key) == null
      ? defaultValue
      : getProject().getProperty(key);
  }

  private void rewriteAsYAML(String filename) throws IOException {
    List<String> output = new ArrayList<>();
    String indent = "";

    String css = getPropertyOrDefault("args.css", "");
    String cssPath = getPropertyOrDefault("args.csspath", "");
    String theme = getPropertyOrDefault(
      "args.readthedocs.theme",
      "readthedocs"
    );
    String template = getPropertyOrDefault("user.readthedocs.template", null);

    String indexFile = org.apache.tools.ant.util.FileUtils.readFully(
      new java.io.FileReader(dir + "/" + filename)
    );
    String indexTopic = null;

    if (template != null) {
      output.add(
        org.apache.tools.ant.util.FileUtils.readFully(
          new java.io.FileReader(template)
        )
      );
    }

    for (String inputLine : indexFile.split("\n")) {
      String line = inputLine.trim();
      if (line.startsWith("#")) {
        line = "site_name: '" + line.substring(line.indexOf(' ')) + "'\n";
      } else if (line.startsWith("-")) {
        if (line.contains("[")) {
          String title = line.substring(
            line.indexOf('[') + 1,
            line.indexOf("](")
          );
          String url = line.substring(
            line.indexOf("](") + 2,
            line.lastIndexOf(')')
          );

          if (indexTopic != null) {
            line = indent + " -  '" + title + "': '" + url + "'";
          } else {
            line = "pages:\n-  Home: index.md";
            indexTopic = url;
          }
        } else {
          indent = "    ";
          line = "-  '" + line.substring(line.indexOf(' ')).trim() + "':";
        }
      }

      output.add(line);
    }

    output.add("theme: " + theme);
    if (!"".equals(css)) {
      if (!"".equals(cssPath)) {
        output.add("extra_css: [\"" + cssPath + "/" + css + "\"]");
      } else {
        output.add("extra_css: [\"" + css + "\"]");
      }
    }

    Echo task = (Echo) getProject().createTask("echo");
    task.setFile(new java.io.File(dir + "/mkdocs.yml"));
    task.setMessage(String.join("\n", output));
    task.setForce(true);
    task.perform();

    Move move = (Move) getProject().createTask("move");
    move.setFile(new java.io.File(dir + "/" + indexTopic));
    move.setTofile(new java.io.File(dir + "/index.md"));
    move.perform();
  }

  /**
   * Method execute.
   *
   * @throws BuildException if something goes wrong
   */
  @Override
  public void execute() {
    //	@param  dir -   The directory holding the file
    //	@param  file -  The filename.
    //
    if (this.dir == null) {
      throw new BuildException("You must supply a dir");
    }
    if (this.file == null) {
      throw new BuildException("You must supply a file");
    }

    try {
      rewriteAsYAML(this.file);
    } catch (IOException e) {
      throw new BuildException("Unable to read file", e);
    }
  }
}
