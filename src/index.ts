import * as fs from "fs";

// types
import { RoughNode, ComponentDeclaration, File } from "./types";

// functions
import { extractRoughTree, composeFesAST } from "./fesToAST";
import { generateFilesFromFesAST } from "./ASTToTsx";

const main = (source: string) => {
    fs.readFile(
        source,
        "utf-8",
        (err: NodeJS.ErrnoException | null, data: string) => {
            if (err) throw err;

            // parse fes file
            const roughTree: RoughNode[] = extractRoughTree(data);
            const fesAST: ComponentDeclaration[] = composeFesAST(roughTree);

            // generate files from fesAST
            const newFiles: File[] = generateFilesFromFesAST(fesAST);

            // create an output folder
            if (!fs.existsSync("output")) fs.mkdirSync("output");

            // write newFiles to output folder
            newFiles.forEach((file: File) => {
                fs.writeFile(
                    `./output/${file.name}`,
                    file.content,
                    (err: NodeJS.ErrnoException | null) => {
                        if (err) throw err;
                    }
                );
            });
        }
    );
};

main("button.fes");
