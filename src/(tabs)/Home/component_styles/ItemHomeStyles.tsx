import {StyleSheet} from 'react-native';
import {Colors} from '../../../../assets/color/Colors';

export const ItemHomeStyles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  wrapper: {
    width: '100%',
    marginTop: 10,
  },
  fullSize: {
    width: '100%',
    height: '100%',
  },
  footer: {
    padding: 10,
  },
  footerTop: {
    justifyContent: 'space-between',
  },
  countText: {
    color: Colors.dark.text,
    marginHorizontal: 8,
  },
  dateText: {
    color: Colors.dark.text,
    fontSize: 12,
  },
  muteIcon: {
    width: 24,
    height: 24,
    tintColor: Colors.dark.text,
  },
  video: {
    width: '100%',
    backgroundColor: Colors.black,
    height: 600,
  },
  headerItem: {
    position: 'absolute',
    zIndex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.light.transparent,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  imgUser: {
    width: '100%',
    height: '100%',
  },
  textNormal: {
    fontSize: 14,
  },
  text: {
    fontSize: 12,
  },
  btnFollow: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: Colors.light.transparent,
    borderWidth: 1,
    marginRight: 10,
  },
  iconBlock: {
    width: 24,
    height: 24,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    marginVertical: 10,
    fontSize: 14,
  },
  muteButton: {
    width: 25,
    height: 25,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  blockWhite: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.light.transparent,
  },
  optionsButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  pagination: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  modalStyle: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 18,
  },
  handleStyle: {
    height: 6,
    width: 40,
    marginBottom: 8,
  },
});
