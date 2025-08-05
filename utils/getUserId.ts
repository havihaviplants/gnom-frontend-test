import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const getUserId = async (): Promise<string> => {
  try {
    let id = await AsyncStorage.getItem('user_id');

    if (!id || typeof id !== 'string' || id.length < 10) {
      const newId = uuidv4();
      console.log('🎯 새 userId 생성:', newId);
      await AsyncStorage.setItem('user_id', newId);
      return newId;
    }

    console.log('✅ 기존 userId 로드:', id);
    return id;
  } catch (error) {
    console.error('❌ userId 로딩 실패:', error);
    return ''; // 이 경우에도 분석 요청은 막힘
  }
};
