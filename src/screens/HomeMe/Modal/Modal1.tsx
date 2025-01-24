// CameraConfirmationModal.tsx
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import CameraInputModal from './Modal2';  // Import the new modal
import { saveImageToLocalStorage } from '../Upload/Uplaod_Local';
import WineReviewModal from './Modal3';
import uuid from 'react-native-uuid';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocation } from '../Upload/Location';
import { supabase } from "../../../../backend/supabase/supabaseClient";
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
    const [isInputModalVisible, setInputModalVisible] = useState(false);
    const [doneModalVisible, setDoneModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    

    const handleNoClick = () => {
        setInputModalVisible(true);
        onClose();
    };
    const handleXanderSave = async () => {
        onClose();
        setLoading(false);
        setDoneModalVisible(true);
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
                restaurant_id: location.restaurantId,
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
    };
    const handleHertelendySave = async () => {
        onClose();
        setLoading(false);
        setDoneModalVisible(true);
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
    };
    const handleSaveWine = async (Wine_Values: string) => {
        onClose();
        setLoading(false);
        setDoneModalVisible(true);
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
    };
    const handleSameSaveWine = async (Wine_Values: string, SameId: number) => {
        onClose();
        setLoading(false);
        setDoneModalVisible(true);
        console.log('Inside handleSameSaveWine');
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);
        const UID = await AsyncStorage.getItem("UID");
        const { data: memoryWinesData, error: memoryWinesError } = await supabase.from('bottleshock_memory_wines').insert([
            {
                eye_varietal: Wine_Values,
                user_id: UID,
                user_photo: fileName,
                memory_id: SameId,
            },
        ]);

        if (memoryWinesError) {
            console.error('Error saving data to bottleshock_memory_wines:', memoryWinesError);
            return;
        }

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
    const handleSameHertelendySave = async (SameId: number) => {
        onClose();
        setLoading(false);
        setDoneModalVisible(true);
        console.log('Inside Same HertelendySave');
    
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);
    
        const UID = await AsyncStorage.getItem("UID");
    
        try {
            // Check if a record already exists in bottleshock_memory_wines
            const { data: existingMemory, error: checkError } = await supabase
                .from('bottleshock_memory_wines')
                .select('*')
                .eq('memory_id', SameId)
                .eq('wine_id', 36)
                .single(); // .single() will return null if no record is found
    
            if (checkError) {
                console.error('Error checking existing memory:', checkError);
                return;
            }
    
            // Insert into bottleshock_memory_wines only if it does not exist
            if (!existingMemory) {
                const { data: memoryWinesData, error: memoryWinesError } = await supabase
                    .from('bottleshock_memory_wines')
                    .insert([
                        {
                            eye_brand: "Hertelendy",
                            eye_varietal: "Audere",
                            eye_vintage: 1997,
                            user_id: UID,
                            user_photo: fileName,
                            memory_id: SameId,
                            wine_id: 36,
                        },
                    ]);
    
                if (memoryWinesError) {
                    console.error('Error saving data to bottleshock_memory_wines:', memoryWinesError);
                    return;
                }
            } else {
                console.log('Record already exists in bottleshock_memory_wines. Skipping insertion.');
            }
    
            // Always insert into bottleshock_memory_gallery
            const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase
                .from('bottleshock_memory_gallery')
                .insert([
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
    
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
    };
    
    const handleSameXanderSave = async (SameId: number) => {
        onClose();
        setLoading(false);
        setDoneModalVisible(true);
        console.log('Inside Same handleSave');
    
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);
    
        const UID = await AsyncStorage.getItem("UID");
    
        try {
            // Check if a record already exists in bottleshock_memory_wines
            const { data: existingMemory, error: checkError } = await supabase
                .from('bottleshock_memory_wines')
                .select('*')
                .eq('memory_id', SameId)
                .eq('wine_id', 28)
                .single(); // .single() will return null if no record is found
    
            if (checkError) {
                console.error('Error checking existing memory:', checkError);
            }
    
            // Insert into bottleshock_memory_wines only if it does not exist
            if (!existingMemory) {
                const { data: memoryWinesData, error: memoryWinesError } = await supabase
                    .from('bottleshock_memory_wines')
                    .insert([
                        {
                            eye_brand: "Xander",
                            eye_varietal: "Pinot Noir",
                            eye_vintage: 2020,
                            user_id: UID,
                            user_photo: fileName,
                            memory_id: SameId,
                            wine_id: 28,
                        },
                    ]);
    
                if (memoryWinesError) {
                    console.error('Error saving data to bottleshock_memory_wines:', memoryWinesError);
                    return;
                }
            } else {
                console.log('Record already exists in bottleshock_memory_wines. Skipping insertion.');
            }
    
            // Always insert into bottleshock_memory_gallery
            const { data: bottleshock_memory_gallery, error: bottleshock_memory_galleryError } = await supabase
                .from('bottleshock_memory_gallery')
                .insert([
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
    
        } catch (error) {
            console.error('An unexpected error occurred:', error);
        }
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
            return `${t('isThis')} ${Dish_Values}?`;
        }
        return t('noFoodWineIdentified');
    };
    const checkforMemories = async (Wine_Values: string | null, Dish_Values: string | null, Null_Values: string | null) => {
        try {
            setLoading(true);
            const UID = await AsyncStorage.getItem("UID");
            
            // Get location once
            const location = await getLocation();
            const currentTime = new Date();
            
            const { data: memoriesData, error } = await supabase
                .from("bottleshock_memories")
                .select("created_at, location_long, location_lat, id")
                .eq("user_id", UID)
                // Filter memories within last 3 hours
                .gte('created_at', new Date(currentTime.getTime() - (3 * 60 * 60 * 1000)).toISOString());

            if (error) {
                console.error("Error fetching memories:", error.message);
                return;
            }

            // Find nearby memory
            const nearbyMemory = memoriesData.find(memory => {
                const distance = calculateDistance(
                    location.latitude,
                    location.longitude,
                    memory.location_lat,
                    memory.location_long
                );
                return distance <= 100;
            });

            // Handle different wine types
            if (Wine_Values === "Xander Pinot Noir") {
                if (nearbyMemory) {
                    await handleSameXanderSave(nearbyMemory.id);
                    setLoading(false);
                } else {
                    await handleXanderSave();
                    setLoading(false);
                }
            } else if (Wine_Values === "Hertelendy Audere") {
                if (nearbyMemory) {
                    await handleSameHertelendySave(nearbyMemory.id);
                    setLoading(false);
                } else {
                    await handleHertelendySave();
                    setLoading(false);
                }
            } else if (Dish_Values === null && Wine_Values != null) {
                if (nearbyMemory) {
                    await handleSameSaveWine(Wine_Values, nearbyMemory.id);
                    setLoading(false);
                } else {
                    await handleSaveWine(Wine_Values);
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
                                {t('IfNotCorrectPleaseTellUsWhichOneThisIs')}
                                </Text>
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
                                <Text style={styles.iosButtonText}>{t('yes')}</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.iosButton, styles.iosDefaultButton]}
                                onPress={handleNoClick}
                            >
                                <Text style={styles.iosButtonText2}>{t('no')}</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.iosButton, styles.iosCancelButton]}
                                onPress={() => {
                                    onCancel();
                                    onClose();
                                    onRetake();
                                }}
                            >
                                <Text style={styles.iosCancelButtonText}>{t('cancel')}</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    iosModal: {
        backgroundColor: '#f2f2f7ff',
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
