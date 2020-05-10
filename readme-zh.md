<div align="center">
<br/>
<a href="https://codesurfer.pomb.us/demo/">
<img alt="demo" src="https://user-images.githubusercontent.com/1911623/66186294-49bacc00-e658-11e9-8d73-e4e6d8df476b.gif" width="600" />
</a>
<br/>
</div>

# Code Surfer

> 在 [support](https://opencollective.com/code-surfer)  上赞助这个项目，保持她的生命力❤️

Code Surfer为 [MDX Deck](https://github.com/jxnblk/mdx-deck) 幻灯片增加代码高亮、代码缩放、代码滚动、代码聚焦、代码变形等功能。

创建并运行一个新的项目:

```bash
npm init code-surfer-deck my-deck
cd my-deck
npm start
```

## 例子

- [强大的GraphQL工作坊](https://advanced-graphql-workshop.netlify.com/) 作者 [Phil Pluckthun](https://twitter.com/_philpl)
- [React Conf 2018 Hooks Demo](https://github.com/pomber/react-conf-2018-hooks-demo)

## 如何使用 Code Surfer

> 首先了解 [MDX Deck](https://github.com/jxnblk/mdx-deck) 的工作方式可能会有所帮助

To use Code Surfer you need to import it and wrap the code you want to show inside `<CodeSurfer>` tags (the **empty lines before and after the codeblock are required**):

要使用 Code Surfer，你需要先将其导入，并使用 `<CodeSurfer>` 标签包裹要显示的代码（**需要在代码块之前和之后保留空行**）:

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

特性:

- [高亮](#focus)
- [步骤](#steps)
- [标题和副标题](#title-and-subtitle)
- [主题](#themes)
- [自定义样式](#custom-styles)
- [多语言支持]](#languages)
- [列](#columns)
- [导入代码](#import-code)
- [行号](#line-numbers)
- [差异](#diffs)

> Here is a live [deck using all the features](https://codesurfer.pomb.us/full/) (and its [mdx source](https://raw.githubusercontent.com/pomber/code-surfer/code-surfer-v2/sites/docs/decks/full.mdx)) just in case you prefer to read code instead of docs.

> 这是一个 [使用所有功能](https://codesurfer.pomb.us/full/) (及 [mdx 源码](https://raw.githubusercontent.com/pomber/code-surfer/code-surfer-v2/sites/docs/decks/full.mdx))的演示文稿，万一您更喜欢阅读代码而不是文档😀

## 聚焦

在代码块第一行中的（设置）语言之后添加 _高亮字符串位置_，以告诉Code Surfer你要聚焦的行和列。

Code Surfer将淡出所有未高亮的代码，并在必要时将其缩小以适合幻灯片。

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

在上面的示例中，`1:2,3[8:10]` 意思是：“行1行2高亮，行3到列8到10高亮”。更多示例：

- `5:10` 第 5,6,7,8,9 行 和第 10 行高亮
- `1,3:5,7` 第1行，第 3~5 行，第 7 行高亮，
- `2[5]` 第 2 行第5高亮
- `2[5:8]` 第 2 行 5~8 列高亮
- `1,2[1,3:5,7],3` 第1行，第2行，第2行第1列、3~5列、7列高亮

_注意: 在以前的CodeSurfer版本中，我们使用标记代替列。_

## 步骤

添加更多代码块，以向 Code Surfer 幻灯片添加步骤。

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

您可以为不同的步骤更改焦点和/或代码，然后 Code Surfer 会在以下步骤之间进行变换：缩放，滚动，淡入，淡出，添加和删除行。

## 标题和副标题

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

## 主题

[![Code Surfer Themes](https://user-images.githubusercontent.com/1911623/66016573-97df9c00-e4ad-11e9-9095-225d5c9b46a8.png)](https://codesurfer.pomb.us/themes/)

在 [`@code-surfer/themes`](https://github.com/pomber/code-surfer/blob/code-surfer-v2/packs/themes/src/index.ts) 包里面有许多Code Surfer主题。

你可以通过 theme 传递 prop `<CodeSurfer theme={someTheme}>`:

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

或者像设置其他任何[MDX Deck 主题](https://github.com/jxnblk/mdx-deck#theming)一样设置整个项目的主题：

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

> 以这种方式导出主题还将更改未使用Code Surfer的幻灯片的文本和背景颜色。如果要保留其他mdx主题的颜色，可以将[两个主题组合在一起](https://github.com/jxnblk/mdx-deck/blob/master/docs/theming.md#composing-themes)：`export const themes = [codeSurferTheme, mdxDeckTheme]`

## 自定义样式

您可以编写自己的Code Surfer主题，更改代码，标题和副标题的样式：

> 在主题中使用 [Theme UI](https://theme-ui.com/)

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
        },
        "line-number": {
          opacity: 0.8
        }
      },
      title: {
        backgroundColor: "background",
        color: "text"
      },
      subtitle: {
        color: "#d6deeb",
        backgroundColor: "rgba(10,10,10,0.9)"
      },
      unfocused: {
        // only the opacity of unfocused code can be changed
        opacity: 0.1
      }
    }
  }
};
```

像其他卡片主题一样使用它:

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

## 语言支持

Code Surfer 使用 [Prism](https://prismjs.com/) 解析不同的语言, 因此它支持 [Prism 支持的所有语言](https://prismjs.com/#supported-languages).

开箱即用的支持大多数流行语言，其余的则需要导入它们:

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

## 列

如果需要同时显示多个代码, 请使用 `<CodeSurferColumns>`:

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

每个 `<Step>` 有自己的 `title` and `subtitle`.

您可以为各列使用不同的主题: `<CodeSurferColumns themes={[nightOwl, ultramin]}>`. 并更改列的相对大小 `<CodeSurferColumns sizes={[1,3]}>`.

列不仅用于代码，还可以将它们用于任何类型的内容：

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

## 导入代码文件

你可以从文件中导入代码，而不必在代码块中编写代码：

````md
import { CodeSurfer } from "code-surfer"

<CodeSurfer>

```js 5:10 file=./my-code.js
```

```js file=./my-other-code.js
```

</CodeSurfer>
````

## 行号

要显示行号，将`showNumbers`添加到语言标识之后:

````md
import { CodeSurfer } from "code-surfer"

<CodeSurfer>

```js showNumbers
console.log(1);
console.log(2);
console.log(3);
```

```js
console.log(1);
console.log(2);
console.log(4);
```

</CodeSurfer>
````

## 差异

代码块也可以展示差异。 This is particularly useful when using empty diffs for code that doesn't change:

代码块也可以展示差异。 当讲空的diffs用在不变的代码块时候，这特别有用：

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

## 相关

- [MDX Deck](https://github.com/jxnblk/mdx-deck)
- [spectacle-code-slide](https://github.com/jamiebuilds/spectacle-code-slide)
- [Prism](https://github.com/PrismJS/prism)
- [create-code-surfer-deck](https://github.com/pomber/create-code-surfer-deck)
- [Gatsby Waves](https://github.com/pomber/gatsby-waves)

## 支持 Code Surfer

您可以帮助保持该项目的生命。

### 赞助商

通过成为赞助者来支持该项目。您的徽标将显示在此处，并带有指向您网站的链接。 [[成为赞助商](https://opencollective.com/code-surfer#sponsor)]

<a href="https://opencollective.com/code-surfer/sponsor/0/website" target="_blank"><img src="https://opencollective.com/code-surfer/sponsor/0/avatar.svg"></a>

### 支持者

感谢所有的支持者! 🙏 [[成为支持者](https://opencollective.com/code-surfer#backer)]

<a href="https://opencollective.com/code-surfer#backers" target="_blank"><img src="https://opencollective.com/code-surfer/backers.svg?width=890"></a>

### 贡献者

这个项目的存在要感谢所有贡献者。
<img src="https://opencollective.com/code-surfer/contributors.svg?width=890&button=false" />
