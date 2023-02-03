# Fes - Front End Specification Language

### Goals

-   define component structure
-   differentiate reusable and specific components
-   any descriptions should be able to be substituted with a prompt
-   define abstract state
-   prevent "bad states" ex. being in an error and success state at the same time
-   understand the scope of states and where they might be tracked in the application
-   understand where specific data is needed
-   be able to follow the component/state tree to see and replicate where the user is
    eg. site::loggedIn > freestyleModal::open > videoRecorder::recording

### Element Legend

```ts
    // = description of element or comment
    - component
        {} = logic component definition
            {r} = reusable
            {s} = specific
            {g} = global
        $$ = logic component reference
        [] = visual component definition
            [r] = reusable
            [s] = specific
            [g] = global
        @@ = visual component reference
        () = componentData
            (API) = api call to get data
    - state
        :: = state definition
    - behavior
        -> = state behavior definition
        .  = component behavior definition
```

### Components

#### (API)

This symbol specifies that the data is coming from an api call. If a fes loading and default state are implemented then the necessary react state which will be toggled with api call completion, and a jsx switch for loading and default.

### States

#### ::error

-   if a component has an ::error state:
    -   there is a "hasError" state added to the component
    -   every function in the component is given try catch
    -   in the catch block hasError is set to true to trigger the UI to reflect this state and any other provided error logic is run

### Behaviors

#### ->onIsEmpty

-   takes a piece of data and is triggered if that data is comsidered by lodash.isEmpty

## Stack

-   react
-   tailwind
-   lodash

### Prompt Substitution

instead of wiring:

```scss
scss: {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
```

you can write:

```
prompt: a scss class that centers the elements
```
