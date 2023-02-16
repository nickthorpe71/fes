import * as fs from "fs";

// types
import { RoughNode, ComponentDeclaration, File } from "./types";

// functions
import { extractRoughTree, composeFesAST } from "./fesToAST";
import { generateFilesFromFesAST } from "./ASTToTsx";

const main = () => {
    const source = "button.fes";

    fs.readFile(source, "utf-8", (err, data) => {
        if (err) throw err;

        const roughTree: RoughNode[] = extractRoughTree(data);
        const fesAST: ComponentDeclaration[] = composeFesAST(roughTree);
        const newFiles: File[] = generateFilesFromFesAST(fesAST);

        newFiles.forEach((file) => {
            fs.writeFile(file.name, file.content, (err) => {
                if (err) throw err;
            });
        });
    });
};

main();
