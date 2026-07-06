import * as vscode from 'vscode';
import { RuleMetadata } from '../models/RuleMetadata';

export class RuleDetailsService {

    public static async show(
        rule: RuleMetadata
    ): Promise<void> {

        const panel = vscode.window.createWebviewPanel(
            'ruleDetails',
            `Rule: ${rule.id}`,
            vscode.ViewColumn.One,
            {}
        );

        panel.webview.html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <style>
                body {
                    font-family: Verdana, sans-serif;
                    padding: 20px;
                    line-height: 1.6;
                }

                h1 {
                    color: #007ACC;
                }

                table {
                    border-collapse: collapse;
                    width: 100%;
                }

                td {
                    border: 1px solid #ccc;
                    padding: 8px;
                }

                td:first-child {
                    font-weight: bold;
                    width: 220px;
                }
            </style>
        </head>

        <body>

            <h1>${rule.id}</h1>

            <table>

                <tr>
                    <td>Description</td>
                    <td>${rule.description}</td>
                </tr>

                <tr>
                    <td>Category</td>
                    <td>${rule.category}</td>
                </tr>

                <tr>
                    <td>Severity</td>
                    <td>${rule.severity}</td>
                </tr>

                <tr>
                    <td>Auto Fix</td>
                    <td>${rule.autoFixSupported ? '✅ Supported' : '❌ Not Supported'}</td>
                </tr>

                <tr>
                    <td>Enabled By Default</td>
                    <td>${rule.enabledByDefault ? '✅ Yes' : '❌ No'}</td>
                </tr>

            </table>

        </body>
        </html>
        `;
    }
}