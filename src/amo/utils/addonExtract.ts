import * as extract from "extract-zip";
import * as fs from "fs";
import * as vscode from "vscode";

export async function extractAddon(
  compressedFilePath: string,
  workspaceFolder: string,
  addonGUID: string,
  addonVersion: string
) {
  if (!fs.existsSync(workspaceFolder + "/" + addonGUID)) {
    fs.mkdirSync(workspaceFolder + "/" + addonGUID);
  }

  if (!fs.existsSync(workspaceFolder + "/" + addonGUID + "/" + addonVersion)) {
    fs.mkdirSync(workspaceFolder + "/" + addonGUID + "/" + addonVersion);
  } else {
    const choice = await vscode.window.showQuickPick(["Yes", "No"], {
      placeHolder: "Addon already exists. Overwrite?",
    });
    if (choice === "No" || !choice) {
      fs.unlinkSync(compressedFilePath);
      return;
    }
  }

  await extract(compressedFilePath, {
    dir: workspaceFolder + "/" + addonGUID + "/" + addonVersion,
  });

  fs.unlinkSync(compressedFilePath); // remove xpi

  if (!fs.existsSync(workspaceFolder + "/" + addonGUID + "/" + addonVersion)) {
    return;
  }

  vscode.window.showInformationMessage("Extraction complete");

  // make files read-only
  fs.readdirSync(
    workspaceFolder + "/" + addonGUID + "/" + addonVersion
  ).forEach((file) => {
    fs.chmodSync(
      workspaceFolder + "/" + addonGUID + "/" + addonVersion + "/" + file,
      0o444
    );
  });
}
