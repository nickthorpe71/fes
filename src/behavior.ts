import { Behavior } from "./types";

export const extractBehaviorType = (
    behaviorSignature: string
): Behavior["type"] => {
    const behaviorType = behaviorSignature.slice(2).split("=")[0].trim();
    const validBehaviorTypes = ["onMouseOver", "onMouseLeave", "onClick"];

    if (!validBehaviorTypes.includes(behaviorType))
        throw new Error("Invalid behavior type");

    return behaviorType as Behavior["type"];
};

export const extractBehaviorTarget = (
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
