import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import { useRoute, RouteProp } from '@react-navigation/native';
import { supabase } from '../../../../../../../backend/supabase/supabaseClient';
import { useTranslation } from 'react-i18next';
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../../../../../../navigationTypes";
import styles from './index.style';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface Wine {
  likes: number;
  tags: string;
  comments: number;
  shared_with: string;
  star_ratings: number;
  is_public: boolean;
  shared_with_friends: boolean;
  id: string;
}

const ShareWithFriends: React.FC = () => {
  const [memoryData, setMemoryData] = useState<Wine[]>([]);
  const totalStars = 5;
  const filledStars = memoryData.length > 0 ? memoryData[0].star_ratings : 0;
  const route = useRoute<RouteProp<{ params: { id: string } }, 'params'>>();
  const { id } = route.params;
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const { data: memoriesData, error } = await supabase
          .from('bottleshock_memories')
          .select(
            'likes, tags, comments, shared_with, star_ratings, is_public, shared_with_friends'
          )
          .eq('id', id);

        if (error) {
          console.error('Error fetching memories:', error.message);
          return;
        }
        if (memoriesData && memoriesData.length > 0) {
          setMemoryData(memoriesData);
        }
      } catch (error) {
        console.error('Error in fetchMemories:', error);
      }
    };

    fetchMemories();
  }, [id]);

  const backgroundColor =
    memoryData.length > 0
      ? memoryData[0].is_public
        ? '#c92c20'
        : memoryData[0].shared_with_friends
        ? '#522F60'
        : 'white'
      : 'white';

  const borderColor =
    backgroundColor === '#c92c20'
      ? '#c92c20'
      : backgroundColor === '#522F60'
      ? '#522F60'
      : 'transparent';

  const textColor = backgroundColor === 'white' ? '#522F60' : 'white';
  const iconColor = textColor; // Same logic for icons
  const statusText =
    backgroundColor === '#c92c20'
      ? t('Public')
      : backgroundColor === '#522F60'
      ? t('SharedwithFriends')
      : t('notshared');


      const handleDelete = () => {
        Alert.alert(
          t('areYouSure'),
          '',
          [
            {
              text: t('no'),
              onPress: () => console.log('Delete canceled'),
              style: 'cancel',
            },
            {
              text: t('yes'),
              onPress: async () => {
                try {
                  // Step 1: Delete from bottleshock_memory_wines
                  const { error: deleteMemoryWinesError } = await supabase
                    .from('bottleshock_memory_wines')
                    .delete()
                    .eq('memory_id', id);
      
                  if (deleteMemoryWinesError) {
                    console.error('Error deleting from memory wines:', deleteMemoryWinesError.message);
                    return;
                  }
      
                  // Step 2: Delete from bottleshock_fav_memories
                  const { error: deleteFavMemoryError } = await supabase
                    .from('bottleshock_fav_memories')
                    .delete()
                    .eq('memory_id', id);
      
                  if (deleteFavMemoryError) {
                    console.error('Error deleting from fav memories:', deleteFavMemoryError.message);
                    return;
                  }
      
                  // Step 3: Delete from bottleshock_memory_gallery
                  const { error: deleteGalleryError } = await supabase
                    .from('bottleshock_memory_gallery')
                    .delete()
                    .eq('memory_id', id);
      
                  if (deleteGalleryError) {
                    console.error('Error deleting from memory gallery:', deleteGalleryError.message);
                    return;
                  }
      
                  // Step 4: Delete from bottleshock_saved_memories
                  const { error: deleteSavedMemoriesError } = await supabase
                    .from('bottleshock_saved_memories')
                    .delete()
                    .eq('memory_id', id);
      
                  if (deleteSavedMemoriesError) {
                    console.error('Error deleting from saved memories:', deleteSavedMemoriesError.message);
                    return;
                  }
      
                  // Step 5: Delete the memory from bottleshock_memories
                  const { error: deleteMemoryError } = await supabase
                    .from('bottleshock_memories')
                    .delete()
                    .eq('id', id);
      
                  if (deleteMemoryError) {
                    console.error('Error deleting memory:', deleteMemoryError.message);
                    return;
                  }
      
                  console.log('Memory deleted successfully');
      
                  // Step 6: Remove the task from AsyncStorage
                  const pendingTasksJson = await AsyncStorage.getItem('PENDING_TASKS');
                  if (pendingTasksJson) {
                    const pendingTasks = JSON.parse(pendingTasksJson);
      
                    // Filter out the task with the matching memoryId
                    const updatedTasks = pendingTasks.filter((task: any) => task.memoryId !== id);
      
                    // Save the updated tasks back to AsyncStorage
                    await AsyncStorage.setItem('PENDING_TASKS', JSON.stringify(updatedTasks));
                    console.log('Pending task removed from AsyncStorage');
                  }
      
                  // Navigate back after deleting the memory
                  navigation.goBack();
                } catch (error) {
                  console.error('Error in delete operation:', error);
                }
              },
            },
          ],
          { cancelable: false }
        );
      };
      
        


  return (
    <View style={styles.Container}>
      {/* item below not public */}
      <View style={styles.ItemNotPublic}>
        <View style={styles.Line} />
        <Text style={styles.ItemNotPublicText}>{t('Itemsbelowwillnotbepublic')}</Text>
        <View style={styles.Line} />
      </View>
      {/* Share to Friends Section */}
      <View style={[styles.ShareContainer, { backgroundColor, borderColor, borderWidth: 2}]}>
        <View style={styles.ShareWithFriendsContainer}>
          <View style={styles.IconWrapper}>
            <Ionicons
              name="share-outline"
              size={16}
              style={[styles.ShareIcon, { color: iconColor }]} // Apply icon color here
            />
          </View>
          <Text style={[styles.ShareWithFriendsText, { color: textColor }]}>
            {statusText}
          </Text>
          <View style={styles.IconWrapper}>
            <Feather
              name="chevron-down"
              size={16}
              style={[styles.ArrowIcon, { color: iconColor }]} // Apply icon color here
            />
          </View>
        </View>
      </View>

      {/* User Information Section */}
      {memoryData.map((wine, index) => (
        <View
          key={`user-info-${wine.shared_with}-${index}`}
          style={styles.UserInfoContainer}
        >
          <View style={styles.UserInfoContent}>
            <View style={styles.UserIconContainer}>
              <MaterialIcons name="supervisor-account" size={17} color="#522F60" />
            </View>
            <View style={styles.UserLocationTextContainer}>
              <Text style={styles.locationHeaderText}>
                @{wine.shared_with} <AntDesign name="checkcircle" size={14} color="#522F60" style={styles.CheckCircleIcon} />
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Hashtags Section */}
      {memoryData.map((wine, index) => (
        <View key={`hashtag-${wine.tags}-${index}`} style={styles.HashtagContainer}>
          <View style={styles.HashtagContent}>
            <View style={styles.HashtagIconContainer}>
              <Feather name="tag" size={17} color="#522F60" style={{ transform: [{ rotate: '90deg' }] }} />
            </View>
            <View style={styles.HashtagTextContainer}>
              <Text style={styles.HashtagText} numberOfLines={1}>
                {wine.tags}
              </Text>
            </View>
          </View>
        </View>
      ))}

      {/* Rating Section with 5 Stars in the Same Row */}
      <View style={styles.StartLikeCommentContainer}>
        {/* Rating */}
        <View style={styles.RatingContainer}>
          <View style={styles.StartContent}>
            <View style={styles.StarIconContainer}>
              <FontAwesome name="star" size={16} color="#522F60" />
            </View>
            <View style={styles.RatingContent}>
              {Array(filledStars)
                .fill(null)
                .map((_, index) => (
                  <FontAwesome key={`filled-star-${index}`} name="star" size={16} color="#522F60" />
                ))}
              {Array(totalStars - filledStars)
                .fill(null)
                .map((_, index) => (
                  <FontAwesome key={`empty-star-${index}`} name="star-o" size={16} color="#522F60" />
                ))}
            </View>
          </View>
        </View>

        {/* Like */}
        {memoryData.map((wine, index) => (
          <View key={`like-${wine.likes}-${index}`} style={styles.RatingContainer}>
            <View style={styles.StartContent}>
              <View style={styles.StarIconContainer}>
                <AntDesign name="like2" size={16} color="#522F60" style={styles.CheckCircleIcon} />
              </View>
              <View style={styles.RatingContent}>
                <Text style={styles.LikeText}>{wine.likes}</Text>
              </View>
            </View>
          </View>
        ))}

        {/* Comment */}
        {memoryData.map((wine, index) => (
          <View key={`comment-${wine.comments}-${index}`} style={styles.RatingContainer}>
            <View style={styles.StartContent}>
              <View style={styles.StarIconContainer}>
                <Octicons name="comment-discussion" size={16} color="#522F60" />
              </View>
              <View style={styles.RatingContent}>
                <Text style={styles.LikeText}>{wine.comments}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.DeleteBoxContainer}>
        <Pressable onPress={handleDelete}>
          <Text style={styles.DeleteText}>{t('Delete')}</Text>
        </Pressable>

        <Text style={styles.DeleteText} onPress={() =>
          navigation.navigate("EditMyMemories", { id })
        }>{t('edit')}</Text>
      </View>
    </View>
  );
};

export default ShareWithFriends;