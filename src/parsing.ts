import {
    Parameter,
    RoughNode,
    ComponentDeclaration,
    File,
    NewLineMap,
} from "./types";

import { extractComponentDeclaration } from "./component";

export const extractParameters = (text: string): Parameter[] => {
    if (!text.includes("(")) return [];
    const argumentString = text.slice(
        text.indexOf("(") + 1,
        text.lastIndexOf(")")
    );
    if (argumentString === "") return [];

    return argumentString.split(",").map((arg: string) => {
        const argumentComponents = arg.trim().split(":");
        return {
            name: argumentComponents[0].trim(),
            type: argumentComponents[1].trim(),
        };
    });
};

export const extractArguments = (text: string): string[] => {
    if (!text.includes("(")) return [];
    const argumentString = text.slice(
        text.indexOf("(") + 1,
        text.lastIndexOf(")")
    );
    if (argumentString === "") return [];

    return argumentString.split(",").map((arg: string) => arg.trim());
};

export const getIndentLevel = (line: string): number => {
    let indent = 0;
    for (let i = 0; i < line.length; i++) {
        const currentChar = line[i];
        if (currentChar === " " || currentChar === "\t") indent++;
        else if (currentChar !== "\n" && currentChar !== "\r") break;
    }
    return indent;
};

export const extractRoughTree = (text: string): RoughNode[] => {
    const lines: string[] = text.split("\n").filter((line) => line.trim());
    const levelSet: number[] = [
        ...lines.reduce(
            (acc, line) => acc.add(getIndentLevel(line)),
            new Set<number>()
        ),
    ];

    const recentLevelMap = new Map<number, RoughNode>();

    const tree: RoughNode[] = lines.reduce((acc, line) => {
        const indentLevel = getIndentLevel(line);
        const trimmedLine = line.trim();

        const newNode = {
            indentLevel: indentLevel,
            content: trimmedLine,
            children: [],
        };

        recentLevelMap.set(indentLevel, newNode);

        if (indentLevel === 0) {
            acc.push(newNode);
            return acc;
        }

        const oneLevelAbove = levelSet[levelSet.indexOf(indentLevel) - 1];
        const parent = recentLevelMap.get(oneLevelAbove);
        if (parent) parent.children.push(newNode);

        return acc;
    }, [] as RoughNode[]);

    return tree;
};

export const extractFesAST = (
    roughTree: RoughNode[]
): ComponentDeclaration[] => {
    const fesAST = roughTree.map((node: RoughNode) =>
        extractComponentDeclaration(node)
    );
    return fesAST;
};

export const generateFilesFromFesAST = (
    fesAST: ComponentDeclaration[]
): File[] => {
    const files: File[] = fesAST.map((node: ComponentDeclaration) => ({
        name: node.name + ".tsx",
        content: "",
    }));

    const filesWithImports: File[] = appendNewLines(
        files,
        gatherImports(files)
    );

    //  - determine the props type interface and any other interfaces it needs
    //  - determine the component function signature
    //  - determine the component function body
    //    - determine states
    //      - all specified states (error, loading, etc.)
    //  - component function return
    //    - construct jsx
    //      - add jsx for specifies states (error, loading, etc.)
    //  - component export default

    return filesWithImports;
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
        "import React, {FC, useState, useRef, useEffect} from 'react';";

    return files.reduce((acc, file) => {
        acc[file.name] = [defaultImports];
        return acc;
    }, {} as NewLineMap);
};
