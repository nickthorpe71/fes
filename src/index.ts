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
        ->onClick = onClick
        [s]()
            ::default
                text

[s]buttonWithEvent()
    ::default
        @@button1("hover me")
        ->onMouseOver = @@self::hover
    ::hover
        @@button1("hovering", () => throw("error"))
        ->onMouseLeave = @@self::default
    ::error
        [s]()
            ::default
                style: "text-red-400"
                "This button is broken, please refresh."
`;

interface ComponentDeclaration {
    isGlobal: boolean;
    name: string;
    arguments: Parameter[];
    data: ComponentData[];
    states: State[];
}

interface ComponentReference {
    name: string;
    arguments: string[];
}

interface RawComponent {
    content: string;
}

interface ComponentData {
    name: string;
    children: string[];
}

interface Parameter {
    type: string;
    name: string;
}

interface State {
    type: "default" | "custom-state" | "all" | "error" | "loading";
    name: string;
    style: string;
    behaviors: Behavior[];
    children: Array<ComponentDeclaration | ComponentReference | RawComponent>;
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
        arguments: extractParameters(componentSignature),
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
    // these states have some additional functionality
    // or special handling when they are parsed back into code
    const definedStates = ["default", "all", "error", "loading"];
    if (definedStates.includes(stateName)) return stateName as State["type"];

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
        const behaviorType = extractBehaviorType(behaviorNode.content);
        const behaviorTarget = extractBehaviorTarget(behaviorNode.content);
        return {
            type: behaviorType,
            ...behaviorTarget,
        };
    });
};

const extractStateChildComponents = (
    potentialChildren: RoughNode[]
): Array<ComponentDeclaration | ComponentReference | RawComponent> => {
    const declarations = potentialChildren.filter((node) =>
        node.content.startsWith("[")
    );
    const references = potentialChildren.filter((node) =>
        node.content.startsWith("@@")
    );
    const rawComponents = potentialChildren.filter(
        (node) =>
            !node.content.includes("style:") &&
            !node.content.includes("->") &&
            !node.content.startsWith("[") &&
            !node.content.startsWith("@@")
    );

    return [
        ...declarations.map((declaration) =>
            extractComponentDeclaration(declaration)
        ),
        ...references.map((reference) => extractComponentReference(reference)),
        ...rawComponents.map((rawComponent) => ({
            content: rawComponent.content,
        })),
    ];
};

// behavior
const extractBehaviorType = (behaviorSignature: string): Behavior["type"] => {
    const behaviorType = behaviorSignature.slice(2).split("=")[0].trim();
    const validBehaviorTypes = ["onMouseOver", "onMouseLeave", "onClick"];

    if (!validBehaviorTypes.includes(behaviorType))
        throw new Error("Invalid behavior type");

    return behaviorType as Behavior["type"];
};

const extractBehaviorTarget = (
    behaviorSignature: string
): { targetComponent?: string; targetState?: string; function?: string } => {
    const behavior = behaviorSignature.split("=")[1].trim();

    if (behavior.startsWith("@@")) {
        const targetComponents = behavior.slice(2).split("::");
        return {
            targetComponent: targetComponents[0],
            targetState: targetComponents[1],
        };
    } else {
        return {
            function: behavior,
        };
    }
};

// general
const extractParameters = (text: string): Parameter[] => {
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

const extractArguments = (text: string): string[] => {
    if (!text.includes("(")) return [];
    const argumentString = text.slice(
        text.indexOf("(") + 1,
        text.lastIndexOf(")")
    );
    if (argumentString === "") return [];

    return argumentString.split(",").map((arg: string) => arg.trim());
};

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

    console.log(JSON.stringify(fesAST, null, 2));
};

main();
