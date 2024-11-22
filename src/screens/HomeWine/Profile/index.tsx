import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation, useRoute, NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../TabNavigation/navigationTypes";

const Profile = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>
            {/* User Handle */}
            <TouchableOpacity style={styles.menuItem} onPress={()=> navigation.navigate("NameAndUser_Handle")}>
                <View style={styles.menuIconContainer}>
                    <FontAwesome5 name="user-circle" size={16} color="#522F60" />
                </View>
                <Text style={styles.menuText}>User Handle</Text>
                <Icon name="chevron-forward-outline" size={16} color="black" />
            </TouchableOpacity>

            {/* Change Password */}
            <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ChangePwd")}>
                <View style={styles.menuIconContainer}>
                    <MaterialIcons name="password" size={16} color="#522F60" />
                </View>
                <Text style={styles.menuText}>Change Password</Text>
                <Icon name="chevron-forward-outline" size={16} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
    },
    header: {
        borderBottomWidth:0.5,
        borderBottomColor: 'lightgray',
        alignItems: "center",
        paddingBottom: 10,
        paddingTop: 55,
        backgroundColor: "white",
        width: "100%",
        marginBottom:10,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: "600",
        textAlignVertical: "center",
        width: "100%",
        color: "#333",
        textAlign: "center",
        alignItems: "center",
    },
    menuList: {
        //borderWidth:1,
        marginBottom: 20,
        marginHorizontal: 16,
    },
    menuItem: {
        // borderWidth:1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgray',
    },
    menuIconContainer: {
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuText: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: "#522F60",
        marginLeft: 10,
    },
});

export default Profile;
