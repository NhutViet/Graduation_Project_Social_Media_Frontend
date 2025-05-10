import React, { useRef, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Video from 'react-native-video';
import { Modalize } from 'react-native-modalize';
import { Colors } from '../assets/color/Colors';
import { useTheme } from '../src/util/ThemeContext';
import BottomSheetOptions, { OptionItem } from './BottomSheetOptions';

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
  } = props;

  const { theme } = useTheme();
  const color = Colors[theme];
  const [muted, setMuted] = React.useState(true);

  // Modalize bottom sheet reference
  const sheetRef = useRef<Modalize>(null);
  const openOptions = useCallback(() => sheetRef.current?.open(), []);
  const closeOptions = useCallback(() => sheetRef.current?.close(), []);

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
    { icon: require('../assets/icon/bookmark.png'), label: 'Bookmark', onPress: closeOptions },
    { icon: require('../assets/icon/remix.png'), label: 'Remix', onPress: closeOptions },
  ];

  const firstListOptions: OptionItem[] = [
    { icon: require('../assets/icon/star.png'), label: 'Adding to favorite', onPress: closeOptions },
    { icon: require('../assets/icon/unfollow.png'), label: 'Unfollow', onPress: closeOptions },
  ];

  const secondListOptions: OptionItem[] = [
    { icon: require('../assets/icon/account.png'), label: 'This account info', onPress: closeOptions },
    { icon: require('../assets/icon/info.png'), label: 'Why am I seeing this post', onPress: closeOptions },
    { icon: require('../assets/icon/blind.png'), label: 'Hide', onPress: closeOptions },
    { icon: require('../assets/icon/report.png'), label: 'Report this post', onPress: closeOptions, labelColor: '#FF0000' },
  ];
  const textColor = uriVideo ? Colors.dark.text : color.text;

  return (
  <View style={styles.wrapper}>
    {/* Single Modalize wrapping only the BottomSheetOptions content */}
    <Modalize
      ref={sheetRef}
      modalStyle={{ backgroundColor: color.background }}
      handleStyle={{ backgroundColor: color.text, height: 4, width: 40 }}
      panGestureEnabled
    >
      <BottomSheetOptions
        topOptions={topOptions}
        listOptions={[...firstListOptions, ...secondListOptions]}
        onClose={closeOptions}
      />
    </Modalize>

    {/* Video Content */}
    <View style={styles.container}>
      <View style={styles.video}>
        {uriVideo ? (
          <Video
            source={{ uri: uriVideo }}
            resizeMode="cover"
            style={styles.fullSize}
            repeat
            paused={currentVisible !== id}
            muted={muted}
          />
        ) : (
          <Image
            source={{ uri: img }}
            style={styles.fullSize}
            resizeMode="cover"
          />
        )}
      </View>

      {/* Header */}
      <View style={styles.headerItem}>
        <View style={styles.rowContainer}>
          <View style={styles.blockImg}>
            <Image style={styles.imgUser} source={{ uri: imgUser }} />
          </View>
          <View>
            <Text style={[styles.textNormal, { color: textColor }]}>
              {name}
            </Text>
            <Text style={[styles.text, { color: textColor }]}>
              Gợi ý cho bạn
            </Text>
          </View>
        </View>
        <View style={styles.rowContainer}>
          <TouchableOpacity
            style={[styles.btnFollow, { borderColor: textColor }]}
          >
            <Text style={[styles.textNormal, { color: textColor }]}>
              Theo dõi
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={e => {
              e.persist();      // prevent synthetic-event warning
              openOptions();
            }}
            accessibilityRole="button"
            accessibilityLabel="More options"
          >
            <Image
              source={require('../assets/icon/menu-dots-vertical.png')}
              style={{ tintColor: textColor }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mute Button */}
      <TouchableOpacity
        style={styles.muteButton}
        onPress={() => setMuted(!muted)}
      >
        <Image
          source={
            muted
              ? require('../assets/icon/mute.png')
              : require('../assets/icon/volume.png')
          }
          style={styles.muteIcon}
        />
      </TouchableOpacity>
    </View>

    {/* Footer */}
    <View style={[styles.footer, { backgroundColor: color.background }]}>
      <View style={[styles.rowContainer, styles.footerTop]}>
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={[styles.icon, { tintColor: color.text }]}
              source={require('../assets/icon/heart.png')}
            />
          </TouchableOpacity>
          <Text style={styles.countText}>{formatNumber(like)}</Text>

          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={[styles.icon, { tintColor: color.text }]}
              source={require('../assets/icon/comment.png')}
            />
          </TouchableOpacity>
          <Text style={styles.countText}>{formatNumber(comment)}</Text>

          <TouchableOpacity style={styles.iconBlock}>
            <Image
              style={[styles.icon, { tintColor: color.text }]}
              source={require('../assets/icon/share.png')}
            />
          </TouchableOpacity>
          <Text style={styles.countText}>{formatNumber(share)}</Text>
        </View>

        <TouchableOpacity style={styles.iconBlock}>
          <Image
            style={[styles.icon, { tintColor: color.text }]}
            source={require('../assets/icon/bookmark.png')}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: color.text }]}>{title}</Text>
      <Text style={styles.dateText}>{date}</Text>
    </View>
  </View>
);
};

const styles = StyleSheet.create({
  container: { position: 'relative', width: '100%' },
  wrapper: { width: '100%', marginTop: 10 },
  fullSize: { width: '100%', height: '100%' },
  footer: { padding: 10 },
  footerTop: { justifyContent: 'space-between' },
  countText: { color: Colors.dark.text, marginHorizontal: 8 },
  dateText: { color: Colors.dark.text, fontSize: 12 },
  muteIcon: { width: 24, height: 24, tintColor: Colors.dark.text },
  video: { width: '100%', height: 600 },
  headerItem: { position: 'absolute', zIndex: 1, width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: Colors.light.transparent },
  rowContainer: { flexDirection: 'row', alignItems: 'center' },
  blockImg: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', marginRight: 10 },
  imgUser: { width: '100%', height: '100%' },
  textNormal: { fontSize: 14 },
  text: { fontSize: 12 },
  btnFollow: { paddingVertical: 6, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: Colors.light.transparent, borderWidth: 1, marginRight: 10 },
  iconBlock: { width: 24, height: 24 },
  icon: { width: '100%', height: '100%' },
  title: { marginVertical: 10, fontSize: 14 },
  muteButton: { position: 'absolute', bottom: 20, right: 20 },
  blockWhite: { width: '100%', height: 60, backgroundColor: Colors.light.transparent }
});

export default ItemHome;