import fs from "fs";

// path to file at top level of project
const source = "button.fes";

// fs.readFile(source, "utf-8", (err, data) => {
//     if (err) throw err;

//     let output = "";
//     for (let i = 0; i < data.length; i++) {
//         // Run a function on each character
//         output += doSomethingWithChar(data[i]);
//     }

//     const lines = data.split("\n");
//     console.log(lines);

//     fs.writeFile("output.txt", output, (err) => {
//         if (err) throw err;
//         console.log("The file has been saved!");
//     });
// });

// function doSomethingWithChar(char: string) {
//     return char;
// }

const exampleFile = `
[r]button1(text: string, onClick: () => void)
    ::default
        style: "bg-white text-slate-500"
        ->onMouseOver = @@self::hover
    ::hover
        style: "bg-slate-500 text-white"
        ->onMouseLeave = @@self::default
    ::all
        style: "py-2 px-4 rounded"
        ->onClick(onClick)
        [s](text)

[s]buttonWithEvent
    ::default
        @@button1("hover me")
        ->onMouseOver = @@self::hover
    ::hover
        @@button1("hovering", () => throw("error"))
        ->onMouseLeave = @@self::default
    ::error
        [s](This button is broken, please refresh.)
            ::default
                style: "text-red-400"
`;

interface ComponentDeclaration {
    isGlobal: boolean;
    name: string;
    arguments: Argument[];
    data: ComponentData[];
    states: State[];
}

interface ComponentData {
    name: string;
    children: string[];
}

interface ComponentReference {
    name: string;
    arguments: Argument[];
}

interface Argument {
    type: string;
    name: string;
}

interface State {
    type: "default" | "custom-state" | "all" | "error" | "loading";
    name: string;
    style: string;
    behaviors: Behavior[];
    children: ComponentDeclaration | ComponentReference[];
}

interface Behavior {
    type: "onMouseOver" | "onMouseLeave" | "onClick";
    targetComponent?: string;
    targetState?: string;
    function?: string;
}

// component
const extractComponentDeclaration = (
    roughNode: RoughNode
): ComponentDeclaration => {
    const componentSignature = roughNode.content;

    return {
        isGlobal: extractComponentGlobalStatus(componentSignature),
        name: extractComponentName(componentSignature),
        arguments: extractArguments(componentSignature),
        states: extractStates(roughNode.children),
        data: extractComponentData(roughNode.children),
    };
};

const extractComponentReference = (
    roughNode: RoughNode
): ComponentReference => {
    const componentSignature = roughNode.content;

    return {
        name: extractComponentName(componentSignature),
        arguments: extractArguments(componentSignature),
    };
};

const extractComponentGlobalStatus = (componentSignature: string): boolean =>
    componentSignature.startsWith("[r]");

const extractComponentName = (componentSignature: string): string =>
    componentSignature.slice(3).split("(")[0];

const extractStates = (potentialStates: RoughNode[]): State[] => {
    const states = potentialStates.filter((node) =>
        node.content.startsWith("::")
    );
    return states.map((state) => {
        const stateSignature = state.content;
        const stateName = extractStateName(stateSignature);
        const stateType = extractStateType(stateName);
        return {
            type: stateType,
            name: stateName,
            style: extractStateStyle(state.children),
            behaviors: extractStateBehaviors(state.children),
            children: extractStateChildComponents(state.children),
        };
    });
};

const extractComponentData = (potentialData: RoughNode[]): ComponentData[] => {
    return [];
};

// state
const extractStateName = (stateSignature: string): string => {
    if (stateSignature.length <= 2) throw new Error("Invalid state name");
    return stateSignature.slice(2);
};

const extractStateType = (stateName: string): State["type"] => {
    if (stateName === "all") return "all";
    if (stateName === "error") return "error";
    if (stateName === "loading") return "loading";
    return "custom-state";
};

const extractStateStyle = (potentialStyles: RoughNode[]): string => {
    const styleNode = potentialStyles.find((node) =>
        node.content.startsWith("style:")
    );

    // TODO: turn into scss or tailwind
    return !styleNode ? "" : styleNode.content.slice(6).trim();
};

const extractStateBehaviors = (potentialBehaviors: RoughNode[]): Behavior[] => {
    const behaviorNodes = potentialBehaviors.filter((node) =>
        node.content.startsWith("->")
    );

    return behaviorNodes.map((behaviorNode) => {
        const behaviorSignature = behaviorNode.content.slice(2).trim();
        const behaviorComponents = behaviorSignature.split("=");
        const behaviorType = extractBehaviorType(behaviorComponents[0]);
        const behaviorTarget = extractBehaviorTarget(behaviorComponents[1]);
        return {
            type: behaviorType,
            ...behaviorTarget,
        };
    });
};

const extractStateChildComponents = (
    potentialChildren: RoughNode[]
): ComponentDeclaration | ComponentReference[] => {
    const declarations = potentialChildren.filter((node) =>
        node.content.startsWith("[")
    );
    const references = potentialChildren.filter((node) =>
        node.content.startsWith("@@")
    );

    return [
        ...declarations.map((declaration) =>
            extractComponentDeclaration(declaration)
        ),
        ...references.map((reference) => extractComponentReference(reference)),
    ];
};

// behavior
const extractBehaviorType = (behaviorSignature: string): Behavior["type"] => {
    if (behaviorSignature.startsWith("onMouseOver")) return "onMouseOver";
    if (behaviorSignature.startsWith("onMouseLeave")) return "onMouseLeave";
    if (behaviorSignature.startsWith("onClick")) return "onClick";
    throw new Error("Invalid behavior type");
};

const extractBehaviorTarget = (
    behaviorSignature: string
): { targetComponent?: string; targetState?: string; function?: string } => {
    if (behaviorSignature.startsWith("@@")) {
        const targetComponents = behaviorSignature.slice(2).split("::");
        return {
            targetComponent: targetComponents[0],
            targetState: targetComponents[1],
        };
    } else if (behaviorSignature.startsWith("() =>")) {
        return {
            function: behaviorSignature.slice(5).trim(),
        };
    } else {
        throw new Error("Invalid behavior target");
    }
};

// general
function extractArguments(text: string): Argument[] {
    if (!text.includes("(")) return [];
    const argumentString = text.slice(
        text.indexOf("(") + 1,
        text.lastIndexOf(")")
    );

    return argumentString.split(",").map((arg: string) => {
        const argumentComponents = arg.trim().split(":");
        return {
            name: argumentComponents[0].trim(),
            type: argumentComponents[1].trim(),
        };
    });
}
const getIndentLevel = (line: string): number => {
    let indent = 0;
    for (let i = 0; i < line.length; i++) {
        const currentChar = line[i];
        if (currentChar === " " || currentChar === "\t") indent++;
        else if (currentChar !== "\n" && currentChar !== "\r") break;
    }
    return indent;
};

interface RoughNode {
    indentLevel: number;
    content: string;
    children: RoughNode[];
}

const extractRoughTree = (text: string) => {
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

const extractFesAST = (roughTree: RoughNode[]) => {
    const fesAST = roughTree.map((node) => {
        if (node.content.startsWith("[")) {
            return extractComponentDeclaration(node);
        }
    });
    return fesAST;
};

const printRoughTree = (tree: RoughNode[]): void => {
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

const main = () => {
    const roughTree = extractRoughTree(exampleFile);
    const fesAST = extractFesAST(roughTree);

    console.log(fesAST);
};

main();
