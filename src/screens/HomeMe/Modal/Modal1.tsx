// CameraConfirmationModal.tsx
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import CameraInputModal from './Modal2';  // Import the new modal

interface Props {
    visible: boolean;
    onClose: () => void;
    onRetake: () => void;
    onCancel: () => void;
    firstTwoValues:string;
}

const CameraConfirmationModal: React.FC<Props> = ({ visible, onClose, onRetake, onCancel,firstTwoValues}) => {
    const [isInputModalVisible, setInputModalVisible] = useState(false);

    const handleNoClick = () => {
        setInputModalVisible(true);
        onClose();
    };

    const handleRetake = () => {
        onRetake();
        onClose();
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
                                <Text style={styles.iosModalTitle}>
                                    Is this {firstTwoValues} Cabernet Sauvignon 2013?
                                </Text>
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
                                    onClose();
                                    onRetake();
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
                                }}// Only closes the modal
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
