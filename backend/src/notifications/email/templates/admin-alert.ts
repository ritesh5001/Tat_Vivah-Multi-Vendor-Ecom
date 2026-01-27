import { EmailTemplateResult } from '../../types.js';

export function adminAlertTemplate(data: { title: string, message: string }): EmailTemplateResult {
    return {
        subject: `[Admin Alert] ${data.title}`,
        html: `
            <h1>Admin Alert</h1>
            <p><strong>${data.title}</strong></p>
            <p>${data.message}</p>
        `
    };
}
