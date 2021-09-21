const nodemailer = require('nodemailer');
const pug = require('pug');
//const htmlToText = require('htmlToText');


/*module.exports = class Email {
    constructor(user,url) {
        this.to = user.email;
        this.username = user.username;
        this.url = url;
        this.from = 'Francesco Di Nardo <fd118@outlook.com';
    }

    createTransport(){
        nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            PORT:process.env.EMAIL_PORT,
            auth:{
                user:process.env.EMAIL_USERNAME,
                pass:process.env.EMAIL_PASSWORD
            }
        });
    }

    send(template, subject){
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,{
            username: this.username,
            url = this.url,
            subject
        });
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };
        this.createTransport();
        await this.createTransport().sendMail(mailOptions);
    }

    async sendWelcome(){
        await this.send('Welcome', 'Welcome to Game Review HQ');
    }
}
*/

//Send email to for password recovery
const sendEmail = async options => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        PORT:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'Francesco Di Nardo <fd118@outlook.com',
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    //Send the email
    await transporter.sendMail(mailOptions);
};//const sendEmail

module.exports = sendEmail;