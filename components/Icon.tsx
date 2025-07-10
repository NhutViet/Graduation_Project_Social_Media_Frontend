import React from 'react';
import {Image, ImageSourcePropType, ImageStyle} from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  style?: ImageStyle;
  tintColor?: string;
}

const Icon: React.FC<IconProps> = ({name, size = 24, style, tintColor}) => {
  // Import tất cả icon từ thư mục assets/icon
  const iconMap: {[key: string]: ImageSourcePropType} = {
    // Account & User
    user: require('../assets/icon/user.png'),
    users: require('../assets/icon/users.png'),
    infor_user: require('../assets/icon/infor_user.png'),

    // Navigation
    home: require('../assets/icon/home.png'),
    search: require('../assets/icon/search.png'),
    post: require('../assets/icon/post.png'),
    reels: require('../assets/icon/reels.png'),
    story: require('../assets/icon/story.png'),

    // Actions
    add: require('../assets/icon/Plus.png'),
    close: require('../assets/icon/closer.png'),
    left: require('../assets/icon/left.png'),
    right: require('../assets/icon/right.png'),
    threedot: require('../assets/icon/threedot.png'),
    menu_dots: require('../assets/icon/menu-dots-vertical.png'),

    // Social
    heart: require('../assets/icon/heart.png'),
    heart_fill: require('../assets/icon/heart_fill.png'),
    heartred: require('../assets/icon/heartred.png'),
    bookmark_fill: require('../assets/icon/bookmark_fill.png'),
    share: require('../assets/icon/share.png'),
    reply: require('../assets/icon/reply.png'),
    repost: require('../assets/icon/repost.png'),

    // Communication
    message: require('../assets/icon/message.png'),
    newMessage: require('../assets/icon/newMessage.png'),
    new_mess: require('../assets/icon/new_mess.png'),
    star_mess: require('../assets/icon/star_mess.png'),
    group_chat: require('../assets/icon/group_chat.png'),

    // Media
    play: require('../assets/icon/play.png'),
    volume: require('../assets/icon/volume.png'),
    mute: require('../assets/icon/mute.png'),
    full_screen: require('../assets/icon/full_screen.png'),
    videoCamera: require('../assets/icon/videoCamera.png'),
    Picture: require('../assets/icon/Picture.png'),
    gallery: require('../assets/icon/gallery.png'),
    no_photo: require('../assets/icon/no_photo.png'),

    // Music
    music: require('../assets/icon/music.png'),
    musical_note: require('../assets/icon/musical-note.png'),
    equalizer: require('../assets/icon/equalizer.png'),
    spotify: require('../assets/icon/spotify.png'),

    // Settings & Tools
    setting: require('../assets/icon/setting.png'),
    setting_block: require('../assets/icon/setting-block.png'),
    theme: require('../assets/icon/theme.png'),
    sun: require('../assets/icon/sun.png'),
    lock: require('../assets/icon/lock.png'),
    eye: require('../assets/icon/eye.png'),
    eye_filled: require('../assets/icon/eye-filled.png'),
    eye_invisible: require('../assets/icon/eye-invisible-filled.png'),
    hide: require('../assets/icon/hide.png'),
    ellipsis: require('../assets/icon/ellipsis.png'),
    // Status
    success: require('../assets/icon/success.png'),
    danger: require('../assets/icon/danger.png'),
    problem: require('../assets/icon/problem.png'),
    no_comment: require('../assets/icon/no_comment.png'),
    no_notification: require('../assets/icon/no_notification.png'),

    // Features
    follow: require('../assets/icon/follow.png'),
    unfollow: require('../assets/icon/unfollow.png'),
    highlight: require('../assets/icon/highlight.png'),
    tag: require('../assets/icon/tag.png'),
    tagSO: require('../assets/icon/tagSO.png'),
    hash: require('../assets/icon/hash.png'),
    location: require('../assets/icon/location.png'),
    lightning: require('../assets/icon/lightning.png'),
    wall_clock: require('../assets/icon/wall-clock.png'),
    yourActivity: require('../assets/icon/yourActivity.png'),

    // Social Media
    gg: require('../assets/icon/gg.png'),

    // Other
    logo: require('../assets/icon/logo.png'),
    logo_row: require('../assets/icon/logo_row.png'),
    trash: require('../assets/icon/trash.png'),
    star: require('../assets/icon/star.png'),
    square: require('../assets/icon/square.png'),
    grid: require('../assets/icon/grid.png'),
    layers: require('../assets/icon/layers.png'),
    sequence: require('../assets/icon/sequence.png'),
    icon_sort: require('../assets/icon/icon_sort.png'),
    icon_tinder: require('../assets/icon/icon_tinder.png'),
    iconAndYou: require('../assets/icon/iconAndYou.png'),

    // Actions
    upload: require('../assets/icon/upload.png'),
    download: require('../assets/icon/upload.png'), // Using upload as download
    edit: require('../assets/icon/setting.png'), // Using setting as edit
    delete: require('../assets/icon/trash.png'),
    report: require('../assets/icon/report.png'),
    translation: require('../assets/icon/translation.png'),
    polling: require('../assets/icon/polling.png'),
    sticker: require('../assets/icon/sticker.png'),
    smiley: require('../assets/icon/smiley.png'),
    remix: require('../assets/icon/remix.png'),
    remix_reels: require('../assets/icon/remix_reels.png'),

    // Communication
    telephone: require('../assets/icon/telephone.png'),
    phone: require('../assets/icon/phone.png'),
    mail: require('../assets/icon/mail.png'),
    link: require('../assets/icon/link.png'),
    qr: require('../assets/icon/qr.png'),
    qrlink: require('../assets/icon/qrlink.png'),

    // Features
    Microphone: require('../assets/icon/Microphone.png'),
    invite: require('../assets/icon/invite.png'),
    seperator_or: require('../assets/icon/seperator_or.png'),
    myPost: require('../assets/icon/myPost.png'),
    nickname: require('../assets/icon/nickname.png'),

    // Default fallback
  };

  const iconSource = iconMap[name] || iconMap.default;

  return (
    <Image
      source={iconSource}
      style={[
        {
          width: size,
          height: size,
          tintColor: tintColor,
        },
        style,
      ]}
      resizeMode="contain"
    />
  );
};

export default Icon;
