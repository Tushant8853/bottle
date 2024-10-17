import { supabase } from '../supabase/supabaseClient';

export const fetchImages = async () => {
    const { data, error } = await supabase
        .from('bottleshock_memories')
        .select('*'); // Adjust column name if necessary

    if (error) {
        console.error(error);
        return [];
    }
    console.log("Data ::::::::::::::", data)
    console.log(data.map(item => item.image))
    return data.map(item => `https://webseriesindia.twic.pics/image/${item.image}`);
};