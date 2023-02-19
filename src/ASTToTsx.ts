import {
    ComponentDeclaration,
    ComponentReference,
    RawComponent,
    State,
    File,
    NewLineMap,
} from "./types";

export const generateFilesFromFesAST = (
    fesAST: ComponentDeclaration[]
): File[] => {
    const files: File[] = fesAST.map((node: ComponentDeclaration) => ({
        name: node.name + ".tsx",
        content: "",
    }));

    const importLineMap = gatherImports(files, fesAST);
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

    const componentBody = gatherComponentBody(fesAST);
    const filesWithComponentBody = appendNewLines(
        filesWithComponentFunctions,
        componentBody
    );

    //  - determine the component function body
    //    - determine states
    //    - if component has more than 1 state create an enum for all states
    //      - all specified states (error, loading, etc.)
    //      - write a reference guide of all built-in states
    //  - component function return
    //    - construct jsx
    //      - add jsx for specifies states (error, loading, etc.)
    //          - get styles from default state
    //          - any raw components might have their own styles

    const componentEndings = gatherComponentEndings(fesAST);
    const filesWithComponentEndings = appendNewLines(
        filesWithComponentBody,
        componentEndings
    );

    return filesWithComponentEndings;
};

const appendNewLines = (files: File[], newLineMap: NewLineMap): File[] => {
    return files.map((file: File) => ({
        ...file,
        content: (file.content =
            file.content + newLineMap[file.name].join("\r") + "\r"),
    }));
};

const gatherImports = (
    files: File[],
    fesAST: ComponentDeclaration[]
): NewLineMap => {
    const defaultImports =
        "import React, { FC, useState, useRef, useEffect } from 'react';";

    return files.reduce((acc, file) => {
        const importedComponents: string[] = gatherImportedComponentsNames(
            file.name.replace(".tsx", ""),
            fesAST
        );

        acc[file.name] = [
            defaultImports,
            "",
            ...importedComponents.map(
                (name) => `import ${name} from './${name}';`
            ),
        ];
        return acc;
    }, {} as NewLineMap);
};

const gatherImportedComponentsNames = (
    parentComponentName: string,
    fesAST: ComponentDeclaration[]
): string[] => {
    const parentComponent: ComponentDeclaration | undefined = fesAST.find(
        (node) => node.name === parentComponentName
    );
    if (!parentComponent) return [];
    return parentComponent.states.reduce((acc: string[], state: State) => {
        const importedComponents = state.children.reduce(
            (
                acc: string[],
                child: ComponentDeclaration | ComponentReference | RawComponent
            ) => {
                if (
                    child.nodeType === "component-reference" &&
                    !acc.includes(child.name)
                )
                    acc.push(child.name);
                return acc;
            },
            [] as string[]
        );

        // remove duplicates
        return [...new Set([...acc, ...importedComponents])];
    }, [] as string[]);
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

const gatherComponentBody = (fesAST: ComponentDeclaration[]): NewLineMap => {
    // find names of all states
    const stateNames = fesAST.reduce((acc, node) => {
        return [...acc, ...node.states.map((state) => state.name)];
    }, [] as string[]);

    console.log(stateNames);

    return fesAST.reduce((acc, node) => {
        acc[node.name + ".tsx"] = [
            ...node.states.map((state) => {
                return `const [${state.name}, set${state.name}] = useState(${state});`;
            }),
        ];
        return acc;
    }, {} as NewLineMap);
};
