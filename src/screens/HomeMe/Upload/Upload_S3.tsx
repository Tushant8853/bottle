import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { supabase } from "../../../../backend/supabase/supabaseClient";
const API_URL = 'https://ehvzjahhgmpwbobyyfwy.supabase.co/functions/v1/getPreSignedUrl';

export const uploadImagesToS3 = async () => {
    try {
        const savedImages = JSON.parse((await AsyncStorage.getItem('savedImages')) || '[]');
        for (const uri of savedImages) {
            const presignedURL = await getPresignedURL(uri.split('/').pop());
            if (presignedURL) {
                await uploadImageToS3(uri, presignedURL);
                // if (uploadSuccess) {
                //     await deleteLocalImage(uri);
                // }
            }
        }
    } catch (error) {
        console.error('Error during background upload:', error);
    }
};

const getPresignedURL = async (fileName: string): Promise<string | null> => {
    try {
        const sessionResponse = await supabase.auth.getSession();
        const accessToken = sessionResponse.data.session?.access_token;
        if (!accessToken) {
            console.error('No active session or access token found');
            return null;
        }
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ fileName }),
        });

        if (!response.ok) {
            console.error(
                `Failed to fetch presigned URL: ${response.status} ${response.statusText}`
            );
            return null;
        }
        const responseBody = await response.json();
        const presignedURL = responseBody?.response?.signedUrl;
        if (!presignedURL) {
            console.error('Presigned URL not found in the response body');
            return null;
        }
        return presignedURL;
    } catch (error) {
        console.error('Error fetching presigned URL:', error);
        return null;
    }
};

const uploadImageToS3 = async (uri: string, presignedURL: string): Promise<boolean> => {
    try {
        const file = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        const binaryData = Uint8Array.from(atob(file), (char) => char.charCodeAt(0));

        const response = await fetch(presignedURL, {
            method: 'PUT',
            headers: { 'Content-Type': 'image/jpg' },
            body: binaryData,
        });
        return response.ok;
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        return false;
    }
};

