import { Parameter, RoughNode, ComponentDeclaration } from "./types";
import { composeComponentDeclaration } from "./component";

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

export const composeFesAST = (
    roughTree: RoughNode[]
): ComponentDeclaration[] => {
    const fesAST = roughTree.map((node: RoughNode) =>
        composeComponentDeclaration(node)
    );
    return fesAST;
};
