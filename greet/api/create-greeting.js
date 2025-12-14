// Vercel Serverless Function for creating greetings
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const {
            recipientName,
            greetingType,
            customGreeting,
            dateText,
            imageUrl,
            messageTitle,
            messageText,
            buttonText
        } = req.body;

        // Generate unique ID
        const id = generateUniqueId();

        // Insert into Supabase
        const { data, error } = await supabase
            .from('greetings')
            .insert([
                {
                    id: id,
                    recipient_name: recipientName,
                    greeting_type: greetingType,
                    custom_greeting: customGreeting || null,
                    date_text: dateText || null,
                    image_url: imageUrl,
                    message_title: messageTitle,
                    message_text: messageText,
                    button_text: buttonText,
                    created_at: new Date().toISOString()
                }
            ])
            .select();

        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: 'Failed to create greeting' });
        }

        return res.status(200).json({ id: id, success: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

function generateUniqueId() {
    return 'greet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

