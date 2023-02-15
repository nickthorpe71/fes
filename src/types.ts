export interface ComponentDeclaration {
    nodeType: "component-declaration";
    isGlobal: boolean;
    name: string;
    parameters: Parameter[];
    data: ComponentData[];
    states: State[];
}

export interface ComponentReference {
    nodeType: "component-reference";
    name: string;
    arguments: string[];
}

export interface RawComponent {
    nodeType: "raw-component";
    content: string;
}

export interface ComponentData {
    nodeType: "component-data";
    name: string;
    children: string[];
}

export interface State {
    nodeType: "state";
    type: "default" | "custom-state" | "all" | "error" | "loading";
    name: string;
    style: string;
    behaviors: Behavior[];
    children: Array<ComponentDeclaration | ComponentReference | RawComponent>;
}

export interface Behavior {
    nodeType: "behavior";
    type: "onMouseOver" | "onMouseLeave" | "onClick";
    targetComponent?: string;
    targetState?: string;
    function?: string;
}

export interface Parameter {
    type: string;
    name: string;
}

export interface RoughNode {
    indentLevel: number;
    content: string;
    children: RoughNode[];
}

export interface File {
    name: string;
    content: string;
}

export interface NewLineMap {
    [fileName: string]: string[];
}
