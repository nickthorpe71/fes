import { ComponentDeclaration, File, NewLineMap } from "./types";

export const generateFilesFromFesAST = (
    fesAST: ComponentDeclaration[]
): File[] => {
    const files: File[] = fesAST.map((node: ComponentDeclaration) => ({
        name: node.name + ".tsx",
        content: "",
    }));

    const importLineMap = gatherImports(files);
    // can potentially just append all lines to all files at the end
    const filesWithImports: File[] = appendNewLines(files, importLineMap);

    const propTypeLineMap = gatherPropTypes(fesAST);
    const filesWithPropTypes = appendNewLines(
        filesWithImports,
        propTypeLineMap
    );

    const componentFunctions = gatherComponentFunctionSignature(fesAST);
    const filesWithComponentFunctions = appendNewLines(
        filesWithPropTypes,
        componentFunctions
    );

    const componentEndings = gatherComponentEndings(fesAST);
    const filesWithComponentEndings = appendNewLines(
        filesWithComponentFunctions,
        componentEndings
    );

    //  - determine the component function signature
    //  - determine the component function body
    //    - determine states
    //      - all specified states (error, loading, etc.)
    //  - component function return
    //    - construct jsx
    //      - add jsx for specifies states (error, loading, etc.)
    //  - component export default

    return filesWithComponentEndings;
};

const appendNewLines = (files: File[], newLineMap: NewLineMap): File[] => {
    return files.map((file: File) => ({
        ...file,
        content: (file.content =
            file.content + newLineMap[file.name].join("\r") + "\r"),
    }));
};

const gatherImports = (files: File[]): NewLineMap => {
    const defaultImports =
        "import React, { FC, useState, useRef, useEffect } from 'react';";

    return files.reduce((acc, file) => {
        acc[file.name] = [defaultImports];
        return acc;
    }, {} as NewLineMap);
};

const gatherPropTypes = (fesAST: ComponentDeclaration[]): NewLineMap => {
    return fesAST.reduce((acc, node) => {
        acc[node.name + ".tsx"] = !node.parameters.length
            ? []
            : [
                  `\rinterface ${node.name}Props {`,
                  ...node.parameters.map(
                      (param) => `    ${param.name}: ${param.type};`
                  ),
                  "}\r",
              ];
        return acc;
    }, {} as NewLineMap);
};

const gatherComponentFunctionSignature = (
    fesAST: ComponentDeclaration[]
): NewLineMap => {
    return fesAST.reduce((acc, node) => {
        const parameters = node.parameters
            .map((param) => param.name)
            .join(", ")
            .replace("?", "");

        acc[node.name + ".tsx"] = [
            `const ${node.name}: FC<${node.name}Props> = ({ ${parameters} }) => {`,
        ];
        return acc;
    }, {} as NewLineMap);
};

const gatherComponentEndings = (fesAST: ComponentDeclaration[]): NewLineMap => {
    return fesAST.reduce((acc, node) => {
        acc[node.name + ".tsx"] = ["};", "export default " + node.name + ";"];
        return acc;
    }, {} as NewLineMap);
};
