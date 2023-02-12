import fs from "fs";

// path to file at top level of project
const source = "button.fes";

fs.readFile(source, "utf-8", (err, data) => {
    if (err) throw err;

    let output = "";
    for (let i = 0; i < data.length; i++) {
        // Run a function on each character
        output += doSomethingWithChar(data[i]);
    }

    fs.writeFile("output.txt", output, (err) => {
        if (err) throw err;
        console.log("The file has been saved!");
    });
});

function doSomethingWithChar(char: string) {
    if (char === "\n") console.log("new line");
    else if (char === "\r") console.log("return");
    else if (char === "\t") console.log("tab");
    else if (char === " ") console.log("space");
    else console.log(char);
    // Add your logic here to modify the character
    return char.toUpperCase();
}
