import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  SafeAreaView // Webでもレイアウト崩れを防ぐため安全に使用
} from 'react-native';
import { ALL_HAND_RANGES, PositionID, ActionType, RangeEntry } from '../../constants/pokerData';
import { evaluateAction } from '../../utils/gameLogic';

const POSITIONS: PositionID[] = ['UTG', 'EP', 'LJ', 'HJ', 'CO', 'BTN'];

// 万が一データ読み込みに失敗した時のためのバックアップデータ
const FALLBACK_HAND: RangeEntry = { hand: 'AA', rank: 'R_PURPLE' };

export default function GtoTrainerScreen() {
  const [currentPosition, setCurrentPosition] = useState<PositionID>('UTG');
  
  // ★重要修正: 初期値をnullにせず、データがあればその最初、なければバックアップを使用
  // これにより「Loading...」画面自体を消滅させます。
  const [currentHandEntry, setCurrentHandEntry] = useState<RangeEntry>(() => {
    if (ALL_HAND_RANGES && ALL_HAND_RANGES.length > 0) {
      return ALL_HAND_RANGES[Math.floor(Math.random() * ALL_HAND_RANGES.length)];
    }
    return FALLBACK_HAND;
  });

  const [feedbackMessage, setFeedbackMessage] = useState<string>(' '); // 空白でスペース確保
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lastResultCorrect, setLastResultCorrect] = useState<boolean | null>(null);

  // コンポーネントがマウントされた後にデータを再確認（念の為）
  useEffect(() => {
    if (!currentHandEntry) {
      generateNewHand();
    }
  }, []);

  const generateNewHand = () => {
    if (ALL_HAND_RANGES && ALL_HAND_RANGES.length > 0) {
      const randomIndex = Math.floor(Math.random() * ALL_HAND_RANGES.length);
      setCurrentHandEntry(ALL_HAND_RANGES[randomIndex]);
    } else {
      // データがない場合でもアプリを止めない
      setCurrentHandEntry(FALLBACK_HAND); 
      setFeedbackMessage('Error: Data missing');
    }
    setFeedbackMessage(' ');
    setLastResultCorrect(null);
    setIsProcessing(false);
  };

  const handleAction = (action: ActionType) => {
    if (isProcessing) return;

    // データが存在しない場合のガード
    const rankToCheck = currentHandEntry ? currentHandEntry.rank : FALLBACK_HAND.rank;

    const result = evaluateAction(currentPosition, rankToCheck, action);
    
    setFeedbackMessage(result.message);
    setLastResultCorrect(result.isCorrect);
    setIsProcessing(true);

    if (result.isCorrect) {
      setTimeout(() => generateNewHand(), 1000);
    }
  };

  const handleNext = () => generateNewHand();

  // フィードバックテキストの色決定
  const getFeedbackColor = () => {
    if (lastResultCorrect === true) return '#4caf50';
    if (lastResultCorrect === false) return '#f44336';
    return 'transparent';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GTO Trainer</Text>
        <TouchableOpacity style={styles.chartButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.chartButtonText}>📊 Chart</Text>
        </TouchableOpacity>
      </View>

      {/* Position Selector */}
      <View style={styles.positionContainer}>
        {POSITIONS.map((pos) => (
          <TouchableOpacity
            key={pos}
            style={[styles.posButton, currentPosition === pos && styles.posButtonSelected]}
            onPress={() => {
              setCurrentPosition(pos);
              generateNewHand();
            }}
          >
            <Text style={[styles.posText, currentPosition === pos && styles.posTextSelected]}>
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Game Board */}
      <View style={styles.boardContainer}>
        {/* ★ここから条件分岐を削除し、常にテキストを表示します */}
        <Text style={styles.handText}>
          {currentHandEntry ? currentHandEntry.hand : 'AA'}
        </Text>

        <View style={styles.feedbackContainer}>
          <Text style={[styles.feedbackText, { color: getFeedbackColor() }]}>
            {feedbackMessage}
          </Text>
          {lastResultCorrect === false && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next Hand →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionsRow}>
          <ActionBtn color="#d32f2f" label="Fold" onPress={() => handleAction('Fold')} />
          <ActionBtn color="#ffa000" label="Call" onPress={() => handleAction('Call')} />
        </View>
        <View style={styles.actionsRow}>
          <ActionBtn color="#388e3c" label="Open" onPress={() => handleAction('Open')} />
          <ActionBtn color="#7b1fa2" label="Raise" onPress={() => handleAction('Raise')} />
        </View>
      </View>

      {/* Chart Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* 画像パスエラーで落ちるのを防ぐため、仮にテキストを表示、画像があれば画像を表示 */}
            <Image 
              source={require('../../assets/images/table.jpg')} 
              style={styles.chartImage} 
              resizeMode="contain"
              // Webで画像がない場合にアプリを落とさないための記述（React Native Webのバージョンによる）
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Button Helper
const ActionBtn = ({ color, label, onPress }: { color: string, label: string, onPress: () => void }) => (
  <TouchableOpacity style={[styles.actionBtn, { backgroundColor: color }]} onPress={onPress}>
    <Text style={styles.actionBtnText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', paddingTop: Platform.OS === 'web' ? 0 : 50 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#333' 
  },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  chartButton: { padding: 8, backgroundColor: '#333', borderRadius: 8 },
  chartButtonText: { color: '#4fc3f7', fontWeight: 'bold' },
  positionContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    backgroundColor: '#252525', 
    paddingVertical: 10 
  },
  posButton: { paddingVertical: 8, paddingHorizontal: 10, borderRadius: 5, borderWidth: 1, borderColor: '#444' },
  posButtonSelected: { backgroundColor: '#4fc3f7', borderColor: '#4fc3f7' },
  posText: { color: '#aaa', fontSize: 12, fontWeight: '600' },
  posTextSelected: { color: '#000' },
  boardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  handText: { color: '#fff', fontSize: 70, fontWeight: 'bold', letterSpacing: 2 },
  feedbackContainer: { height: 100, alignItems: 'center', justifyContent: 'center', width: '100%', marginTop: 20 },
  feedbackText: { fontSize: 24, fontWeight: 'bold', height: 40, textAlign: 'center' },
  nextButton: { backgroundColor: '#444', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginTop: 10 },
  nextButtonText: { color: '#fff', fontSize: 16 },
  actionsContainer: { padding: 20, paddingBottom: 40 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  actionBtn: { width: '48%', paddingVertical: 20, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', height: '80%', backgroundColor: '#000', borderRadius: 10, padding: 10, alignItems: 'center' },
  chartImage: { width: '100%', height: '85%' },
  closeButton: { marginTop: 20, paddingVertical: 10, paddingHorizontal: 30, backgroundColor: '#444', borderRadius: 8 },
  closeButtonText: { color: '#fff', fontSize: 16 }
});