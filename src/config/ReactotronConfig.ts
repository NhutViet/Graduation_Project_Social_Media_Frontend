import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

// 👇 Fix lỗi console.tron
declare global {
  interface Console {
    tron: any;
  }
}

const reactotron = Reactotron.configure({name: 'MyApp', host: '192.168.1.4'}) // 👈 tên hiển thị trong app Reactotron
  .useReactNative({
    networking: {ignoreUrls: /symbolicate/},
    asyncStorage: true,
  })
  .use(reactotronRedux())
  .connect();

console.tron = reactotron;

export default reactotron;
