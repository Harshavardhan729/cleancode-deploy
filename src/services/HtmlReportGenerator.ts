import { HtmlReport } from '../models/HtmlReport';

export class HtmlReportGenerator {

    public static generate(
        report: HtmlReport
    ): string {

        const languageRows =
            Array.from(report.statistics.languageCounts.entries())
                .map(
                    ([language, count]) =>
                        `<tr>
                            <td>${language}</td>
                            <td>${count}</td>
                        </tr>`
                )
                .join('');

        const issueRows =
            report.issues
                .flatMap(fileItem =>
                    (fileItem.children ?? []).map(issue => ({
                        file: fileItem.label,
                        rule: issue.label.split(' - ')[0],
                        message: issue.label,
                        line: issue.line ?? 0,
                        severity: issue.severity ?? 'Warning'
                    }))
                )
                .map(issue => {

                    const badgeClass =
                        issue.severity === 'Error'
                            ? 'error'
                            : issue.severity === 'Info'
                                ? 'info'
                                : 'warning';

                    return `
                        <tr>
                            <td>${issue.file}</td>
                            <td>${issue.rule}</td>
                            <td>
                                <span class="badge ${badgeClass}">
                                    ${issue.severity}
                                </span>
                            </td>
                            <td>${issue.message}</td>
                            <td>${issue.line}</td>
                        </tr>
                    `;

                })
                .join('');

        const ruleCounts = new Map<string, number>();

        report.issues.forEach(fileItem => {

            (fileItem.children ?? []).forEach(issue => {

                const rule =
                    issue.label.split(' - ')[0];

                ruleCounts.set(
                    rule,
                    (ruleCounts.get(rule) ?? 0) + 1
                );

            });

        });

        const ruleRows =
            Array.from(ruleCounts.entries())
                .map(
                    ([rule, count]) =>
                        `<tr>
                            <td>${rule}</td>
                            <td>${count}</td>
                        </tr>`
                )
                .join('');

        const healthClass =
            report.statistics.healthScore >= 90
                ? 'health-good'
                : report.statistics.healthScore >= 70
                    ? 'health-warning'
                    : 'health-bad';

        const healthRating =
            report.statistics.healthScore >= 90
                ? 'Excellent'
                : report.statistics.healthScore >= 70
                    ? 'Good'
                    : report.statistics.healthScore >= 50
                        ? 'Needs Attention'
                        : 'Poor';

        return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>CleanCode Deploy Report</title>

<style>
body{
    font-family:Segoe UI,Arial,sans-serif;
    margin:40px;
    background:#f5f5f5;
}

h1{
    color:#007acc;
}

.metadata{
    background:white;
    padding:15px 20px;
    border-left:6px solid #007acc;
    margin-bottom:25px;
    box-shadow:0 2px 8px rgba(0,0,0,.08);
}

.metadata p{
    margin:6px 0;
}

.summary{
    display:flex;
    gap:20px;
    margin-top:20px;
    margin-bottom:30px;
}

.card{
    background:white;
    border-radius:8px;
    padding:20px;
    width:180px;
    box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.card h2{
    margin:0;
    font-size:15px;
    color:#666;
}

.card p{
    font-size:30px;
    margin-top:10px;
    font-weight:bold;
}

table{
    width:100%;
    border-collapse:collapse;
    background:white;
    margin-bottom:30px;
}

th,td{
    border:1px solid #ddd;
    padding:10px;
    text-align:left;
}

th{
    background:#007acc;
    color:white;
}

.footer{
    margin-top:30px;
    color:#666;
}

.badge{
    display:inline-block;
    padding:4px 10px;
    border-radius:12px;
    font-size:12px;
    font-weight:bold;
    color:white;
}

.warning{
    background:#f39c12;
}

.info{
    background:#3498db;
}

.error{
    background:#e74c3c;
}

.health-good{
    border-left:6px solid #2ecc71;
}

.health-warning{
    border-left:6px solid #f39c12;
}

.health-bad{
    border-left:6px solid #e74c3c;
}

.health-rating{
    margin-top:8px;
    font-size:14px;
    font-weight:600;
    color:#555;
    text-align:center;
}
</style>
</head>

<body>

<h1>CleanCode Deploy Report</h1>
<div class="metadata">

<p><strong>Tool:</strong> CleanCode Deploy</p>
<p><strong>Report Type:</strong> HTML</p>
<p><strong>Version:</strong> 0.0.1</p>
<p><strong>Generated At:</strong> ${report.generatedAt.toLocaleString()}</p>

</div>

<div class="summary">

<div class="card">
<h2>Files</h2>
<p>${report.statistics.totalFiles}</p>
</div>

<div class="card">
<h2>Issues</h2>
<p>${report.statistics.totalIssues}</p>
</div>

<div class="card ${healthClass}">
<h2>Health</h2>
<p>${report.statistics.healthScore}</p>
<div class="health-rating">
${healthRating}
</div>
</div>

</div>

<h2>Language Summary</h2>

<table>
<tr>
<th>Language</th>
<th>Files</th>
</tr>

${languageRows}

</table>

<h2>Issues</h2>

<table>
<tr>
<th>File</th>
<th>Rule</th>
<th>Severity</th>
<th>Message</th>
<th>Line</th>
</tr>

${issueRows || `
<tr>
<td colspan="5">No issues found</td>
</tr>
`}

</table>

<h2>Rule Summary</h2>

<table>
<tr>
<th>Rule</th>
<th>Count</th>
</tr>

${ruleRows || `
<tr>
<td colspan="2">No rules triggered</td>
</tr>
`}

</table>

<div class="footer">

<p>
Issue Density:
${report.statistics.issueDensity.toFixed(2)}
issues/file
</p>

<p>
Generated:
${report.generatedAt.toLocaleString()}
</p>

</div>

</body>
</html>
`;

    }

}