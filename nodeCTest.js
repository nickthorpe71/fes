const { exec } = require("child_process");

exec("./myProgram ./button.fes", (error, stdout, stderr) => myFunction(stdout));

const myFunction = (cProgramOutput) => {
    console.log("output:", cProgramOutput);
};
