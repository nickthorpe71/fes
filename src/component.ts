import {
    ComponentDeclaration,
    ComponentReference,
    ComponentData,
    State,
    RoughNode,
} from "./types";

import { extractArguments, extractParameters } from "./fesToAST";

import {
    extractStateName,
    extractStateType,
    composeStyle,
    composeBehaviors,
    composeStateChildComponents,
} from "./state";

export const composeComponentDeclaration = (
    roughNode: RoughNode
): ComponentDeclaration => {
    const componentSignature = roughNode.content;

    return {
        nodeType: "component-declaration",
        isGlobal: extractComponentGlobalStatus(componentSignature),
        name: extractComponentName(componentSignature),
        parameters: extractParameters(componentSignature),
        states: composeStates(roughNode.children),
        data: composeComponentData(roughNode.children),
    };
};

export const composeComponentReference = (
    roughNode: RoughNode
): ComponentReference => {
    const componentSignature = roughNode.content;

    return {
        nodeType: "component-reference",
        name: extractComponentName(componentSignature),
        arguments: extractArguments(componentSignature),
    };
};

export const extractComponentGlobalStatus = (
    componentSignature: string
): boolean => componentSignature.startsWith("[r]");

export const extractComponentName = (componentSignature: string): string =>
    componentSignature.slice(3).split("(")[0];

export const composeStates = (potentialStates: RoughNode[]): State[] => {
    const states = potentialStates.filter((node) =>
        node.content.startsWith("::")
    );

    return states.map((state) => {
        const stateSignature = state.content;
        const stateName = extractStateName(stateSignature);
        const stateType = extractStateType(stateName);
        return {
            nodeType: "state",
            type: stateType,
            name: stateName,
            style: composeStyle(state.children),
            behaviors: composeBehaviors(state.children),
            children: composeStateChildComponents(state.children),
        };
    });
};

export const composeComponentData = (
    potentialData: RoughNode[]
): ComponentData[] => {
    return [];
};
