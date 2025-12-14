// Vercel Serverless Function for getting greetings
const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'Greeting ID is required' });
        }

        // Get from Supabase
        const { data, error } = await supabase
            .from('greetings')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: 'Greeting not found' });
        }

        // Format response
        const greeting = {
            recipientName: data.recipient_name,
            greetingType: data.greeting_type,
            customGreeting: data.custom_greeting,
            dateText: data.date_text,
            imageUrl: data.image_url,
            messageTitle: data.message_title,
            messageText: data.message_text,
            buttonText: data.button_text
        };

        return res.status(200).json(greeting);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

