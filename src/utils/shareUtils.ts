import { Share, Linking, Platform } from 'react-native';

/**
 * Share a link with a custom message
 * @param {string} title - The title for the share dialog
 * @param {string} message - A message to accompany the link
 * @param {string} route - The specific route you want to share (e.g., "/story/123")
 */
export const shareDeepLink = async (
  title: string,
  message: string,
  route: string
) => {
  const baseURL = 'https://bottleshock.com';
  const link = `${baseURL}${route}`;
  
  // Define fallback URLs for the app stores
  const playStoreLink = `https://play.google.com/store/apps/details?id=com.instalane2.bottleshock`; // Replace with your actual package name
  const appStoreLink = `https://apps.apple.com/us/app/id1234567890`; // Replace with your actual App Store link

  try {
    // First, check if the app is installed by using the deep link
    const appLink = `bottleshock://story/${route.split('/')[2]}`;
    
    const isAppInstalled = await Linking.canOpenURL(appLink);

    if (isAppInstalled) {
      // If the app is installed, share the deep link
      await Share.share({
        title,
        message: `${message}\n\n${link}`,
        url: link,
      });
    } else {
      // If the app is not installed, share the app store link instead
      const storeLink = Platform.OS === 'android' ? playStoreLink : appStoreLink;
      await Share.share({
        title,
        message: `${message}\n\n${link}`,
        url: storeLink,
      });
    }
  } catch (error) {
    console.error('Error sharing link:', error);
  }
};
