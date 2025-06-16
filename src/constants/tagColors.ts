export const tagColors = [
  "magenta",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
  "red",
];

export const getColorByTag = (tag: string) => {
  const index = tag.toLowerCase().charCodeAt(0) % tagColors.length;
  return tagColors[index];
};
