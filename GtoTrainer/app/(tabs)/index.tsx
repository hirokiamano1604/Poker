import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  StatusBar,
} from 'react-native';
import { ALL_HAND_RANGES, PositionID, ActionType, RangeEntry } from '../../constants/pokerData';
import { evaluateAction } from '../../utils/gameLogic';

const POSITIONS: PositionID[] = ['UTG', 'EP', 'LJ', 'HJ', 'CO', 'BTN'];

export default function GtoTrainerScreen() {
  // --- State ---
  const [currentPosition, setCurrentPosition] = useState<PositionID>('UTG');
  const [currentHandEntry, setCurrentHandEntry] = useState<RangeEntry | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [lastResultCorrect, setLastResultCorrect] = useState<boolean | null>(null); // null=none, true=green, false=red

  // --- Initial Load & Game Loop ---
  useEffect(() => {
    generateNewHand();
  }, []);

  const generateNewHand = () => {
    const randomIndex = Math.floor(Math.random() * ALL_HAND_RANGES.length);
    setCurrentHandEntry(ALL_HAND_RANGES[randomIndex]);
    setFeedbackMessage(' '); // Clear message but keep layout space
    setLastResultCorrect(null);
    setIsProcessing(false);
  };

  // --- Interaction ---
  const handleAction = (action: ActionType) => {
    if (isProcessing || !currentHandEntry) return;

    const result = evaluateAction(currentPosition, currentHandEntry.rank, action);
    
    setFeedbackMessage(result.message);
    setLastResultCorrect(result.isCorrect);
    setIsProcessing(true);

    if (result.isCorrect) {
      // Auto-advance after 1 second
      setTimeout(() => {
        generateNewHand();
      }, 1000);
    } else {
      // User must tap to continue or specific "Next" button logic.
      // For this strict trainer, we'll auto-advance after a slightly longer delay 
      // OR let them tap the hand/screen to reset. 
      // Let's implement: "Tap Next" button appears or auto-advance after 2s?
      // Design Doc says: provide a "Next" button (or wait for tap).
      // We will implement "Tap anywhere to continue" logic by keeping isProcessing true until user triggers next.
    }
  };

  const handleNext = () => {
    if (isProcessing) {
      generateNewHand();
    }
  };

  // --- Render Helpers ---
  const getFeedbackColor = () => {
    if (lastResultCorrect === true) return '#4caf50'; // Green
    if (lastResultCorrect === false) return '#f44336'; // Red
    return 'transparent';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* --- Header --- */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>GTO Trainer</Text>
        <TouchableOpacity style={styles.chartButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.chartButtonText}>📊 Chart</Text>
        </TouchableOpacity>
      </View>

      {/* --- Position Selector --- */}
      <View style={styles.positionContainer}>
        {POSITIONS.map((pos) => (
          <TouchableOpacity
            key={pos}
            style={[
              styles.posButton,
              currentPosition === pos && styles.posButtonSelected,
            ]}
            onPress={() => {
                setCurrentPosition(pos);
                generateNewHand(); // Optional: reset hand when pos changes
            }}
          >
            <Text
              style={[
                styles.posText,
                currentPosition === pos && styles.posTextSelected,
              ]}
            >
              {pos}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* --- Game Board --- */}
      <View style={styles.boardContainer}>
        {currentHandEntry ? (
          <Text style={styles.handText}>{currentHandEntry.hand}</Text>
        ) : (
          <Text style={styles.handText}>Loading...</Text>
        )}

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

      {/* --- Action Buttons --- */}
      <View style={styles.actionsContainer}>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#d32f2f' }]} // Red/Grayish
            onPress={() => handleAction('Fold')}
          >
            <Text style={styles.actionBtnText}>Fold</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#ffa000' }]} // Yellow/Orange
            onPress={() => handleAction('Call')}
          >
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#388e3c' }]} // Green
            onPress={() => handleAction('Open')}
          >
            <Text style={styles.actionBtnText}>Open</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#7b1fa2' }]} // Purple/Blue
            onPress={() => handleAction('Raise')}
          >
            <Text style={styles.actionBtnText}>Raise</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- Chart Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../assets/images/table.jpg')}
              style={styles.chartImage}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  chartButton: {
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 8,
  },
  chartButtonText: {
    color: '#4fc3f7',
    fontWeight: '600',
  },
  positionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#252525',
  },
  posButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444',
  },
  posButtonSelected: {
    backgroundColor: '#4fc3f7',
    borderColor: '#4fc3f7',
  },
  posText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 12,
  },
  posTextSelected: {
    color: '#000',
  },
  boardContainer: {
    flex: 1, // Takes up remaining space
    justifyContent: 'center',
    alignItems: 'center',
  },
  handText: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 20,
  },
  feedbackContainer: {
    height: 80, // Fixed height to prevent jumpiness
    alignItems: 'center',
  },
  feedbackText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#444',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  actionsContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  actionBtn: {
    width: '48%',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    height: '80%',
    backgroundColor: '#000',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  chartImage: {
    width: '100%',
    height: '85%',
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});