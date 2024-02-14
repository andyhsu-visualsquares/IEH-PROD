/**
 * @NApiVersion 2.1
 * @NModuleScope SameAccount
 * @author Andy Chan
 *
 * @ApplyTo
 * @Description
 */
define(['N/email', 'N/file'], (email, file) => {
    class EmailNotification {
        constructor(purpose, sender, recipients) {
            this.purpose = purpose
            this.sender = sender
            this.recipients = recipients
        }

        sendEmail(data) {
            log.debug('data', data)
            try {
                const attachments = []
                const subject = 'You redeemed something ah!'
                const body = this._constructEmailBody(data)

                log.debug('email body', body)

                email.send({
                    author: this.sender,
                    recipients: this.recipients,
                    subject,
                    body,
                    attachments,
                })

                log.debug('execute', 'Email sent successfully.')
            } catch (e) {
                log.error('Email Sent Error', e.toJSON ? e : e.stack ? e.stack : e.toString())
            }
        }

        _constructEmailBody(data) {
            // Replace placeholders in the template with customer data
            // let body = this.template.replace('{{FIRST_NAME}}', customer.FIRST_NAME)
            // body = body.replace('{{LAST_NAME}}', customer.LAST_NAME)
            // body = body.replace('{{INTERNAL_ID}}', customer.INTERNAL_ID)
            //
            // return body

            switch (this.purpose) {
                case 'REDEMPTION':
                    return this._constructRedemptionEmailBody(data)
            }
        }

        _constructRedemptionEmailBody(data) {
            let redeemCodeStr = ''
            data.redeemCodeList.forEach((redeemCode) => {
                redeemCodeStr += `<br><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif"><strong><em><span style="font-size:12.0pt"><span style="font-family:&quot;Times New Roman&quot;,serif"><span style="color:#262626">${redeemCode}</span></span></span></em></strong>`
            })

            const template = file.load('1773398').getContents()

            return (
                'Dear ' +
                data.FIRST_NAME +
                ',<br />' +
                '<br />' +
                'Thank you for your redemption.<br />' +
                '<br />' +
                'Please find the details of your redemption below:<br />' +
                redeemCodeStr +
                '<br />' +
                'Best Regards,&nbsp;<br />' +
                'xxx<br />' +
                'yyy'
            )
        }
    }
    return EmailNotification
})
