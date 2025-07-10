import {
  Bookmark,
  Sparkles,
  Star,
  UserMinus,
  UserPlus,
  User2,
  EyeOff,
  Flag,
  Info,
} from 'lucide-react-native';
import {IntentionOptionConfig} from 'src/(tabs)/Home/components/BottomSheetIntentionsModal';
import {ConfigOption} from 'src/(tabs)/Home/components/BottomSheetOptionsModal';

export const icons = {
  bookmark: Bookmark,
  remix: Sparkles,
  star: Star,
  follow: UserPlus,
  unfollow: UserMinus,
  account: User2,
  info: Info,
  blind: EyeOff,
  report: Flag,
};

export const postTopOptions: Omit<ConfigOption, 'onPress'>[] = [
  {id: 'bookmark', icon: Bookmark, label: 'Lưu'},
];

export const postFirstList: Omit<ConfigOption, 'onPress'>[] = [
  {id: 'unfollow', icon: UserMinus, label: 'Bỏ theo dõi'},
];

export const postSecondList: Omit<ConfigOption, 'onPress'>[] = [
  {
    id: 'accountInfo',
    icon: User2,
    label: 'Giới thiệu về tài khoản này',
  },
  {id: 'whySee', icon: Info, label: 'Tại sao tôi thấy bài viết này ?'},
  {id: 'hide', icon: EyeOff, label: 'Ẩn'},
  {id: 'report', icon: Flag, label: 'Báo cáo', labelColor: '#FF0000'},
];

export const reportChoices: IntentionOptionConfig[] = [
  {id: 'bullying', label: 'Bắt nạt hoặc liên hệ theo cách không mong muốn'},
  {
    id: 'selfHarm',
    label: 'Tự tử, tự gây thương tích hoặc chứng rối loạn ăn uống',
  },
  {id: 'violence', label: 'Bạo lực, thù ghét hoặc bóc lột'},
  {id: 'restricted', label: 'Bán hoặc quảng cáo mặt hàng bị hạn chế'},
  {id: 'nudity', label: 'Ảnh khỏa thân hoặc hoạt động tình dục'},
  {id: 'spam', label: 'Lừa đảo, gian lận hoặc spam'},
  {id: 'false', label: 'Thông tin sai sự thật'},
  {id: 'copyright', label: 'Quyền sở hữu trí tuệ'},
];
