const { createClient } = require('@supabase/supabase-js');

// Replace with your Supabase URL and public API key
const supabaseUrl = 'https://hxxwdvxsyzoemhdmcrqc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eHdkdnhzeXpvZW1oZG1jcnFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2Mzc4NDksImV4cCI6MjAzOTIxMzg0OX0.5mpc2z08HVEn-W42mHSXCydWY38nJPuoVflFRV4CbQM';
const supabase = createClient(supabaseUrl, supabaseKey);
const seedTradingCourseLevels = async () => {
    const courseLevels = [
        { name: 'Beginner' },
        { name: 'Intermediate' },
        { name: 'Advanced' },
        { name: 'Expert' },
        { name: 'Professional' },
    ];

    for (const level of courseLevels) {
        const { data, error } = await supabase
            .from('categories')
            .insert([level]);

        if (error) {
            console.error(`Error inserting trading course level ${level.name}:`, error);
        } else {
            //console.log(`Trading course level ${level.name} inserted successfully.`);
        }
    }
};

seedTradingCourseLevels()
    .then(() => {
        //console.log('Seeding completed.');
    })
    .catch((err) => {
        console.error('Seeding failed:', err);
    });