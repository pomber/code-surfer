export function makeTheme(prismTheme, override = {}) {
  return {
    codeSurfer: {
      styles: prismTheme.styles,
      title: {
        background: prismTheme.plain.backgroundColor
      },
      subtitle: {
        color: "#d6deeb",
        background: "rgba(10,10,10,0.9)"
      },
      pre: {
        color: prismTheme.plain.color,
        background: prismTheme.plain.backgroundColor
      },
      code: {
        color: prismTheme.plain.color,
        background: prismTheme.plain.backgroundColor
      },
      ...override
    }
  };
}

export function addColors(theme, prismTheme) {
  const stringStyle = theme.codeSurfer.styles.find(s =>
    s.types.includes("string")
  );

  return {
    colors: {
      text: prismTheme.plain.color,
      background: prismTheme.plain.backgroundColor,
      link: stringStyle && stringStyle.style.color,
      pre: prismTheme.plain.color,
      code: prismTheme.plain.color,
      preBackground: prismTheme.plain.backgroundColor
    },
    ...theme
  };
}
