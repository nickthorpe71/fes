import {
    Behavior,
    ComponentDeclaration,
    ComponentReference,
    RawComponent,
    State,
    RoughNode,
} from "./types";

import {
    extractComponentDeclaration,
    extractComponentReference,
} from "./component";

import { extractBehaviorType, extractBehaviorTarget } from "./behavior";

export const extractStateName = (stateSignature: string): string => {
    if (stateSignature.length <= 2) throw new Error("Invalid state name");
    return stateSignature.slice(2);
};

export const extractStateType = (stateName: string): State["type"] => {
    // these states have some additional functionality
    // or special handling when they are parsed back into code
    const definedStates = ["default", "all", "error", "loading"];
    if (definedStates.includes(stateName)) return stateName as State["type"];

    return "custom-state";
};

export const extractStateStyle = (potentialStyles: RoughNode[]): string => {
    const styleNode = potentialStyles.find((node) =>
        node.content.startsWith("style:")
    );

    // TODO: turn into scss or tailwind
    return !styleNode ? "" : styleNode.content.slice(6).trim();
};

export const extractStateBehaviors = (
    potentialBehaviors: RoughNode[]
): Behavior[] => {
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

export const extractStateChildComponents = (
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
