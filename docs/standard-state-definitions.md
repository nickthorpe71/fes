# Standard State Definitions

A list of all standard states included in the FES library and what each one implements.

### Default

**Symbol** ::default

### Loading

**Symbol** ::loading

### Error

If there is an error state we will add a try catch to each appropriate function

**Symbol** ::error

### Hover

Add a handleHover and handle leave function along with these on the parent div:
onMouseOver={(e: MouseEvent) => handleHover(e.target.value)}
onMouseLeave={(e) => handleLeave(e.target.value)}

**Symbol** ::hover
