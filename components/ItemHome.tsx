import React, {useRef, useCallback, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import Video from 'react-native-video';
import {Modalize} from 'react-native-modalize';
import {Colors} from '../assets/color/Colors';
import {useTheme} from '../src/util/ThemeContext';
import {Portal} from 'react-native-portalize';
import BottomSheetOptions, {OptionItem} from './BottomSheetOptions';
import BottomSheetIntentions, {IntentionOption} from './BottomSheetIntentions';
import {useNavigation} from '@react-navigation/native';

const ItemHome = (props: any) => {
  const {
    id,
    uriVideo,
    img,
    imgUser,
    name,
    like,
    comment,
    share,
    title,
    date,
    currentVisible,
    modalizeRef,
    setCurrentPost,
    isFocused,
  } = props;

  const {theme} = useTheme();
  const color = Colors[theme];
  const [muted, setMuted] = React.useState(true);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const navigation: any = useNavigation();

  // Modalize bottom sheet reference
  const sheetRef = useRef<Modalize>(null);
  const openOptions = useCallback(() => {
    sheetRef.current?.open();
  }, []);
  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  const onSheetClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const intentRef = useRef<Modalize>(null);
  const openIntentions = useCallback(() => intentRef.current?.open(), []);
  const closeIntentions = useCallback(() => intentRef.current?.close(), []);
  const onIntentionsClose = useCallback(() => {}, []);

  // Number formatting utility
  const formatNumber = (num: number): string => {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  // Bottom sheet options
  const topOptions: OptionItem[] = [
    {
      id: 'bookmark',
      icon: require('../assets/icon/bookmark.png'),
      label: 'Bookmark',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'remix',
      icon: require('../assets/icon/remix.png'),
      label: 'Remix',
      onPress: () => {
        closeSheet();
      },
    },
  ];
  const firstListOptions: OptionItem[] = [
    {
      id: 'favorite',
      icon: require('../assets/icon/star.png'),
      label: 'Adding to favorite',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'unfollow',
      icon: require('../assets/icon/unfollow.png'),
      label: 'Unfollow',
      onPress: () => {
        closeSheet();
      },
    },
  ];
  const secondListOptions: OptionItem[] = [
    {
      id: 'accountInfo',
      icon: require('../assets/icon/account.png'),
      label: 'This account info',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'whySee',
      icon: require('../assets/icon/info.png'),
      label: 'Why am I seeing this post',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'hide',
      icon: require('../assets/icon/blind.png'),
      label: 'Hide',
      onPress: () => {
        closeSheet();
      },
    },
    {
      id: 'report',
      icon: require('../assets/icon/report.png'),
      label: 'Report this post',
      onPress: () => {
        closeSheet();
        openIntentions();
      },
      labelColor: '#FF0000',
    },
  ];

  const reportChoices: IntentionOption[] = [
    {
      id: 'bullying',
      label: 'Bullying or unwanted contact',
      onPress: closeIntentions,
    },
    {
      id: 'selfHarm',
      label: 'Suicide, self-injury or eating disorders',
      onPress: closeIntentions,
    },
    {
      id: 'violence',
      label: 'Violence, hate or exploitation',
      onPress: closeIntentions,
    },
    {
      id: 'restricted',
      label: 'Selling or promoting restricted items',
      onPress: closeIntentions,
    },
    {
      id: 'nudity',
      label: 'Nudity or sexual activity',
      onPress: closeIntentions,
    },
    {id: 'spam', label: 'Scam, fraud or spam', onPress: closeIntentions},
    {id: 'false', label: 'False information', onPress: closeIntentions},
    {
      id: 'copyright',
      label: 'Vandalism of intellectual property',
      onPress: closeIntentions,
    },
  ];

  const textColor = uriVideo ? Colors.dark.text : color.text;

  return (
    <View style={styles.wrapper}>
      {/* Single Modalize wrapping only the BottomSheetOptions content */}
      <Portal>
        <Modalize
          ref={sheetRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 18,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          scrollViewProps={{scrollEnabled: false}}
          adjustToContentHeight
          // only updates state, does NOT call sheetRef.close()
          onClose={onSheetClose}>
          <BottomSheetOptions
            topOptions={topOptions}
            listOptionGroups={[firstListOptions, secondListOptions]}
            // when an option is pressed, only CLOSE the sheet
            // BottomSheetOptions will call item.onPress(), then onClose()
            onClose={closeSheet}
          />
        </Modalize>
      </Portal>

      <Portal>
        <Modalize
          ref={intentRef}
          modalStyle={{
            backgroundColor: color.background,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            paddingTop: 18,
          }}
          handleStyle={{
            backgroundColor: color.text,
            height: 6,
            width: 40,
            marginBottom: 8,
          }}
          handlePosition="inside"
          panGestureEnabled
          scrollViewProps={{scrollEnabled: false}}
          adjustToContentHeight
          onClose={onIntentionsClose}>
          <BottomSheetIntentions
            title="Report"
            subtitle="Why are you reporting this post?"
            content="Your report is anonymous. If someone is in immediate danger, call the local emergency services - don’t wait."
            options={reportChoices}
            onClose={closeIntentions}
          />
        </Modalize>
      </Portal>

      <View style={styles.container}>
        <View style={styles.video}>
          {uriVideo ? (
            <Video
              source={{uri: uriVideo}}
              resizeMode="cover"
              style={{width: '100%', height: '100%'}}
              repeat
              paused={currentVisible !== id || !isFocused}
              muted={muted}
            />
          ) : (
            <>
              <View style={styles.blockWhite}></View>
              <Image
                source={{uri: img}}
                style={{width: '100%', height: '100%'}}
                resizeMode="cover"
              />
            </>
          )}
        </View>
        <View style={styles.headerItem}>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.blockImg}
              onPress={() => {
                navigation.navigate('InfoUser', {id});
              }}>
              <Image style={styles.imgUser} source={{uri: imgUser}} />
            </TouchableOpacity>
            <View>
              <Text
                style={[
                  styles.textNormal,
                  {color: uriVideo ? Colors.dark.text : color.text},
                ]}>
                {name}
              </Text>
              <Text
                style={[
                  styles.text,
                  {color: uriVideo ? Colors.dark.text : color.text},
                ]}>
                Gợi ý cho bạn
              </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={[
                styles.btnFollow,
                {
                  borderColor: uriVideo ? Colors.light.background : color.text,
                },
              ]}>
              <Text
                style={[
                  styles.textNormal,
                  {color: uriVideo ? Colors.dark.text : color.text},
                ]}>
                Theo dõi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={openOptions}>
              <Image
                style={{
                  tintColor: uriVideo ? Colors.light.background : color.text,
                }}
                source={require('../assets/icon/menu-dots-vertical.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.muteButton}
          onPress={() => setMuted(!muted)}>
          <Image
            source={
              muted
                ? require('../assets/icon/mute.png')
                : require('../assets/icon/volume.png')
            }
            style={{width: 24, height: 24, tintColor: Colors.dark.text}}
          />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: color.background, padding: 10}}>
        <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
          <View style={styles.rowContainer}>
            <TouchableOpacity style={styles.iconBlock}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../assets/icon/heart.png')}
              />
            </TouchableOpacity>
            <Text
              style={{color: color.text, marginLeft: 8, marginRight: 16}}
              onPress={() => {
                modalizeRef?.current?.open();
              }}>
              {formatNumber(like)}
            </Text>
            <TouchableOpacity style={styles.iconBlock}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../assets/icon/comment.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(comment)}
            </Text>
            <TouchableOpacity style={styles.iconBlock}>
              <Image
                style={[{tintColor: color.text}, styles.icon]}
                source={require('../assets/icon/share.png')}
              />
            </TouchableOpacity>
            <Text style={{color: color.text, marginLeft: 8, marginRight: 16}}>
              {formatNumber(share)}
            </Text>
          </View>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={[{tintColor: color.text}, styles.icon]}
              source={require('../assets/icon/bookmark.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.title, {color: color.text}]}>{title}</Text>
        <Text style={{color: color.text, fontSize: 12}}>{date}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {position: 'relative', width: '100%'},
  wrapper: {width: '100%', marginTop: 10},
  fullSize: {width: '100%', height: '100%'},
  footer: {padding: 10},
  footerTop: {justifyContent: 'space-between'},
  countText: {color: Colors.dark.text, marginHorizontal: 8},
  dateText: {color: Colors.dark.text, fontSize: 12},
  muteIcon: {width: 24, height: 24, tintColor: Colors.dark.text},
  video: {width: '100%', height: 600},
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
  rowContainer: {flexDirection: 'row', alignItems: 'center'},
  blockImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  imgUser: {width: '100%', height: '100%'},
  textNormal: {fontSize: 14},
  text: {fontSize: 12},
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
  iconBlock: {width: 24, height: 24},
  icon: {width: '100%', height: '100%'},
  title: {marginVertical: 10, fontSize: 14},
  muteButton: {position: 'absolute', bottom: 20, right: 20},
  blockWhite: {
    width: '100%',
    height: 60,
    backgroundColor: Colors.light.transparent,
  },
  optionsButton: {padding: 8, justifyContent: 'center', alignItems: 'center'},
  optionsIcon: {width: 24, height: 24, resizeMode: 'contain'},
});

export default ItemHome;
