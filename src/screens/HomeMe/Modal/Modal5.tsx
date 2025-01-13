// CameraConfirmationModal.tsx
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import CameraInputModal from './Modal2';  // Import the new modal
import { saveImageToLocalStorage } from '../Upload/Uplaod_Local';
import ThankYouModal from './Modal4';
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
    const [thankYouVisible, setThankYouVisible] = useState(false);
    
    const closeThankYouModal = () => {
        setThankYouVisible(false);
        onClose();
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

        const { data: bottleshock_memories, error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: location.locationName,
                restaurant_id: location.restaurantId,
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
        setThankYouVisible(true);
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

        const { error: bottleshock_memoriesError } = await supabase.from('bottleshock_memories').insert([
            {
                name: 'Untitled memory',
                location_lat: location.latitude,
                location_long: location.longitude,
                address: location.locationName,
                restaurant_id: location.restaurantId,
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
        setThankYouVisible(true);
    };
    const handleSameSaveNull = async (SameId: number) => {
        console.log('Inside Same Null');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);
        const UID = await AsyncStorage.getItem("UID");
        const { error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: SameId,
                content_type: 'PHOTO',
                is_thumbnail: false,
                user_id: UID,
                file: fileName,
            },
        ])
            .select();

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
        onClose();
        setThankYouVisible(true);
    };
    const handleSameSaveDish = async (SameId: number) => {
        console.log('Inside Same Dish');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);
        const UID = await AsyncStorage.getItem("UID");
        const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase.from('bottleshock_memory_gallery').insert([
            {
                memory_id: SameId,
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
        setThankYouVisible(true);
    };
    const checkforMemories = async (Wine_Values: string | null, Dish_Values: string | null, Null_Values: string | null) => {
        const UID = await AsyncStorage.getItem("UID");
        const { data: memoriesData, error } = await supabase
            .from("bottleshock_memories")
            .select("created_at , location_long , location_lat , id")
            .eq("user_id", UID);
        if (error) {
            console.error("Error fetching memories:", error.message);
            return;
        }
        const currentTime = new Date();
        if (Wine_Values === null && Dish_Values != null) {
            console.log("Dish")
            let isHandled = false;
            for (const memory of memoriesData) {
                if (Dish_Values) {
                    const location = await getLocation();
                    const memorylocation_lat = memory.location_lat;
                    const memorylocation_long = memory.location_long;
                    const currentlocation_lat = location.latitude;
                    const currentlocation_long = location.longitude;

                    const distance = calculateDistance(currentlocation_lat, currentlocation_long, memorylocation_lat, memorylocation_long);
                    const memoryTime = new Date(memory.created_at);
                    const timeDifference = (currentTime.getTime() - memoryTime.getTime()) / (1000 * 60 * 60);

                    if (timeDifference < 3 && distance <= 100) {
                        console.log(memory.id, "This memory is within 3 hours and 100 m distance");
                        console.log("Inside the Distance and time");
                        handleSameSaveDish(memory.id);
                        isHandled = true;
                        break;
                    } else {
                        console.log(memory.id, "checking next list");
                    }
                }
            }
            if (!isHandled) {
                console.log("No matching memory found, calling handleSaveWine.");
                handleSaveDish();
            }
        }
        else if (Null_Values) {
            console.log('Inside Else part');
            let isHandled = false;
            for (const memory of memoriesData) {
                if (Null_Values) {
                    const location = await getLocation();
                    const memorylocation_lat = memory.location_lat;
                    const memorylocation_long = memory.location_long;
                    const currentlocation_lat = location.latitude;
                    const currentlocation_long = location.longitude;

                    const distance = calculateDistance(currentlocation_lat, currentlocation_long, memorylocation_lat, memorylocation_long);
                    const memoryTime = new Date(memory.created_at);
                    const timeDifference = (currentTime.getTime() - memoryTime.getTime()) / (1000 * 60 * 60);

                    if (timeDifference < 3 && distance <= 100) {
                        console.log(memory.id, "This memory is within 3 hours and 100 m distance");
                        console.log("Inside the Distance and time");
                        handleSameSaveNull(memory.id);
                        break;
                    } else {
                        console.log(memory.id, "checking next list");
                    }
                }
            }
            if (!isHandled) {
                console.log("No matching memory found, calling handleSaveWine.");
                handleSaveNull();
            }
        }
    };

    interface CalculateDistance {
        (lat1: number, lon1: number, lat2: number, lon2: number): number;
    }
    const calculateDistance: CalculateDistance = (lat1, lon1, lat2, lon2) => {
        const toRadians = (degree: number): number => (degree * Math.PI) / 180;

        const R = 6371000;
        const φ1 = toRadians(lat1);
        const φ2 = toRadians(lat2);
        const Δφ = toRadians(lat2 - lat1);
        const Δλ = toRadians(lon2 - lon1);

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
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
            return `${Dish_Values} identified ?`;
        }
        return "No food/wine identified";
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
                        </View>
                        <View style={styles.iosButtonGroup}>
                            <Pressable
                                style={[styles.iosButton, styles.iosDefaultButton]}
                                onPress={() => {checkforMemories(Wine_Values, Dish_Values, Null_Values);}}
                            >
                                <Text style={styles.iosButtonText}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal >

            {/* The second modal */}
            <ThankYouModal
                visible={thankYouVisible}
                onClose={closeThankYouModal}
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
        height: 110,
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: 'center',
    },
    ModalConfirmationContainer: {
        width: '100%',
        height: 50,
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
