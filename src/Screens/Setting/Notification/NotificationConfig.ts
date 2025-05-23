// configuration for notification option screens. bascially the reusing the same screen for details of each option in Notificaion/index.tsx
export interface NotificationOptionConfig {
  sectionTitle: string;
  choices: string[];
  subText: string;
}

export const notificationOptions: { [key: string]: NotificationOptionConfig } = {
  'Calls': {
    sectionTitle: 'Video Chats',
    choices: ['Off', 'From profiles I follow', 'From everyone'],
    subText: 'Incoming video chat from @sneeds.'
  },
  'Birthdays': {
    sectionTitle: 'Birthdays',
    choices: ['Off', 'On'],
    subText: '@sneeds has a birthday today!\n\nWe\'ll only notify you for people who choose to tell others about their birthdays on our app. You can change who to tell about your birthday any time in your profile Personal Information settings.'
  },
  'Following and followers': {
    sectionTitle: 'Follower requests',
    choices: ['On', 'Off', 'All people can follow me'],
    subText: '@sneeds has sent you a follower request. check them out now!'
  }
};