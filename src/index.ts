import * as fs from "fs";

import { RoughNode, ComponentDeclaration, File } from "./types";

import {
    extractRoughTree,
    extractFesAST,
    generateFilesFromFesAST,
} from "./parsing";

const main = () => {
    const source = "button.fes";

    fs.readFile(source, "utf-8", (err, data) => {
        if (err) throw err;

        const roughTree: RoughNode[] = extractRoughTree(data);
        const fesAST: ComponentDeclaration[] = extractFesAST(roughTree);
        const newFiles: File[] = generateFilesFromFesAST(fesAST);

        newFiles.forEach((file) => {
            fs.writeFile(file.name, file.content, (err) => {
                if (err) throw err;
            });
        });
    });
};

main();
