import React, { useState, useEffect } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import WineReviewModal from './Modal3';
import { supabase } from "../../../../backend/supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveImageToLocalStorage } from '../Upload/Uplaod_Local';
import uuid from 'react-native-uuid';
import * as Location from 'expo-location';
import { getLocation } from '../Upload/Location';

interface Props {
    visible: boolean;
    onClose: () => void;
    onRetake: () => void;
    photoUri: string;
}

const CameraInputModal: React.FC<Props> = ({ visible, onClose, onRetake, photoUri }) => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [error1, setError1] = useState(false);
    const [error2, setError2] = useState(false);
    const [error3, setError3] = useState(false);
    const [doneModalVisible, setDoneModalVisible] = useState(false);

   
    const handleSave = async () => {
        const savedFilePath = await saveImageToLocalStorage(photoUri);
        if (!savedFilePath) {
            console.error('Error: savedFilePath is undefined');
            return;
        }
        const fileName = savedFilePath.substring(savedFilePath.lastIndexOf('/') + 1);

        const UID = await AsyncStorage.getItem("UID");
        const Memory_id = uuid.v4();
        const location = await getLocation();
        const isValid = input1.trim() !== '' && input2.trim() !== '' && input3.trim() !== '';
        if (!isValid) {
            setError1(input1.trim() === '');
            setError2(input2.trim() === '');
            setError3(input3.trim() === '');
            return;
        }

        if (!location) {
            console.error('Error: location is null');
            return;
        }

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
                eye_brand: input1,
                eye_varietal: input2,
                eye_vintage: input3,
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

    return (
        <>
            <Modal
                transparent={true}
                visible={visible}
                animationType="fade"
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.inputModal}>
                        <View style={styles.inputModalTitleConatainer}>
                            <Text style={styles.inputModalTitle}>Please tell us which wine this is</Text>
                        </View>
                        <TextInput
                            style={[
                                styles.input,
                                error1 ? styles.inputError : null,
                            ]}
                            placeholder="Wine name"
                            value={input1}
                            onChangeText={(text) => {
                                setInput1(text);
                                if (error1) setError1(false);
                            }}
                        />
                        <TextInput
                            style={[
                                styles.input,
                                error2 ? styles.inputError : null,
                            ]}
                            placeholder="Winery name"
                            value={input2}
                            onChangeText={(text) => {
                                setInput2(text);
                                if (error2) setError2(false);
                            }}
                        />
                        <TextInput
                            style={[
                                styles.input,
                                error3 ? styles.inputError : null,
                            ]}
                            placeholder="Vintage (year)"
                            value={input3}
                            onChangeText={(text) => {
                                setInput3(text);
                                if (error3) setError3(false);
                            }}
                        />

                        <View style={styles.iosButtonGroup}>
                            <Pressable
                                style={[styles.iosButton, styles.iosDefaultButton]}
                                onPress={handleSave}
                            >
                                <Text style={styles.iosButtonText}>Done</Text>
                            </Pressable>
                            <Pressable
    style={[styles.iosButton, styles.iosDefaultButton]}
    onPress={async () => {
        // try {
           
        //     const pendingTask = {
        //         photoUri,
        //         input1,
        //         input2,
        //         input3,
        //     };
        //     await AsyncStorage.setItem('PENDING_TASK', JSON.stringify(pendingTask));
        // } catch (error) {
        //     console.error('Failed to save pending task:', error);
        // }
        onClose();
    }}
>
    <Text style={styles.iosButtonText2}>Do this later</Text>
</Pressable>

                            <Pressable
                                style={[styles.iosButton, styles.iosCancelButton]}
                                onPress={() => {
                                    onClose();
                                    onRetake();
                                }}
                            >
                                <Text style={styles.iosCancelButtonText}>Cancel</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>

            <WineReviewModal
                visible={doneModalVisible}
                onClose={() => setDoneModalVisible(false)}
                onRetake={onRetake}
            />
        </>
    );
};

export default CameraInputModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputModal: {
        backgroundColor: '#B3B3B3D1',
        width: '80%',
        height: 316,
        borderRadius: 14,
        paddingTop: 14,
        alignItems: 'center',
    },
    inputModalTitleConatainer: {
        marginBottom: 14,
        height: 22,
    },
    inputModalTitle: {
        fontFamily: 'SF Pro',
        fontSize: 17,
        fontWeight: '400',
        textAlign: 'center',
        color: '#000000',
        lineHeight: 22,
    },
    input: {
        width: '90%',
        height: 30,
        borderWidth: 0.5,
        borderColor: '#3C3C434A',
        borderRadius: 5,
        marginBottom: 10,
        paddingHorizontal: 10,
        backgroundColor: '#FFFFFF',
    },
    inputError: {
        borderColor: 'red',
    },
    iosButtonGroup: {
        width: '100%',
        marginTop: 8,
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
