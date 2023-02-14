export interface ComponentDeclaration {
    isGlobal: boolean;
    name: string;
    arguments: Parameter[];
    data: ComponentData[];
    states: State[];
}

export interface ComponentReference {
    name: string;
    arguments: string[];
}

export interface RawComponent {
    content: string;
}

export interface ComponentData {
    name: string;
    children: string[];
}

export interface Parameter {
    type: string;
    name: string;
}

export interface State {
    type: "default" | "custom-state" | "all" | "error" | "loading";
    name: string;
    style: string;
    behaviors: Behavior[];
    children: Array<ComponentDeclaration | ComponentReference | RawComponent>;
}

export interface Behavior {
    type: "onMouseOver" | "onMouseLeave" | "onClick";
    targetComponent?: string;
    targetState?: string;
    function?: string;
}

export interface RoughNode {
    indentLevel: number;
    content: string;
    children: RoughNode[];
}
