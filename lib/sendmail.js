import nodemailer from 'nodemailer'
export const sendMail = async (Subject, reciever, body){
    const transporter = nodemailer.createTransport({
        host: process.env.NODMAILER_HOST,
        port: process.env.NODMAILER_PORT,
        secure: false,
        auth: {
            user: process.env.NODMAILER_EMAIL,
            pass: process.env.NODMAILER_PASS,
        }
    })

    const options = {
        from: `Ghulam Hassan ${process.env.NODMAILER_EMAIL}`,
        to: reciever,
        Subject: Subject,
        html: body
    }

    try {
        await transporter.sendMail(options)
        return { success: true }
    } catch (error) {
        return { success: false ,message:error.message}


    }

}