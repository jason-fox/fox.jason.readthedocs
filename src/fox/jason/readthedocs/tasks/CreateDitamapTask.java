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
import org.apache.tools.ant.util.FileUtils;

//   This function creates a ditamap from a ReadTheDocs YAML

public class CreateDitamapTask extends Task {
  /**
   * Field file.
   */
  private String file;

  /**
   * Field dir.
   */
  private String dir;

  /**
   * Creates a new <code>CreateDitamapTask</code> instance.
   */
  public CreateDitamapTask() {
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

  private String trimData(String inputText, String key) {
    String text = inputText.replace(key, "").replace("'", "").replace("\"", "");
    if (text.endsWith("\"") || text.endsWith("'")) {
      return text.substring(0, text.length() - 1).trim();
    }
    return text.trim();
  }

  private YamlInfo analyseYAML(String filename) throws IOException {
    String indexFile = FileUtils.readFully(new java.io.FileReader(filename));
    boolean pages = false;
    String title = "";
    List<ChapterInfo> chapters = new ArrayList<>();

    chapters.add(new ChapterInfo("Abstract", new ArrayList<>()));
    int currentChapter = 0;

    for (String inputLine : indexFile.split("\n")) {
      String line = inputLine.trim();

      if (line.startsWith("site_name:")) {
        title = trimData(line, "site_name:");
      } else if (line.startsWith("pages:")) {
        pages = true;
      } else if (line.startsWith("nav:")) {
        pages = true;
      } else if (pages) {
        if (line.startsWith("-")) {
          if (line.endsWith(":")) {
            chapters.add(
              new ChapterInfo(
                trimData(line.substring(0, line.length() - 1), "-"),
                new ArrayList<>()
              )
            );
            currentChapter++;
          } else {
            chapters
              .get(currentChapter)
              .topics.add(
                new TopicInfo(
                  trimData(line.substring(1, line.indexOf(':')).trim(), ""),
                  trimData(line.substring(line.indexOf(':') + 1).trim(), "")
                )
              );
          }
        }
      } else if (line.contains(":")) {
        pages = false;
      }
    }

    return new YamlInfo(title, chapters);
  }

  private class YamlInfo {
    private String title;
    private List<ChapterInfo> chapters;

    public String getTitle() {
      return this.title;
    }

    public List<ChapterInfo> getChapters() {
      return this.chapters;
    }

    public YamlInfo(String title, List<ChapterInfo> chapters) {
      this.title = title;
      this.chapters = chapters;
    }
  }

  private class ChapterInfo {
    private String title;
    private List<TopicInfo> topics;

    public String getTitle() {
      return this.title;
    }

    public List<TopicInfo> getTopics() {
      return this.topics;
    }

    public ChapterInfo(String title, List<TopicInfo> topics) {
      this.title = title;
      this.topics = topics;
    }
  }

  private class TopicInfo {
    private String title;
    private String href;

    public String getTitle() {
      return this.title;
    }

    public String getHref() {
      return href;
    }

    public TopicInfo(String title, String href) {
      this.title = title;
      this.href = href;
    }
  }

  private void rewriteAsDitamap(YamlInfo yaml) {
    boolean initialTopic = true;
    String abstractHref = yaml
      .getChapters()
      .get(0)
      .getTopics()
      .get(0)
      .getHref();

    if ("index.md".equals(abstractHref)) {
      Move move = (Move) getProject().createTask("move");
      move.setFile(new java.io.File(dir + "/index.md"));
      move.setTofile(new java.io.File(dir + "/abstract.md"));
      move.perform();
      abstractHref = "abstract.md";
    }

    StringBuilder bld = new StringBuilder();
    bld.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
    bld.append("<!DOCTYPE bookmap\n");
    bld.append(
      "  PUBLIC \"-//OASIS//DTD DITA BookMap//EN\" \"bookmap.dtd\">\n"
    );
    bld.append("<bookmap>\n");
    bld.append("  <title>" + yaml.getTitle() + "</title>\n");
    bld.append("  <frontmatter>\n");
    bld.append(
      "    <bookabstract format=\"md\" href=\"" + abstractHref + "\"/>\n"
    );
    bld.append("    <booklists>\n");
    bld.append("      <toc/>\n");
    bld.append("    </booklists>\n");
    bld.append("  </frontmatter>\n");

    for (ChapterInfo chapter : yaml.getChapters()) {
      if (initialTopic) {
        // Skip the intial topic - it is the abstract.
        initialTopic = false;
        continue;
      }
      bld.append(
        "  <chapter>\n    <topicmeta>\n     <navtitle>" +
        chapter.getTitle() +
        "</navtitle>\n   </topicmeta>\n"
      );
      for (TopicInfo topic : chapter.getTopics()) {
        bld.append(
          "    <topicref format=\"md\" href=\"" + topic.getHref() + "\"/>\n"
        );
      }
      bld.append("  </chapter>\n");
    }
    bld.append("</bookmap>\n");

    String ditamap = bld.toString();

    Echo task = (Echo) getProject().createTask("echo");
    task.setFile(new java.io.File(dir + "/document.ditamap"));
    task.setMessage(ditamap);
    task.perform();
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
      rewriteAsDitamap(analyseYAML(this.file));
    } catch (IOException e) {
      throw new BuildException("Unable to read file", e);
    }
  }
}
