import { Share, Linking, Platform } from 'react-native';

/**
 * Share a link with a custom message.
 * @param {string} title - The title for the share dialog.
 * @param {string} message - A message to accompany the link.
 * @param {string} route - The specific route to share (e.g., "/story/123").
 */
export const shareDeepLink = async (
  title: string,
  message: string,
  route: string
) => {
  const baseURL = 'https://www.bottleshock.wine/app/';
  const webLink = `${baseURL}${route}`;

  const playStoreLink = `https://play.google.com/store/apps/details?id=com.instalane2.bottleshock`;
  const appStoreLink = `https://apps.apple.com/us/app/id1234567890`;

  try {
    const appLink = `bottleshock://app${route}`;
    const isAppInstalled = await Linking.canOpenURL(appLink);

    if (isAppInstalled) {
      // Share the deep link if the app is installed
      await Share.share({
        title,
        message: `${message}\n\nOpen in App: ${appLink}\nView Online: ${webLink}`,
      });
    } else {
      const storeLink = Platform.OS === 'android' ? playStoreLink : appStoreLink;
      await Share.share({
        title,
        message: `${message}\n\nView Online: ${webLink}\nDownload App: ${storeLink}`,
      });
     }
  } catch (error) {
    console.error('Error sharing link:', error);
  }
};
