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
