// WineDetailsStyles.ts
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    marginBottom: 100,
    paddingTop: 47,
  },
  headerContainer: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  iconContainer: {
    marginHorizontal: 2,
  },
  spacer: {
    flex: 1,
  },
  rotatedIcon: {
    transform: [{ rotate: "45deg" }],
  },
  button: {
    backgroundColor: "white",
    borderRadius: 5,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    width: 35,
    height: 40,
  },
  SubContainer: {
    flexDirection: 'row',
  },
  ImgContainer: {
    height: '100%',
    width: 90,
    overflow: 'hidden',
  },
  image: {
    height: '95%',
    width: '200%',
    marginLeft: '-100%',
  },
  ScrollViewContainer: {
    marginTop:-50,
    paddingVertical:'100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    flex: 0.6,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  wineryNameContainer: {
    marginBottom: 4,
  },
  wineryName: {
    fontFamily: 'Hiragino Kaku Gothic Pro',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 30,
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
    color: '#522F60',
  },
  wineryNameJapanese: {
    fontFamily: 'Hiragino Kaku Gothic Pro',
    fontSize: 10,
    fontWeight: '300',
    lineHeight: 15,
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
    color: '#522F60',
  },
  wineNameContainer: {
    marginBottom: 4,
  },
  wineName: {
    fontFamily: 'Hiragino Kaku Gothic Pro', 
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
    color: '#522F60',
  },
  wineNameJapanese: {
    fontFamily: 'Hiragino Kaku Gothic Pro',
    fontSize: 10,
    fontWeight: '300',
    lineHeight: 15,
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
    color: '#522F60',
  },
  vintageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  vintage: {
    fontFamily: 'SF Pro',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 16.71,
    textDecorationStyle: 'solid',
    color: '#522F60',
    marginRight: 16,
  },
  vintageJapanese: {
    fontFamily: 'SF Pro',
    fontSize: 10,
    fontWeight: '300',
    lineHeight: 11.93,
    textDecorationStyle: 'solid',
    color: '#522F60',
  },
  wineTypeConatiner: {
    marginBottom: 4,
  },
  wineType: {
    fontFamily: 'Hiragino Kaku Gothic Pro', 
    fontSize: 14,
    fontWeight: '300',
    lineHeight: 21,
    textDecorationStyle: 'solid',
    textDecorationColor: 'black',
    color: '#522F60',
  },
  starsContainer: {
    marginBottom: 4,
  },
  stars: {
    fontSize: 18,
    color: '#4B0082',
    marginBottom: 4,
  },
  ratingsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  ratingBox: {
    width: 44,
    height: 16,
    backgroundColor: '#4B0082',
    borderRadius: 4,
    marginRight: 2,
    justifyContent:'center',
    alignItems:'center',
  },
  ratingText:{
    fontFamily: 'SF Pro',
    fontSize: 10,
    color: 'white',
    fontWeight:'500',
  },
  ScrollDiscriptionContainer:{
    marginLeft: 40,
    marginRight:8,
  },
  bottom:{
    marginBottom:100,
  },
  BoxAndScannerContainer:{
    marginTop:10,
    alignItems:'center',
    marginLeft: 40,
    marginRight:8,
  },
  Box1Container:{
    backgroundColor:'#BBBCDE',
    marginTop:4,
    alignItems:'center',
    justifyContent:'center',
    height:40,
    width:"100%",
    borderWidth:1,
    borderRadius:4,
    borderColor:"#522F60",
  },
  bottomText: {
    fontFamily: 'Hiragino Sans',
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 24,
    textAlign: 'center',
    color:'#522F60'
  },
  ScannerContainer:{
    marginTop:31,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagescanner: {
    width: 79,
    height: 79,
  },
});

export default styles;
