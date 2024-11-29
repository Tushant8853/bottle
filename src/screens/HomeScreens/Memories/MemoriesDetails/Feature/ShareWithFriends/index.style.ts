import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  Container: {
    marginTop: 20,
    marginHorizontal: 16,
    flex: 1,
    backgroundColor: 'white',
  },
  ItemNotPublic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  Line: {
    borderBottomWidth: 1,
    flex: 1,
    marginHorizontal: 6,
    borderColor: '#522F60',
  },
  ItemNotPublicText: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16.71,
    color: '#522F60',
  },
  ShareContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    height: 30,
    borderColor: '#522F60',
    justifyContent: 'center',
    backgroundColor: '#522F60',
  },
  BoxContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    height: 30,
    borderColor: '#522F60',
  },
  ShareWithFriendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  IconWrapper: {
    width: 32,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ShareIcon: {
    color: '#FFFFFF',
  },
  ShareWithFriendsText: {
    fontFamily: 'SF Pro',
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 19,
    color: '#FFFFFF',
    textAlign: 'center',
    flex: 2,
  },
  ArrowIcon: {
    color: '#FFFFFF',
  },
  UserInfoContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    borderColor: '#522F60',
  },
  UserInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  UserLocationTextContainer: {
    marginLeft: 10,
  },
  locationHeaderText: {
    width: 'auto',
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16.71,
  },
  UserIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    height: 29,
    width: 32,
    borderColor: '#522F6080',
  },
  CheckCircleIcon: {},
  HashtagContainer: {
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    height: 30,
    borderColor: '#522F60',
  },
  HashtagContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  HashtagIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    height: 29,
    width: 32,
    borderColor: '#522F6080',
  },
  HashtagTextContainer: {
    marginLeft: 10,
  },
  HashtagText: {
    width: 'auto',
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 16.71,
  },
  StartLikeCommentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  RatingContainer: {
paddingHorizontal:8,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    height: 30,
    borderColor: '#522F60',
  },
  StartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  StarIconContainer: {
    alignContent:'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    height: 29,
    width: 24,
    borderColor: '#522F6080',
  },
  RatingContent: {
    flexDirection: 'row',
    marginLeft: 4,
  },
  LikeText: {
    marginLeft: 5,
  },
  DeleteBoxContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  DeleteText: {
    fontFamily: 'SF Pro',
    fontSize: 16,
    fontWeight: '300',
    lineHeight: 19.09,
    textAlign: 'left',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
});

export default styles;
