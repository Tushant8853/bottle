import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import ThankYouModal from './Modal4';
import { useTranslation } from 'react-i18next';

interface Props {
    visible: boolean;
    onClose: () => void;
    onRetake: () => void;
}

const WineReviewModal: React.FC<Props> = ({ visible, onClose, onRetake }) => {
    const [thankYouVisible, setThankYouVisible] = useState(false);
      const { t } = useTranslation();


    const handleButtonPress = () => {
        setThankYouVisible(true);
        onClose();
    };

    const closeThankYouModal = () => {
        setThankYouVisible(false);
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
                    <View style={styles.modalContent}>
                        <View style={styles.topButtonContainer}>
                            <Pressable style={styles.topButton} onPress={handleButtonPress}>
                                <Text style={styles.topButtonText}>↑</Text>
                                <Text style={styles.buttonText} numberOfLines={1}> {t('delicious')}</Text>
                            </Pressable>
                        </View>
                        <Text style={styles.title}>{t('wineReview')}</Text>
                        <View style={styles.ReviewbottomContainer}>
                            <Pressable style={styles.Reviewbottom} onPress={handleButtonPress}>
                                <Text style={styles.ReviewbuttonText} numberOfLines={1}>← {t('reviewLater')}</Text>
                            </Pressable>
                        </View>
                        <View style={styles.RecordbottomContainer}>
                            <Pressable style={styles.Recordbottom} onPress={handleButtonPress}>
                                <Text style={styles.RecordbuttonText} numberOfLines={1}>{t('recordDetailedNotes')} →</Text>
                            </Pressable>
                        </View>
                        <View style={styles.DontLikeButtonContainer}>
                            <Pressable style={styles.DontLikeButtonbottom} onPress={handleButtonPress}>
                                <Text style={styles.DontLikebuttonText} numberOfLines={1}>{t('dontLike')}</Text>
                                <Text style={styles.topButtonText}>↓</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
            <ThankYouModal
                visible={thankYouVisible}
                onClose={closeThankYouModal}
                onRetake={onRetake}
            />
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#B3B3B3D1',
        borderRadius: 14,
        paddingTop: 14,
        paddingBottom: 14,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        height: 271,
    },
    topButtonContainer: {
        height: 76,
        backgroundColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        width: 170,
        top: -50,
    },
    topButton: {
        justifyContent: 'center',
        alignContent: 'center',
    },
    topButtonText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#522F60',
    },
    buttonText: {
        fontSize: 20,
        color: '#522F60',
        fontWeight: '400',
        fontFamily: 'SF Pro',
        lineHeight: 24,
    },
    title: {
        fontSize: 28,
        color: '#522F60',
        fontWeight: '600',
        fontFamily: 'SF Pro',
        lineHeight: 34,
        marginTop: -25,
    },
    ReviewbottomContainer: {
        width: '90%',
        marginRight: '30%',
        height: 35,
    },
    Reviewbottom: {
        backgroundColor: '#E5E5E5',
        borderRadius: 8,
        width: '100%',
        height: 35,
        justifyContent: 'center',
        marginTop: 10,
    },
    ReviewbuttonText: {
        fontSize: 20,
        color: '#522F60',
        fontWeight: '400',
        textAlign: 'left',
        marginLeft: 10,
    },
    RecordbottomContainer: {
        width: '90%',
        marginLeft: '30%',
        height: 35,
    },
    Recordbottom: {
        backgroundColor: '#E5E5E5',
        borderRadius: 8,
        width: '100%',
        height: 35,
        justifyContent: 'center',
        marginTop: 20,
    },
    RecordbuttonText: {
        fontSize: 20,
        color: '#522F60',
        fontWeight: '400',
        textAlign: 'right',
        marginRight: 10,
    },
    DontLikeButtonContainer: {
        width: 170,
        height: 76,
        marginTop: 50,
        backgroundColor: '#E5E5E5',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    DontLikeButtonbottom: {
        marginTop: 10,
        backgroundColor: '#E5E5E5',
        paddingVertical: 10,
        borderRadius: 10,
        width: '100%',
    },
    DontLikebuttonText: {
        fontSize: 20,
        color: '#522F60',
        fontWeight: '400',
        textAlign: 'center',
        fontFamily: 'SF Pro',
        lineHeight: 34,
    },
});

export default WineReviewModal;
