// Vercel Serverless Function for uploading images
const { createClient } = require('@supabase/supabase-js');
const FormData = require('form-data');

module.exports = async (req, res) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        // Get file from request (Vercel handles multipart/form-data)
        const file = req.files?.file || req.body?.file;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return res.status(400).json({ error: 'File must be an image' });
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'File size must be less than 5MB' });
        }

        // Generate unique filename
        const fileName = `${Date.now()}_${file.name || 'image'}`;
        const fileBuffer = Buffer.from(file.data || file);

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('greeting-images')
            .upload(fileName, fileBuffer, {
                contentType: file.type,
                upsert: false
            });

        if (error) {
            console.error('Storage error:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('greeting-images')
            .getPublicUrl(fileName);

        return res.status(200).json({ url: urlData.publicUrl, success: true });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

