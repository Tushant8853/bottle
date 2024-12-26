import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import WineReviewModal from './Modal3';

interface Props {
    visible: boolean;
    onClose: () => void;
}

const CameraInputModal: React.FC<Props> = ({ visible, onClose }) => {
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [input3, setInput3] = useState('');
    const [doneModalVisible, setDoneModalVisible] = useState(false);

    // Define the handler functions for WineReviewModal


    const handleSave = () => {
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
                            style={styles.input}
                            placeholder="Wine name"
                            value={input1}
                            onChangeText={setInput1}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Winery name"
                            value={input2}
                            onChangeText={setInput2}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Vintage (year)"
                            value={input3}
                            onChangeText={setInput3}
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
                                onPress={() => {
                                    onClose();
                                }}
                            >
                                <Text style={styles.iosButtonText2}>Do this later</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.iosButton, styles.iosCancelButton]}
                                onPress={onClose}
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
