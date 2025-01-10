// CameraConfirmationModal.tsx
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import CameraInputModal from './Modal2';  // Import the new modal
import { saveImageToLocalStorage } from '../Upload/Uplaod_Local';
import WineReviewModal from './Modal3';
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocation } from '../Upload/Location';
import { supabase } from "../../../../backend/supabase/supabaseClient";
import axios from 'axios';
interface Props {
    visible: boolean;
    onClose: () => void;
    onRetake: () => void;
    onCancel: () => void;
    Wine_Values: string | null;
    Dish_Values: string | null;
    Null_Values: string | null;
    photoUri: string;
}

const CameraConfirmationModal: React.FC<Props> = ({ visible, onClose, onRetake, onCancel, Wine_Values, Dish_Values, Null_Values, photoUri }) => {
    console.log("Wine -> ",Wine_Values)
    console.log("Dish -> ",Dish_Values)
    console.log("Null -> ",Null_Values !=null)
    const [isInputModalVisible, setInputModalVisible] = useState(false);
    const [doneModalVisible, setDoneModalVisible] = useState(false);
    const handleNoClick = () => {
        setInputModalVisible(true);
        onClose();
    };

    const getLocationNameFromGoogleMaps = async (latitude, longitude) => {
        try {
            const GOOGLE_MAPS_API_KEY = 'AIzaSyCmi08U5TNZAx_QLc2ASR7lkEJTT6Z9_Qs'; // Replace with your API key
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    
            console.log('Fetching location name from URL:', geocodeUrl);
    
            // Make the API call
            const response = await axios.get(geocodeUrl);
            const data = response.data;
    
            // Check if the API response is valid
            if (data.status === "OK" && data.results.length > 0) {
                const locationName = data.results[0].formatted_address; // Extract formatted address
                console.log('Location name:', locationName);
                return locationName;
            } else {
                console.warn('Geocoding API returned unexpected status:', data.status);
                return 'Unknown Location'; // Default fallback
            }
        } catch (error) {
            console.error('Error fetching location name from Google Maps:', error.message);
            return 'Unknown Location'; // Default fallback in case of an error
        }
    };
    

    const handleXanderSave = async () => {
        console.log('Inside handleSave');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);

        const UID = await AsyncStorage.getItem("UID");
        const Memory_id = uuid.v4();
        const location = await getLocation();

        const { data: bottleshock_memories, error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: location.locationName,
                user_id: UID,
                id: Memory_id,
                is_public: true,
                shared_with_friends: true

            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memoriesError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memoriesError);
        }

        const { data: memoryWinesData, error: memoryWinesError } = await supabase.from('bottleshock_memory_wines').insert([
            {
                eye_brand: "Xander",
                eye_varietal: "Pinot Noir",
                eye_vintage: 2020,
                user_id: UID,
                user_photo: fileName,
                memory_id: Memory_id,
                wine_id: 28,
            },
        ]);

        if (memoryWinesError) {
            console.error('Error saving data to bottleshock_memory_wines:', memoryWinesError);
            return;
        }

        const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: Memory_id,
                content_type: 'PHOTO',
                is_thumbnail: true,
                user_id: UID,
                file: fileName,
            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
        onClose();
        setDoneModalVisible(true);
    };
    const handleHertelendySave = async () => {
        console.log('Inside HertelendySave');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);

        const UID = await AsyncStorage.getItem("UID");
        const Memory_id = uuid.v4();
        const location = await getLocation();
        const locationName = await getLocationNameFromGoogleMaps(location.latitude, location.longitude);

        const { data: bottleshock_memories, error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: locationName,
                user_id: UID,
                id: Memory_id,
                is_public: true,
                shared_with_friends: true

            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memoriesError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memoriesError);
        }

        const { data: memoryWinesData, error: memoryWinesError } = await supabase.from('bottleshock_memory_wines').insert([
            {
                eye_brand: "Hertelendy",
                eye_varietal: "Audere",
                eye_vintage: 1997,
                user_id: UID,
                user_photo: fileName,
                memory_id: Memory_id,
                wine_id: 36,
            },
        ]);

        if (memoryWinesError) {
            console.error('Error saving data to bottleshock_memory_wines:', memoryWinesError);
            return;
        }

        const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: Memory_id,
                content_type: 'PHOTO',
                is_thumbnail: true,
                user_id: UID,
                file: fileName,
            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
        onClose();
        setDoneModalVisible(true);
    };
    const handleSaveDish = async () => {
        console.log('Inside Dish');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);

        const UID = await AsyncStorage.getItem("UID");
        const Memory_id = uuid.v4();
        const location = await getLocation();
        const locationName = await getLocationNameFromGoogleMaps(location.latitude, location.longitude);

        const { data: bottleshock_memories, error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: locationName,
                user_id: UID,
                id: Memory_id,
                is_public: true,
                shared_with_friends: true

            },
        ])
            .select();

        if (bottleshock_memoriesError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memoriesError);
        }

        const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: Memory_id,
                content_type: 'PHOTO',
                is_thumbnail: true,
                user_id: UID,
                file: fileName,
            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
        onClose();
        setDoneModalVisible(true);
    };
    const handleSaveNull = async () => {
        console.log('Inside Null');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);

        const UID = await AsyncStorage.getItem("UID");
        const Memory_id = uuid.v4();
        const location = await getLocation();
        const locationName = await getLocationNameFromGoogleMaps(location.latitude, location.longitude);

        const { error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: locationName,
                user_id: UID,
                id: Memory_id,
                is_public: true,
                shared_with_friends: true

            },
        ])
            .select();

        if (bottleshock_memoriesError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memoriesError);
        }

        const { error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: Memory_id,
                content_type: 'PHOTO',
                is_thumbnail: true,
                user_id: UID,
                file: fileName,
            },
        ])
            .select();

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
        onClose();
        setDoneModalVisible(true);
    };
    const handleSaveWine = async (Wine_Values: string) => {
        console.log('Inside handleSaveWine');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);

        const UID = await AsyncStorage.getItem("UID");
        const Memory_id = uuid.v4();
        const location = await getLocation();
        const locationName = await getLocationNameFromGoogleMaps(location.latitude, location.longitude);

        const { data: bottleshock_memories, error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: locationName,
                user_id: UID,
                id: Memory_id,
                is_public: true,
                shared_with_friends: true

            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memoriesError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memoriesError);
        }

        const { data: memoryWinesData, error: memoryWinesError } = await supabase.from('bottleshock_memory_wines').insert([
            {
                eye_varietal: Wine_Values,
                user_id: UID,
                user_photo: fileName,
                memory_id: Memory_id,
            },
        ]);

        if (memoryWinesError) {
            console.error('Error saving data to bottleshock_memory_wines:', memoryWinesError);
            return;
        }

        const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: Memory_id,
                content_type: 'PHOTO',
                is_thumbnail: true,
                user_id: UID,
                file: fileName,
            },
        ])
            .select(); // To get the inserted data or error

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
        onClose();
        setDoneModalVisible(true);
    };

    const getTitleText = () => {
        if (Wine_Values != null) {
            if (Wine_Values === "Pinot Noir") {
                return "Is this Xander Pinot Noir?";
            } else {
                return `Is this ${Wine_Values}?`;
            }
        }
        if (Dish_Values != null) {
            return `Is this ${Dish_Values}?`;
        }
        return "No wine and dish found in this image";
    };
    return (
        <>
            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.iosModal}>
                        <View style={styles.ModalConfirmationContainer} >
                            <View style={styles.iosModalTitleContainer}>
                                <Text style={styles.iosModalTitle}>{getTitleText()}</Text>
                            </View>
                            <View style={styles.iosModalMessageContainer}>
                                <Text style={styles.iosModalMessage}>
                                    If not correct please tell us which one this is
                                </Text>
                            </View>
                        </View>
                        <View style={styles.iosButtonGroup}>
                            <Pressable
                                style={[styles.iosButton, styles.iosDefaultButton]}
                                onPress={() => {
                                    if (Wine_Values === "Xander Pinot Noir") {
                                        console.log("Xander Pinot")
                                        console.log('Inside Xander Pinot Noir');
                                        handleXanderSave();
                                    }
                                    else if (Wine_Values === "Hertelendy Audere") {
                                        console.log("Hertelendy Audere")
                                        console.log('Inside Hertelendy Audere');
                                        handleHertelendySave();
                                    }
                                    else if (Dish_Values === null && Wine_Values !=null ) {
                                        console.log("Wine")
                                        if (Wine_Values) {
                                            handleSaveWine(Wine_Values);
                                        }
                                    }
                                    else if (Wine_Values === null && Dish_Values != null) {
                                        console.log("Dish")
                                        handleSaveDish();
                                    }
                                    else if ( Null_Values ) {
                                        console.log('Inside Else part ::::::::');
                                        handleSaveNull();
                                    }
                                }}
                            >
                                <Text style={styles.iosButtonText}>Yes!</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.iosButton, styles.iosDefaultButton]}
                                onPress={handleNoClick}
                            >
                                <Text style={styles.iosButtonText2}>No</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.iosButton, styles.iosCancelButton]}
                                onPress={() => {
                                    onCancel();
                                    onClose();
                                    onRetake();
                                }}
                            >
                                <Text style={styles.iosCancelButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal >

            {/* The second modal */}
            <CameraInputModal
                visible={isInputModalVisible}
                onClose={() => setInputModalVisible(false)}
                onRetake={onRetake}
                photoUri={photoUri}
            />
            <WineReviewModal
                visible={doneModalVisible}
                onClose={() => setDoneModalVisible(false)}
                onRetake={onRetake}
            />
        </>
    );
};

export default CameraConfirmationModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iosModal: {
        backgroundColor: '#B3B3B3D1',
        width: '80%',
        height: 254,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    ModalConfirmationContainer: {
        width: '100%',
        height: 101,
    },
    iosModalTitleContainer: {
        width: '100%',
        height: 44,
    },
    iosModalMessageContainer: {
        marginTop: 14,
        width: '100%',
        height: 18,
    },
    iosModalTitle: {
        fontFamily: 'SF Pro',
        fontSize: 17,
        fontWeight: '400',
        textAlign: 'center',
        color: '#000000',
    },
    iosModalMessage: {
        fontFamily: 'SF Pro',
        fontSize: 13,
        fontWeight: '400',
        textAlign: 'center',
        color: '#000000',
    },
    iosButtonGroup: {
        width: '100%',
    },
    iosButton: {
        borderTopWidth: 0.33,
        borderColor: '#3C3C435C',
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iosDefaultButton: {},
    iosCancelButton: {},
    iosButtonText: {
        fontFamily: 'SF Pro',
        fontSize: 17,
        fontWeight: '600',
        lineHeight: 22,
        letterSpacing: -0.4,
        textAlign: 'center',
        color: '#007AFF',
    },
    iosButtonText2: {
        fontFamily: 'SF Pro',
        fontSize: 17,
        fontWeight: '400',
        lineHeight: 22,
        letterSpacing: -0.4,
        textAlign: 'center',
        color: '#007AFF',
    },
    iosCancelButtonText: {
        fontSize: 16,
        fontWeight: '400',
        color: '#007AFF',
    },
});
