import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const getUserId = async (): Promise<string> => {
  try {
    let id = await AsyncStorage.getItem('user_id');

    if (!id) {
      id = uuidv4();
      await AsyncStorage.setItem('user_id', id);
      console.log("🎯 새 userId 생성:", id);
    } else {
      console.log("✅ 기존 userId 로드:", id);
    }

    return id;
  } catch (error) {
    console.error("❌ userId 로딩 실패:", error);
    return ''; // 비어 있는 string을 리턴해서 앱 충돌 방지
  }
};
