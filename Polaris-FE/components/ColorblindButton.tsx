import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import useTheme from '@/hooks/useTheme';
import { CustomTheme, themes } from '@/utils/themeOptions';
import { Theme } from '@react-navigation/native';

interface ThemeOptionProps {
  themeKey: string;
  label: string;
  icon: string;
  onSelect: (theme: Theme) => void;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  themeKey,
  label,
  icon,
  onSelect,
}) => (
  <TouchableOpacity
    style={styles.optionButton}
    onPress={() => onSelect(themes[themeKey])}
  >
    <Text style={styles.optionText}>
      {icon} {label}
    </Text>
  </TouchableOpacity>
);

export function ColorblindButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const { setTheme } = useTheme();

  const toggleModal = () => setModalVisible(!modalVisible);

  const themeOptions = [
    { key: 'default', label: 'Default', icon: '🟠' },
    { key: 'deuteranopia', label: 'Deuteranopia (Red-Green)', icon: '🟢' },
    { key: 'protanopia', label: 'Protanopia (Red-Green)', icon: '🔴' },
    { key: 'tritanopia', label: 'Tritanopia (Blue-Yellow)', icon: '🔵' },
  ];

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
            {themeOptions.map(({ key, label, icon }) => (
              <ThemeOption
                key={key}
                themeKey={key}
                label={label}
                icon={icon}
                onSelect={(theme: CustomTheme) => {
                  setTheme(theme);
                  toggleModal();
                }}
              />
            ))}
            <TouchableOpacity
              style={[styles.optionButton, styles.cancelButton]}
              onPress={toggleModal}
            >
              <Text style={[styles.optionText, styles.cancelText]}>Cancel</Text>
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
  cancelButton: {
    backgroundColor: 'black',
  },
  cancelText: {
    color: 'white',
  },
});
