export const generateResetPasswordTemplate = (otp: string) => {
    return `
        <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: auto;
            padding: 20px;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
        ">
            <h2 style="color: #333; text-align: center;">
                Reset Your Password
            </h2>

            <p style="font-size: 16px; color: #555;">
                We received a request to reset your password.
            </p>

            <p style="font-size: 16px; color: #555;">
                Use the OTP code below to continue:
            </p>

            <div style="
                text-align: center;
                margin: 30px 0;
            ">
                <span style="
                    display: inline-block;
                    background-color: #f4f4f4;
                    padding: 15px 30px;
                    font-size: 32px;
                    letter-spacing: 8px;
                    border-radius: 8px;
                    font-weight: bold;
                    color: #111;
                ">
                    ${otp}
                </span>
            </div>

            <p style="font-size: 14px; color: #888;">
                This OTP will expire in 5 minutes.
            </p>

            <p style="font-size: 14px; color: #888;">
                If you did not request a password reset, please ignore this email.
            </p>

            <hr style="margin: 20px 0;" />

            <p style="
                text-align: center;
                font-size: 12px;
                color: #999;
            ">
                Foodlify Security Team
            </p>
        </div>
    `;
};