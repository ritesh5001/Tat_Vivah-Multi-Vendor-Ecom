import { EmailTemplateResult } from '../../types.js';

export function sellerApprovedTemplate(data: { sellerEmail?: string }): EmailTemplateResult {
    return {
        subject: 'Your TatVivah seller account is approved',
        html: `
            <h1>Seller Account Approved</h1>
            <p>Your seller account has been approved by our admin team.</p>
            <p>You can now log in and start selling on TatVivah.</p>
            ${data.sellerEmail ? `<p><strong>Account:</strong> ${data.sellerEmail}</p>` : ''}
        `,
    };
}
