import { ConfigOption } from "../../components/BottomSheetOptions";
import { IntentionOptionConfig } from "../../components/BottomSheetIntentions";
import {
  Bookmark,
  Heart,
  Star,
  User,
  Info,
  EyeOff,
  Flag,
  Repeat,
} from 'lucide-react-native'
import { LucideProps } from 'lucide-react-native'

// Centralized icon imports
const icons = {
  bookmark: Bookmark,
  remix: Repeat,
  star: Star,
  unfollow: User,
  account: User,
  info: Info,
  blind: EyeOff,
  report: Flag,
};

// Top row of options
export const postTopOptions: Omit<ConfigOption, 'onPress'>[] = [
  { id: 'bookmark', icon: icons.bookmark, label: 'Lưu' },
  { id: 'remix',    icon: icons.remix,    label: 'Remix' },
];

// First vertical group
export const postFirstList: Omit<ConfigOption, 'onPress'>[] = [
  { id: 'favorite', icon: icons.star,    label: 'Thêm vào mục yêu thích' },
  { id: 'unfollow', icon: icons.unfollow,label: 'Bỏ theo dõi' },
];

// Second vertical group
export const postSecondList: Omit<ConfigOption, 'onPress'>[] = [
  { id: 'accountInfo', icon: icons.account, label: 'Giới thiệu về tài khoản này' },
  { id: 'whySee',      icon: icons.info,    label: 'Tại sao tôi thấy bài viết này ?' },
  { id: 'hide',        icon: icons.blind,   label: 'Ẩn' },
  { id: 'report',      icon: icons.report,  label: 'Báo cáo',    labelColor: '#FF0000' },
];

// Report sheet choices
export const reportChoices: IntentionOptionConfig[] = [
  { id: 'bullying',  label: 'Bắt nạt hoặc liên hệ theo cách không mong muốn' },
  { id: 'selfHarm',  label: 'Tự tử, tự gậy thương tích hoặc chứng rối loạn ăn uống' },
  { id: 'violence',  label: 'Bạo lực, thù ghét hoặc bóc lột' },
  { id: 'restricted',label: 'Bán hoặc quảng cáo mặt hàng bị hạn chế' },
  { id: 'nudity',    label: 'Ảnh khỏa thân hoặc hoạt động tình dục' },
  { id: 'spam',      label: 'Lừa đảo, gian lận hoặc spam' },
  { id: 'false',     label: 'Thông tin sai sự thật' },
  { id: 'copyright', label: 'Quyền sở hữu trí tuệ' },
];
