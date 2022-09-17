import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "squarier.formatSelection",
    () => {
      const editor = vscode.window.activeTextEditor;
      const selectedText = editor?.document.getText(editor.selection);
      if (selectedText) {
        const formattedText = formatSelection(selectedText);
        editor?.edit((editBuilder) => {
          editBuilder.replace(editor.selection, formattedText);
        });
      }

      vscode.window.showInformationMessage("Text Selection Formatted!");
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}

export function formatSelection(text: string): string {
  const lines = text.split("\n");
  const leftSpacesCount = countSpacesBeforeFirstWord(lines[0]);
  const tokensLines = lines.map((line) => parseTokens(line));

  const shortestLine = tokensLines.map((line) => line.length).sort()[0];
  const maxWordLength = Array(shortestLine)
    .fill(null)
    .map((_, i) => getLongestTokenOfColumn(tokensLines, i));
  const paddedTokens = tokensLines.map((line) =>
    line.map((el, i, arr) =>
      i < maxWordLength.length && i !== arr.length - 1
        ? pad(el, maxWordLength[i])
        : el
    )
  );
  return paddedTokens
    .map((wordLine) => pad("", leftSpacesCount) + wordLine.join(" "))
    .join("\n");
}
/**
 * Return a array of token,
 * takes into account string and string escape characters
 */
function parseTokens(line: string): string[] {
  const tokens: string[] = [];
  let tmp = "";
  let isInString = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    const prevCh = line[i - 1];
    if (ch === " " && !isInString) {
      if (tmp) {
        tokens.push(tmp);
      }
      tmp = "";
    } else {
      if (ch === '"' && prevCh !== "\\") {
        isInString = !isInString;
      }
      tmp += ch;
    }
  }
  tokens.push(tmp);
  return tokens;
}

function countSpacesBeforeFirstWord(line: string): number {
  return line.split("").findIndex((el) => el !== " ");
}

function getLongestTokenOfColumn(grid: string[][], column: number): number {
  const lengths = grid.map((line) => line[column].length);
  const sorted = lengths.sort((a, b) => b - a);
  return sorted[0] || 0;
}

function pad(str: string, n: number, symbol: string = " ") {
  return str + symbol.repeat(n - str.length);
}
