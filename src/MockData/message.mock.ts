export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  img: string;
  name: string;
  description: string;
  isGroup?: boolean;
  messages: Message[];
}

export interface StoryUser {
  id: number;
  name: string;
  image: string;
  status: number;
}

// current user (id: 0)
export const currentUser: User = {
  id: '0',
  img: 'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
  name: 'mimi11_o',
  description: 'You',
  messages: []
};

// mock message data 
export const messageData: User[] = [
  {
    id: '1',
    img: 'https://i.pinimg.com/736x/78/63/88/78638889824ef2f367cf2b40c63a860b.jpg',
    name: 'User 1',
    description: 'Active 2 minutes ago',
    messages: [
      { id: 'm1', senderId: '1', text: 'Hey there! How are you doing today?', timestamp: 'Mar 28' },
      { id: 'm2', senderId: '0', text: 'I\'m doing great, thanks for asking! How about you?', timestamp: 'Mar 28' },
      { id: 'm3', senderId: '1', text: 'Pretty good! Just finished work and thinking about dinner plans', timestamp: 'Mar 28' },
      { id: 'm4', senderId: '0', text: 'Nice! What are you thinking of making?', timestamp: 'Mar 28' },
      { id: 'm5', senderId: '1', text: 'Maybe some pasta with garlic bread', timestamp: 'Mar 28' }
    ]
  },
  {
    id: '2',
    img: 'https://i.pinimg.com/736x/65/98/6e/65986e43f1d5e157dd31b26ee1343508.jpg',
    name: 'Team Chat',
    description: 'Active 3 hours ago',
    isGroup: true,
    messages: [
      { id: 'm6', senderId: '2', text: 'Good morning everyone! Ready for today\'s meeting?', timestamp: 'Mar 27' },
      { id: 'm7', senderId: '0', text: 'Morning! Yes, I have all the documents prepared', timestamp: 'Mar 27' },
      { id: 'm8', senderId: '3', text: 'Same here, looking forward to the presentation', timestamp: 'Mar 27' },
      { id: 'm9', senderId: '2', text: 'Perfect! The meeting room is booked for 10 AM', timestamp: 'Mar 27' },
      { id: 'm10', senderId: '0', text: 'Great, I\'ll be there on time', timestamp: 'Mar 27' },
      { id: 'm11', senderId: '4', text: 'Can we also discuss the budget for next quarter?', timestamp: 'Mar 27' }
    ]
  },
  {
    id: '3',
    img: 'https://i.pinimg.com/736x/bf/d9/56/bfd9563b5a7277df5ca476b4e90a06cb.jpg',
    name: 'User 3',
    description: 'Active 5 hours ago',
    messages: [
      { id: 'm12', senderId: '3', text: 'Did you see the latest movie that came out?', timestamp: 'Mar 26' },
      { id: 'm13', senderId: '0', text: 'Which one are you talking about?', timestamp: 'Mar 26' },
      { id: 'm14', senderId: '3', text: 'The new action thriller with Tom Cruise', timestamp: 'Mar 26' },
      { id: 'm15', senderId: '0', text: 'Oh yes! I heard it has amazing stunts', timestamp: 'Mar 26' },
      { id: 'm16', senderId: '3', text: 'Exactly! Want to go watch it this weekend?', timestamp: 'Mar 26' }
    ]
  },
  {
    id: '4',
    img: 'https://i.pinimg.com/736x/08/ee/45/08ee454cf166587337c5e85f7a4c5c27.jpg',
    name: 'User 4',
    description: 'Active 10 minutes ago',
    messages: [
      { id: 'm17', senderId: '4', text: 'Thanks for helping me with the project yesterday', timestamp: 'Mar 25' },
      { id: 'm18', senderId: '0', text: 'No problem at all! Happy to help', timestamp: 'Mar 25' },
      { id: 'm19', senderId: '4', text: 'I really appreciate it. The client loved the final result', timestamp: 'Mar 25' },
      { id: 'm20', senderId: '0', text: 'That\'s fantastic news! Great teamwork', timestamp: 'Mar 25' },
      { id: 'm21', senderId: '4', text: 'Definitely! Let\'s celebrate with lunch tomorrow?', timestamp: 'Mar 25' }
    ]
  },
  {
    id: '5',
    img: 'https://i.pinimg.com/736x/98/70/5f/98705fd420414eaba0f0c50416a46fef.jpg',
    name: 'User 5',
    description: 'Active 3 hours ago',
    messages: [
      { id: 'm22', senderId: '5', text: 'Good morning! How was your vacation?', timestamp: 'Mar 24' },
      { id: 'm23', senderId: '0', text: 'It was amazing! Visited so many beautiful places', timestamp: 'Mar 24' },
      { id: 'm24', senderId: '5', text: 'That sounds wonderful! Did you take lots of photos?', timestamp: 'Mar 24' },
      { id: 'm25', senderId: '0', text: 'Yes, hundreds! I\'ll share some with you later', timestamp: 'Mar 24' },
      { id: 'm26', senderId: '5', text: 'Can\'t wait to see them!', timestamp: 'Mar 24' }
    ]
  },
  {
    id: '6',
    img: 'https://i.pinimg.com/736x/13/b2/17/13b21765f93fbdda132c3f056826e203.jpg',
    name: 'User 6',
    description: 'Active 1 day ago',
    messages: [
      { id: 'm27', senderId: '6', text: 'Are you free for a quick call today?', timestamp: 'Mar 23' },
      { id: 'm28', senderId: '0', text: 'Sure! What time works for you?', timestamp: 'Mar 23' },
      { id: 'm29', senderId: '6', text: 'How about 3 PM? I have some ideas to discuss', timestamp: 'Mar 23' },
      { id: 'm30', senderId: '0', text: 'Perfect! I\'ll be ready at 3 PM', timestamp: 'Mar 23' },
      { id: 'm31', senderId: '6', text: 'Great! Talk to you then', timestamp: 'Mar 23' }
    ]
  },
  {
    id: '7',
    img: 'https://i.pinimg.com/736x/8c/7a/b6/8c7ab636cfd256e220a1baf76ac06d4c.jpg',
    name: 'User 7',
    description: 'Active 30 minutes ago',
    messages: [
      { id: 'm32', senderId: '7', text: 'Hey! Want to grab coffee later?', timestamp: 'Mar 22' },
      { id: 'm33', senderId: '0', text: 'Sounds good! What time and where?', timestamp: 'Mar 22' },
      { id: 'm34', senderId: '7', text: 'How about 4 PM at the usual cafe?', timestamp: 'Mar 22' },
      { id: 'm35', senderId: '0', text: 'Perfect! See you there', timestamp: 'Mar 22' },
      { id: 'm36', senderId: '7', text: 'Looking forward to it!', timestamp: 'Mar 22' }
    ]
  },
  {
    id: '8',
    img: 'https://i.pinimg.com/736x/8c/7a/b6/8c7ab636cfd256e220a1baf76ac06d4c.jpg',
    name: 'Study Group',
    description: 'Active 45 minutes ago',
    isGroup: true,
    messages: [
      { id: 'm37', senderId: '8', text: 'Don\'t forget about tomorrow\'s exam!', timestamp: 'Mar 21' },
      { id: 'm38', senderId: '0', text: 'Thanks for the reminder! I\'ve been studying all week', timestamp: 'Mar 21' },
      { id: 'm39', senderId: '9', text: 'Same here, feeling pretty confident about it', timestamp: 'Mar 21' },
      { id: 'm40', senderId: '8', text: 'That\'s great! Let\'s do a quick review session tonight?', timestamp: 'Mar 21' },
      { id: 'm41', senderId: '0', text: 'Count me in! What time?', timestamp: 'Mar 21' },
      { id: 'm42', senderId: '9', text: '7 PM at the library works for me', timestamp: 'Mar 21' }
    ]
  }
];

// story users data
export const storyUsers: StoryUser[] = [
  {
    id: 1,
    name: 'user1',
    image: 'https://i.pinimg.com/736x/b7/25/61/b72561fd1ec7018c0418c84a3c2d5a57.jpg',
    status: 1,
  },
  {
    id: 2,
    name: 'user2',
    image: 'https://i.pinimg.com/736x/c1/70/e8/c170e84663405785c80ba367cd5e3b85.jpg',
    status: 1,
  },
  {
    id: 3,
    name: 'user3',
    image: 'https://i.pinimg.com/736x/8b/ae/77/8bae77c63f046f5a307a864a9d230da2.jpg',
    status: 0,
  },
  {
    id: 4,
    name: 'user4',
    image: 'https://i.pinimg.com/736x/56/81/64/5681646985e7ddc1b2cd4b826763b541.jpg',
    status: 0,
  },
];

// helper functions for demonstrative purposes
export const getAllMessages = (): Message[] => {
  return messageData.reduce((allMessages, user) => {
    return [...allMessages, ...user.messages];
  }, [] as Message[]);
};

export const searchMessages = (query: string): {user: User, message: Message}[] => {
  if (!query.trim()) return [];
  
  const results: {user: User, message: Message}[] = [];
  const keywords = query.toLowerCase().split(' ').filter(word => word.length > 0);
  
  messageData.forEach(user => {
    user.messages.forEach(message => {
      const messageText = message.text.toLowerCase();
      
      // check if all keywords are present in the message
      const allKeywordsFound = keywords.every(keyword => 
        messageText.includes(keyword)
      );
      
      if (allKeywordsFound) {
        results.push({ user, message });
      }
    });
  });
  
  return results;
};

export const getUserById = (userId: string): User | undefined => {
  if (userId === '0') return currentUser;
  return messageData.find(user => user.id === userId);
};