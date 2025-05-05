import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const numColumns = 3;
const tileSize = width / numColumns;
// Tính toán kích thước cho grid item
export const itemSize = width / 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 12,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
  },
  bioSection: {
    marginTop: 15,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  bioText: {
    fontSize: 14,
    marginTop: 5,
  },
  bioLink: {
    fontSize: 14,
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  shareButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // Styles cho phần highlight stories
  highlightContainer: {
    marginTop: 15,
    marginBottom: 10,
  },
  highlightScroll: {
    paddingHorizontal: 15,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  highlightImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: '#dbdbdb',
  },
  highlightText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },

  // Styles cho tab navigation
  tabContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#dbdbdb',
    marginTop: 15,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  // Styles cho grid posts
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  postItem: {
    width: tileSize,
    height: tileSize,
    padding: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  // Styles cho bottom navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#dbdbdb',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    width: 24,
    height: 24,
  },
  postsSection: {
    marginTop: 10,
  },
  tabButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#DBDBDB',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderTopWidth: 1,
    borderTopColor: '#262626',
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
});

export default styles;
