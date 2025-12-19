const axios = require('axios');

module.exports = async (req, res) => {
    // Vercel automatically parses the body for POST requests
    const { name, phone, country, document, inviterId } = req.body;

    // Basic validation
    if (!name || !country || !document) {
        return res.status(400).json({ error: 'الاسم والدولة ونوع المستند مطلوبان.' });
    }

    // Get secrets from Vercel Environment Variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
        console.error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set in Vercel environment variables.");
        return res.status(500).json({ error: 'خطأ في إعدادات الخادم (مفاتيح Telegram مفقودة).' });
    }

    let text = `📥 طلب تسجيل جديد\nالاسم: ${name}\nالهاتف: ${phone || '-'}\nالدولة: ${country}\nالمستند: ${document || '-'}\nوقت الإرسال: ${new Date().toLocaleString()}`;

    if (inviterId) {
        text += `\n\n🔗 تمت الدعوة بواسطة: ${inviterId}`;
        text += `\n💰 نظام الأرباح: 30% للمسجل، 30% للداعي، 40% لنا.`;
    } else {
        text += `\n💰 نظام الأرباح: 50% للمسجل، 50% لنا.`;
    }

    try {
        const telegramResponse = await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        } );

        // Respond to the client immediately
        res.status(200).json({ message: 'تم استقبال بياناتك وسيتم التواصل معك قريباً.' });

    } catch (error) {
        console.error('Error sending to Telegram:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'حدث خطأ أثناء الإرسال إلى Telegram.' });
    }
};
