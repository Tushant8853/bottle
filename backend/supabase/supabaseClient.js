import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = 'https://ehvzjahhgmpwbobyyfwy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodnpqYWhoZ21wd2JvYnl5Znd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEzNjQ5MTQsImV4cCI6MjAyNjk0MDkxNH0.nrJFwPUqd1e0BCGkgIh7Lra-HQapr7mU-hWYj6aQeo4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})
