// CameraConfirmationModal.tsx
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View,ActivityIndicator } from 'react-native';
import CameraInputModal from './Modal2';  // Import the new modal
import { saveImageToLocalStorage } from '../Upload/Uplaod_Local';
import ThankYouModal from './Modal4';
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocation } from '../Upload/Location';
import { supabase } from "../../../../backend/supabase/supabaseClient";
import axios from 'axios';
import { useTranslation } from 'react-i18next';
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
    const [loading, setLoading] = useState(false);
      const { t } = useTranslation();


    const closeThankYouModal = () => {
        setThankYouVisible(false);
        onClose();
    };
    const handleSaveDish = async () => {
        setLoading(true);
        onClose();
        setLoading(false);
        setThankYouVisible(true);
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
    };
    const handleSaveNull = async () => {
        setLoading(true);
        onClose();
        setLoading(false);
        setThankYouVisible(true);
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
        
    };
    const handleSameSaveNull = async (SameId: number) => {
        setLoading(true);
        onClose();
        setLoading(false);
        setThankYouVisible(true);
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
    };
    const handleSameSaveDish = async (SameId: number) => {
        setLoading(true);
        onClose();
        setLoading(false);
        setThankYouVisible(true);
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
                is_thumbnail: false,
                user_id: UID,
                file: fileName,
            },
        ])
            .select();

        if (bottleshock_memory_galleryError) {
            console.error('Error saving data to bottleshock_memory_gallery:', bottleshock_memory_galleryError);
        }
    };
const checkforMemories = async (
    Wine_Values: string | null,
    Dish_Values: string | null,
    Null_Values: string | null
) => {
    try {
        setLoading(true);

        const UID = await AsyncStorage.getItem("UID");

        // Get location once
        const location = await getLocation();
        const currentTime = new Date();

        // Fetch memories filtered by time (last 3 hours)
        const { data: memoriesData, error } = await supabase
            .from("bottleshock_memories")
            .select("created_at, location_long, location_lat, id")
            .eq("user_id", UID)
            .gte(
                "created_at",
                new Date(currentTime.getTime() - 3 * 60 * 60 * 1000).toISOString()
            );

        if (error) {
            console.error("Error fetching memories:", error.message);
            return;
        }

        // Find nearby memory
        const nearbyMemory = memoriesData.find((memory) => {
            const distance = calculateDistance(
                location.latitude,
                location.longitude,
                memory.location_lat,
                memory.location_long
            );
            return distance <= 100;
        });

        // Process Dish Values
        if (Dish_Values !== null && Wine_Values === null) {
            console.log("Processing Dish...");
            if (nearbyMemory) {
                await handleSameSaveDish(nearbyMemory.id);
                setLoading(false);
            } else {
                await handleSaveDish();
                setLoading(false);
            }
        }

        // Process Null Values
        if (Null_Values !== null) {
            console.log("Processing Null...");
            if (nearbyMemory) {
                await handleSameSaveNull(nearbyMemory.id);
                setLoading(false);
            } else {
                await handleSaveNull();
                setLoading(false);
            }
        }
    } catch (error) {
        console.error("Error in checkforMemories:", error);
    } finally {
        setLoading(false);
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
                return t('isThisXanderPinotNoir');
            } else {
                return `${t('isThis')} ${Wine_Values} ? `;
            }
        }
        if (Dish_Values != null) {
            return `${Dish_Values} ${t('identified')}`;
        }
        return t('noFoodWineIdentified');
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
                                onPress={() => {
                                    onClose();
                                    checkforMemories(Wine_Values, Dish_Values, Null_Values);
                                }}
                            >
                                <Text style={styles.iosButtonText}>Ok</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal >
            {loading && (
                <View style={styles.loaderOverlay}>
                    <View style={styles.loaderBox}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loaderText}>{t('loading')}</Text>
                    </View>
                </View>
            )}
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
        backgroundColor: '#f2f2f7ff',
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
    loaderOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 100,
      },
      loaderBox: {
        width: 150,
        height: 150,
        borderRadius: 15,
        backgroundColor: '#B3B3B3D1',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      loaderText: {
        marginTop: 20,
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
      },
      loaderCloseButton: {
        borderTopWidth: 0.33,
        borderColor: '#3C3C435C',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 150,
      },
      loaderCancleText: {
        fontSize: 12,
        color: '#fff',
        marginTop: 4
      },
});
