import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

/**
 * A self-contained button that opens a modal to select colorblind modes.
 * All logic & state are inside this component.
 */
export function ColorblindButton() {
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={toggleModal}>
        <Text style={styles.buttonText}>🎨 Mode</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={toggleModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Colorblind Mode</Text>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                console.log('Deuteranopia selected');
                toggleModal();
              }}
            >
              <Text style={styles.optionText}>🟢 Deuteranopia (Red-Green)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                console.log('Protanopia selected');
                toggleModal();
              }}
            >
              <Text style={styles.optionText}>🔴 Protanopia (Red-Green)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                console.log('Tritanopia selected');
                toggleModal();
              }}
            >
              <Text style={styles.optionText}>🔵 Tritanopia (Blue-Yellow)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { backgroundColor: 'black' }]}
              onPress={toggleModal}
            >
              <Text style={[styles.optionText, { color: 'white' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'rgba(34, 34, 34, 0.992)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionButton: {
    backgroundColor: '#8E8E8E',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    color: 'white',
  },
});
