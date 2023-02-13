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
