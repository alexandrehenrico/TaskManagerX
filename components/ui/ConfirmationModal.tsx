import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { Button } from './Button';

interface ConfirmationModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  title,
  message,
  confirmText,
  onConfirm,
  onCancel,
  destructive = false,
}) => {
  const [inputText, setInputText] = useState('');

  const handleConfirm = () => {
    if (inputText.toLowerCase() === confirmText.toLowerCase()) {
      onConfirm();
      setInputText('');
    } else {
      Alert.alert('Erro', `Digite "${confirmText}" para confirmar.`);
    }
  };

  const handleCancel = () => {
    setInputText('');
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Button
              title=""
              onPress={handleCancel}
              variant="secondary"
              size="small"
              style={styles.closeButton}
              textStyle={styles.closeButtonText}
            />
          </View>

          <Text style={styles.message}>{message}</Text>

          <View style={styles.confirmationSection}>
            <Text style={styles.confirmationLabel}>
              Digite "<Text style={styles.confirmationText}>{confirmText}</Text>" para confirmar:
            </Text>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Digite "${confirmText}"`}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.actions}>
            <Button
              title="Cancelar"
              onPress={handleCancel}
              variant="secondary"
              style={styles.actionButton}
            />
            <Button
              title="Confirmar"
              onPress={handleConfirm}
              variant={destructive ? "danger" : "primary"}
              disabled={inputText.toLowerCase() !== confirmText.toLowerCase()}
              style={styles.actionButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    padding: 0,
    marginLeft: 16,
  },
  closeButtonText: {
    fontSize: 18,
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 24,
  },
  confirmationSection: {
    marginBottom: 24,
  },
  confirmationLabel: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  confirmationText: {
    fontWeight: '600',
    color: '#DC2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});