[Demo image]

# Code Surfer

Code Surfer adds code highlighting, code zooming, code scrolling, code focusing, code morphing, and fun to MDX Deck slides.

To create a new project run:

```bash
npm init code-surfer-deck my-deck
cd my-deck
npm start
```

## Use

MDX Deck uses MDX files to create slides.

To use Code Surfer you need to import it and wrap the code you want to show inside `<CodeSurfer>` tags.

````md
import { CodeSurfer } from "code-surfer"

# Deck Title

---

<CodeSurfer>

```js
console.log(1);
console.log(2);
console.log(3);
```

</CodeSurfer>
````

Options:

- Focus
- Steps
- Title and Subtitle
- Themes
- Custom Styles
- Languages
- Columns
- Import Code
- Diffs

> Here is a live [deck using all the options]() (and its [mdx source]()) just in case you don't like to read docs.

### Focus

You can tell Code Sufer what lines and columns you want to focus by providing a _focus string_ after the language in the first line of a codeblock.

Code Surfer will fade out all the code that isn't focused and, if necessary, zoom it out to fit it in the slide.

````md
<CodeSurfer>

```js 1:2,3[8:10]
console.log(1);
console.log(2);
console.log(3);
```

</CodeSurfer>
````

In the example above `1:2,3[8:10]` means: "focus from the line 1 to line 2 and the columns 8 to 10 from line 3". More examples:

- `5:10` focus lines 5,6,7,8,9 and 10
- `1,3:5,7` focus lines 1,3,4,5 and 7
- `2[5]` focus column 5 in line 2
- `2[5:8]` focus columns 5, 6, 7 and 8 in line 2
- `1,2[1,3:5,7],3` focus line 1, columns 1, 3, 4, 5 and 7 in line 2 and line 3

### Steps

Add more codeblocks to add steps to a Code Surfer slide.

````md
<CodeSurfer>

```js
console.log(1);
console.log(2);
console.log(3);
```

```js 1
console.log(1);
console.log(2);
console.log(3);
```

```js
console.log(1);
console.log(2);
console.log(3);
console.log(4);
console.log(5);
```

</CodeSurfer>
````

You can change the focus and/or the code for different steps and Code Surfer will make the transition between the steps: zooming, scrolling, fading in, fading out, adding and removing lines.

### Title and Subtitle

````md
<CodeSurfer>

```js 1 title="Title" subtitle="Look at the first line"
console.log(1);
console.log(2);
console.log(3);
```

```js 2 title="Title" subtitle="and now the second"
console.log(1);
console.log(2);
console.log(3);
```

</CodeSurfer>
````

### Themes

[themes screenshot]

There are many Code Surfer themes available in the `@code-surfer/themes` package.

You can pass the theme as a prop for a slide `<CodeSurfer theme={someTheme}>`:

````md
import { CodeSurfer } from "code-surfer"
import { nightOwl } from "@code-surfer/themes"

<CodeSurfer theme={nightOwl}>

```js
console.log(1);
console.log(2);
console.log(3);
```

</CodeSurfer>
````

Or set the theme for all the deck as any other [MDX Deck theme](https://github.com/jxnblk/mdx-deck#theming):

````md
import { CodeSurfer } from "code-surfer"
import { nightOwl } from "@code-surfer/themes"

export const theme = nightOwl

<CodeSurfer>

```js
console.log(1);
console.log(2);
console.log(3);
```

</CodeSurfer>
````

### Custom Styles

You can write your own Code Surfer theme and change the style of the code, title or subtitle:

> Themes use [Theme UI](https://theme-ui.com/) internally

```js
// custom-theme.js
export default {
  colors: {
    background: "#222",
    text: "#ddd",
    primary: "#a66"
  },
  styles: {
    CodeSurfer: {
      pre: {
        color: "text",
        backgroundColor: "background"
      },
      code: {
        color: "text",
        backgroundColor: "background"
      },
      tokens: {
        "comment cdata doctype": {
          fontStyle: "italic"
        },
        "builtin changed keyword punctuation operator tag deleted string attr-value char number inserted": {
          color: "primary"
        }
      },
      title: {
        backgroundColor: "background",
        color: "text"
      },
      subtitle: {
        color: "#d6deeb",
        backgroundColor: "rgba(10,10,10,0.9)"
      }
    }
  }
};
```

And use it in your deck like any other theme:

````md
import { CodeSurfer } from "code-surfer"
import customTheme from "./custom-theme"

<CodeSurfer theme={customTheme}>

```js
console.log(1);
console.log(2);
console.log(3);
```

</CodeSurfer>
````

### Languages

Code Surfer uses [Prism](https://prismjs.com/) for parsing different languages, so it supports [all the langauges supported by Prism](https://prismjs.com/#supported-languages).

Most popular languages are supported out of the box, for the rest you need to import them:

````md
import { CodeSurfer } from "code-surfer"
import "prismjs/components/prism-smalltalk"

<CodeSurfer>

```smalltalk
result := a > b
    ifTrue:[ 'greater' ]
    ifFalse:[ 'less or equal' ]
```

</CodeSurfer>
````

### Columns

If you want to show more than one piece of code at the same time, use `<CodeSurferColumns>`:

````md
import { CodeSurferColumns, Step } from "code-surfer"

<CodeSurferColumns>

<Step subtitle="First Step">

```js
console.log(1);
console.log(2);
```

```js
console.log("a");
console.log("b");
```

</Step>

<Step subtitle="Second Step">

```js 2
console.log(1);
console.log(2);
```

```js 2
console.log("a");
console.log("b");
```

</Step>

</CodeSurferColumns>
````

Each `<Step>` can have its own `title` and `subtitle`.

You can use different themes for each column: `<CodeSurferColumns themes={[nightOwl, ultramin]}>`. And change the relative size of the columns with `<CodeSurferColumns sizes={[1,3]}>`.

Columns aren't only for code, you can use them for any kind of content:

````md
import { CodeSurferColumns, Step } from "code-surfer"
import MyComponent from "./my-component.jsx"

<CodeSurferColumns>

<Step>

```js
console.log(1);
console.log(2);
```

# Some Markdown

</Step>

<Step>

```js 2
console.log(1);
console.log(2);
```

<MyComponent/>

</Step>

</CodeSurferColumns>
````

### Import Code

Instead of writing the code inside codeblocks you can import it from a file:

````md
import { CodeSurfer } from "code-surfer"

<CodeSurfer>

```js 5:10 file="./my-code.js"
```

```js file="./my-other-code.js"
```

</CodeSurfer>
````

### Diffs

Codeblocks can also be diffs. This is particularly useful when using empty diffs for code that doesn't change:

````md
import { CodeSurfer } from "code-surfer"

<CodeSurfer>

```js
console.log(1);
console.log(2);
console.log(3);
```

```diff 1 subtitle="log 1"

```

```diff 2 subtitle="log 2"

```

```diff 3 subtitle="log 3"

```

</CodeSurfer>
````
