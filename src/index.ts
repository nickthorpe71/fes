import fs from "fs";
import { extractRoughTree, extractFesAST } from "./parsing";

const main = () => {
    const source = "button.fes";

    fs.readFile(source, "utf-8", (err, data) => {
        if (err) throw err;

        const roughTree = extractRoughTree(data);
        const fesAST = extractFesAST(roughTree);

        const output = JSON.stringify(fesAST, null, 4);

        console.log(output);

        fs.writeFile("output.txt", output, (err) => {
            if (err) throw err;
            console.log("The file has been saved!");
        });
    });
};

main();
