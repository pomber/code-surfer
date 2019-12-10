import { diffLines } from "diff";

String.prototype.trimEnd =
  String.prototype.trimEnd ||
  function(this: string) {
    if (String.prototype.trimRight) {
      return this.trimRight();
    } else {
      const trimmed = this.trim();
      const indexOfWord = this.indexOf(trimmed);

      return this.slice(indexOfWord, this.length);
    }
  };

function getChanges(oldCode: string, newCode: string) {
  const changes = diffLines(normalize(oldCode), normalize(newCode));
  let index = 0;
  const chunks: { op: "-" | "+"; count: number; index: number }[] = [];
  changes.forEach(({ count = 0, removed, added }) => {
    if (removed) {
      chunks.push({
        op: "-",
        count,
        index
      });
    }

    if (added) {
      chunks.push({
        op: "+",
        count,
        index
      });
    }

    if (!removed) {
      index += count;
    }
  });

  return chunks;
}

function normalize(text: string) {
  return text && text.trimEnd().concat("\n");
}

export function generateIds(
  lineIds: number[],
  afterId: number = 0,
  count: number
) {
  const afterIndex = lineIds.indexOf(afterId);
  const beforeIndex = afterIndex + 1;
  const aid = afterId || 0;
  const bid = lineIds[beforeIndex] || 1;

  const newIds = Array(count)
    .fill(0)
    .map((_, i) => aid + ((bid - aid) * (i + 1)) / (count + 1));

  lineIds.splice(afterIndex + 1, 0, ...newIds);
  return newIds;
}

function getStepIds(
  lineIds: number[],
  oldStepIds: number[] = [],
  oldStepCode: string = "",
  newStepCode: string = ""
): number[] {
  const changes = getChanges(oldStepCode, newStepCode);

  const newStepIds = oldStepIds.slice(0);
  changes.forEach(({ op, count, index }) => {
    if (op === "-") {
      newStepIds.splice(index, count);
    } else {
      const afterId = newStepIds[index - 1];
      const newIds = generateIds(lineIds, afterId, count);
      newStepIds.splice(index, 0, ...newIds);
    }
  });
  return newStepIds;
}

export function linesDiff(codeList: string[]) {
  const steps: number[][] = [];
  const lineIds: number[] = [];
  codeList.forEach((_, i) => {
    steps.push(getStepIds(lineIds, steps[i - 1], codeList[i - 1], codeList[i]));
  });
  return { lineIds, steps };
}
