import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes"
import { useTranslation } from 'react-i18next';
interface Props {
    visible: boolean;
    onClose: () => void;
    onRetake: () => void;

}

const ThankYouModal: React.FC<Props> = ({ visible, onClose, onRetake }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
      const { t } = useTranslation();

    const handleOkPress = () => {
        onClose();
        onRetake();
        // navigation.navigate('Dashboard');
        onClose();
        onRetake();
    };

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.MessageContainer}>
                        <Text style={styles.message}>{t('thankYouForInput')}</Text>
                    </View>

                    <View style={styles.ButtonContainer}>
                        <Pressable style={styles.okButton} onPress={handleOkPress} >
                            <Text style={styles.okButtonText}>OK</Text>
                        </Pressable>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#f2f2f7ff',
        borderRadius: 14,
        paddingTop: 20,
        width: '80%',
        alignItems: 'center',
        elevation: 5,
        height: 166,
    },
    MessageContainer: {
        height: 101,
    },
    message: {
        fontSize: 17,
        fontWeight: '400',
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
        fontFamily: 'SF Pro',
        lineHeight: 22,
    },
    okButton: {
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    okButtonText: {
        fontSize: 17,
        color: '#007AFF',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: 'SF Pro',
        lineHeight: 22,
    },
    ButtonContainer: {
        borderTopWidth: 0.33,
        borderColor: '#3C3C435C',
        width: '100%',
    }
});

export default ThankYouModal;
