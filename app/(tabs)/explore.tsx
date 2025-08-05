import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import React, { useEffect, useState } from 'react';
import { Alert, Button, Share, TextInput } from 'react-native';
// @ts-ignore

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { getUserId } from '@/utils/getUserId';

export default function TabTwoScreen() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [message, setMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // UUID 로딩
  useEffect(() => {
    (async () => {
      const id = await getUserId();
      setUserId(id);
    })();
  }, []);

  

  // 광고 보고 해제
  const showRewardedAdAndUnlock = () => {
    setIsUnlocked(true); // 광고 없이 바로 해제
    };


  const callAnalysisAPI = async () => {
    if (!userId) return;
    if (!isUnlocked) {
      Alert.alert('해제 필요', '광고를 보고 감정 분석을 해제하세요.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post('https://gnom-backend.onrender.com/analyze', {
        user_id: userId,
        message: message || '나는 너에게 실망했어',
        relationship: '전 연인',
      });
      setAnalysisResult(response.data.summary || '결과 없음');
    } catch (error) {
      Alert.alert('분석 실패', '네트워크 또는 서버 오류입니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (resultData: any) => {
    try {
      const response = await axios.post('https://gnom-backend.onrender.com/share', {
        ...resultData,
        user_id: userId,
      });
      const shareUrl = response.data.share_url;

      await Share.share({ message: `상대 감정 분석 결과 👉 ${shareUrl}` });
      await Clipboard.setStringAsync(shareUrl);
      Alert.alert('공유 링크가 복사되었어요!');
    } catch (err) {
      Alert.alert('공유에 실패했어요');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
        />
      }
    >
      <ThemedView style={{ padding: 16 }}>
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="감정을 입력해 주세요"
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 12 }}
        />

        {!isUnlocked && (
          <ThemedView style={{ padding: 16, backgroundColor: '#f2f2f2', borderRadius: 8, marginBottom: 12 }}>
            <ThemedText style={{ textAlign: 'center', marginBottom: 8 }}>
              🔒 분석 결과를 보려면 광고를 시청해 주세요
            </ThemedText>
            <Button title="해제하기" onPress={showRewardedAdAndUnlock} />
          </ThemedView>
        )}

        <Button
          title="분석하기"
          onPress={callAnalysisAPI}
          disabled={!isUnlocked || isLoading}
        />


        {isLoading && <ThemedText style={{ marginTop: 12 }}>분석 중...</ThemedText>}

        {isUnlocked && analysisResult && (
          <ThemedView style={{ marginTop: 16 }}>
            <ThemedText style={{ fontSize: 16, marginBottom: 8 }}>{analysisResult}</ThemedText>
            <Button title="결과 공유하기" onPress={() => handleShare({ result: analysisResult })} />
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}
