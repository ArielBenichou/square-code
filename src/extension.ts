import * as vscode from "vscode";
import { Formatter } from "squarier";

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "squarier.formatSelection",
    () => {
      const editor = vscode.window.activeTextEditor;
      const selectedText = editor?.document.getText(editor.selection);
      if (selectedText) {
        const formatter = new Formatter({ language: "js" });
        const formattedText = formatter.format(selectedText);
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
