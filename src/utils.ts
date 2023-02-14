import { RoughNode } from "./types";

export const printRoughTree = (tree: RoughNode[]): void => {
    const printNode = (node: RoughNode, indent: number) => {
        const indentString =
            indent === 0 ? "" : "│" + " ".repeat(indent) + "├─ ";
        console.log(indentString + node.content);
        for (const child of node.children) {
            printNode(child, indent + 2);
        }
    };

    for (const node of tree) {
        printNode(node, 0);
    }
};
