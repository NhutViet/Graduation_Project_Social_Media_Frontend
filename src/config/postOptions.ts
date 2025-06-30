import { ConfigOption } from "../../components/BottomSheetOptions";
import { IntentionOptionConfig } from "../../components/BottomSheetIntentions";

// Centralized icon imports
export const icons = {
  bookmark: require("../../assets/icon/bookmark.png"),
  remix: require("../../assets/icon/remix.png"),
  star: require("../../assets/icon/star.png"),
  follow: require('../../assets/icon/follow.png'),
  unfollow: require("../../assets/icon/unfollow.png"),
  account: require("../../assets/icon/account.png"),
  info: require("../../assets/icon/info.png"),
  blind: require("../../assets/icon/blind.png"),
  report: require("../../assets/icon/problem.png"),
};

// Top row of options
export const postTopOptions: Omit<ConfigOption, 'onPress'>[] = [
  { id: 'bookmark', icon: icons.bookmark, label: 'Lưu' },
];

// First vertical group
export const postFirstList: Omit<ConfigOption, 'onPress'>[] = [
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
