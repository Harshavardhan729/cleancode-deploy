import * as vscode from 'vscode';

export class Logger {
    private static outputChannel = vscode.window.createOutputChannel('CleanCode Deploy');

    public static info(message: string): void {
        this.outputChannel.appendLine(`[INFO] ${message}`);
    }

    public static warning(message: string): void {
        this.outputChannel.appendLine(`[WARNING] ${message}`);
    }

    public static error(message: string): void {
        this.outputChannel.appendLine(`[ERROR] ${message}`);
    }

    public static show(): void {
        this.outputChannel.show();
    }
}