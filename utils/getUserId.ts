// utils/getUserId.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

export const getUserId = async (): Promise<string> => {
  let id = await AsyncStorage.getItem('user_id');
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem('user_id', id);
  }
  return id;
};
