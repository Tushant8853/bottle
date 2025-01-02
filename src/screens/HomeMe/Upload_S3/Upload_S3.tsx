import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { supabase } from "../../../../backend/supabase/supabaseClient";
const API_URL = 'https://ehvzjahhgmpwbobyyfwy.supabase.co/functions/v1/getPreSignedUrl';

export const uploadImagesToS3 = async () => {
    try {

        console.log('Uploading images to S3...');
        const savedImages = JSON.parse((await AsyncStorage.getItem('savedImages')) || '[]');
        for (const uri of savedImages) {
            const presignedURL = await getPresignedURL(uri.split('/').pop());
            if (presignedURL) {
                const uploadSuccess = await uploadImageToS3(uri, presignedURL);
                if (uploadSuccess) {
                    await deleteLocalImage(uri);
                }
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
        console.log('Access Token::::::::::::', accessToken);
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

        console.log('Response Object:', response);

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
        console.log('Presigned URL:', presignedURL);
        return presignedURL;
    } catch (error) {
        console.error('Error fetching presigned URL:', error);
        return null;
    }
};

const getContentType = (uri: string): string => {
    const extension = uri.split('.').pop()?.toLowerCase();
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
};

const uploadImageToS3 = async (uri: string, presignedURL: string): Promise<boolean> => {
    try {
        // Read the file as binary
        const file = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Convert Base64 to binary data
        const binaryData = Uint8Array.from(atob(file), (char) => char.charCodeAt(0));

        const response = await fetch(presignedURL, {
            method: 'PUT',
            headers: { 'Content-Type': 'image/jpg' },
            body: binaryData, // Pass the binary data
        });

        return response.ok;
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        return false;
    }
};

const deleteLocalImage = async (uri: string) => {
    try {
        const savedImages = JSON.parse((await AsyncStorage.getItem('savedImages')) || '[]');
        const updatedImages = savedImages.filter(image => image !== uri);
        await AsyncStorage.setItem('savedImages', JSON.stringify(updatedImages));
        await FileSystem.deleteAsync(uri);
        console.log('Image deleted locally:', uri);
    } catch (error) {
        console.error('Error deleting local image:', error);
    }
};
