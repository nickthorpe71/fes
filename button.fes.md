```ts
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
        @@button("hover me")
        ->onMouseOver = @@self::hover
    ::hover
        @@button("hovering", () => throw("error"))
        ->onMouseLeave = @@self::default
    ::error
        [s](This button is broken, please refresh.)
            ::default
                style: "text-red-400"
```

## fes AST

```ts
const program = [
    {
        type: "component-declaration",
        isGlobal: true,
        name: "button1",
        arguments: [
            {
                type: "string",
                name: "text",
            },
            {
                type: "arrow-function",
                name: "onClick",
                arguments: [],
                returnType: "void",
            },
        ],
        states: [
            {
                type: "default",
                style: "bg-white text-slate-500",
                behaviors: [
                    {
                        type: "onMouseOver",
                        targetComponent: "button1",
                        targetState: "hover",
                    },
                ],
                children: [],
            },
            {
                type: "custom-state",
                style: "bg-slate-500 text-white",
                behaviors: [
                    {
                        type: "onMouseLeave",
                        targetComponent: "button1",
                        targetState: "default",
                    },
                ],
                children: [],
            },
            {
                type: "all",
                style: "py-2 px-4 rounded",
                behaviors: [
                    {
                        type: "onClick",
                        function: "button1.arguments.onClick",
                    },
                ],
                children: [
                    {
                        type: "expression",
                        value: "button1.arguments.text",
                    },
                ],
            },
        ],
    },
];
```

## tsx AST

```json
{
    "importClause": {
        "name" {
            "escapedText": "React"
        },
        "namedBindings": {
            "elements": [
                {
                    "name": {
                        "escapedText": "FC"
                    }
                }
            ]
        }
    }
}
```
