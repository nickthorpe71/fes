import {
    ComponentDeclaration,
    ComponentReference,
    ComponentData,
    State,
    RoughNode,
} from "./types";

import { extractArguments, extractParameters } from "./parsing";

import {
    extractStateName,
    extractStateType,
    extractStateStyle,
    extractStateBehaviors,
    extractStateChildComponents,
} from "./state";

export const extractComponentDeclaration = (
    roughNode: RoughNode
): ComponentDeclaration => {
    const componentSignature = roughNode.content;

    return {
        nodeType: "component-declaration",
        isGlobal: extractComponentGlobalStatus(componentSignature),
        name: extractComponentName(componentSignature),
        arguments: extractParameters(componentSignature),
        states: extractStates(roughNode.children),
        data: extractComponentData(roughNode.children),
    };
};

export const extractComponentReference = (
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

export const extractStates = (potentialStates: RoughNode[]): State[] => {
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
            style: extractStateStyle(state.children),
            behaviors: extractStateBehaviors(state.children),
            children: extractStateChildComponents(state.children),
        };
    });
};

export const extractComponentData = (
    potentialData: RoughNode[]
): ComponentData[] => {
    return [];
};
