const { readFile, readdirSync, writeFile, lstatSync, mkdirSync } = require("fs");

const commander = require("commander");
const { marked } = require("marked");
const path = require("path");

const capitalize = (str) =>
  str
    .split(" ")
    .map((s) => (s ? s[0].toUpperCase() + s.substr(1) : s))
    .join(" ");

const readMarkdownFile = async (filename, cwd) => {
  const mdFilePath = path.resolve(cwd, filename);
  return new Promise((resolve, reject) => {
    readFile(mdFilePath, { encoding: "utf-8" }, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

const translateMarkdownFileToHtml = async (filename, cwd, baseUrl) => {
  const mdFileContents = await readMarkdownFile(filename, cwd);
  if (mdFileContents) {
    return marked(mdFileContents, { baseUrl });
  }
  return null;
};

const createLinks = (cwd, pathname, writeFile) => {
  const filepath = path.resolve(cwd, pathname);
  const lstat = lstatSync(filepath);
  if (lstat.isDirectory()) {
    const linkDir = readdirSync(filepath);
    console.info("Reading directory:", pathname);

    const links = linkDir
      .map((file) => {
        const fileLstat = lstatSync(path.resolve(filepath, file));
        if (fileLstat.isFile()) {
          return file;
        } else if (fileLstat.isDirectory() && (file === "assets" || file === "static")) {
          return `🖼${file}`;
        }
        return null;
      })
      .filter((a) => a)
      .map((link, i, a) => {
        const branch = i === a.length - 1 ? "┗" : "┠";
        const isMd = link.toLowerCase().endsWith(".md");
        const linkNoExtension = isMd
          ? link.substring(0, link.length - 3)
          : link;

        // TODO: this is ugly. fix this.
        return `${branch} [${isMd ? "📝" : ""}${capitalize(
          linkNoExtension
        )}](<${pathname}/${link.includes("🖼") ? link.split("🖼")[1] : link}>)`;
      })
      .join("  \n");

    return `## 📁${pathname}\n\n${links}`;
  } else if (pathname !== writeFile && pathname.toLowerCase().endsWith(".md")) {
    return capitalize(pathname);
  }

  return null;
};

const compileStrings = async (args, { defaultCwd, defaultFile }) => {
  let { p, f } = args;
  const notesCwd = p || defaultCwd;
  const notesFolderContents = readdirSync(notesCwd, { encoding: "utf-8" });
  const filename = f || defaultFile;
  console.info("Compiling", filename);

  const noteFileContentArray = notesFolderContents
    .map((potentialNoteFile) =>
      createLinks(notesCwd, potentialNoteFile, filename)
    )
    .filter((a) => a);

  console.log();

  return new Promise((resolve, reject) => {
    try {
      const fileContents = `# ${defaultFile.split(".md")[0]}

${noteFileContentArray.join("\n\n")}
`;

      writeFile(
        path.resolve(notesCwd, filename),
        fileContents,
        { encoding: "utf-8" },
        resolve
      );
    } catch (e) {
      reject(e);
    }
  });
};

const createDocsDirIfDne = () => {
  const docsPath = path.resolve(__dirname, "..", "docs");
  if(!path.existsSync(docsPath)) {
    mkdirSync(docsPath);
  }
}

const main = async () => {
  const program = commander.program;

  program
    .name("notes CLI")
    .description("CLI for the CCS notes project")
    .version("0.1.0");

  const cwdOpt = ["-p [cwd]", "the working directory"];
  const fileOpt = ["-f [file]", "the file to write to"];
  const typeOpt = ["-t [type]", "either 'meetings' or 'notes'"];

  program
    .command("compile")
    .option(...cwdOpt)
    .option(...fileOpt)
    .action(async (args) => {
      const { t } = args;

      const notesOpts = {
        defaultCwd: path.resolve("..", "notes"),
        defaultFile: "Notes.md"
      };
      const meetingsOpts = {
        defaultCwd: path.resolve("..", "meetings"),
        defaultFile: "Meetings.md",
      };

      if (!t) {
        await Promise.all([notesOpts, meetingsOpts].map((opt) => compileStrings(args, opt)));
      } else if (t.includes("note")) {
        await compileStrings(args, notesOpts);
      } else if (t.includes("meeting")) {
        await compileStrings(args, meetingsOpts);
      }
    });

  program.command("create-docs");

  await program.parseAsync();
};

main()
  .then(() => {
    console.info("Done.");
    process.exit(0);
  })
  .catch((e) => console.error(e));
