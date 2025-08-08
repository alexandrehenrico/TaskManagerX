import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SquareCheck as CheckSquare, Calendar, User, Bell } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Activity, ActivityStatus } from '@/types/app';
import { generateId, createActivityHistoryEntry } from '@/utils';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ActivityFormScreen() {
  const { people, activities, addActivity, updateActivity } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!id;
  const existingActivity = isEditing ? activities.find(a => a.id === id) : null;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    personId: '',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date().toISOString().split('T')[0],
    reminderEnabled: true,
  });

  const [selectedPerson, setSelectedPerson] = useState<string>('');

  useEffect(() => {
    if (existingActivity) {
      setFormData({
        title: existingActivity.title,
        description: existingActivity.description,
        personId: existingActivity.personId,
        startDate: new Date(existingActivity.startDate).toISOString().split('T')[0],
        deadline: new Date(existingActivity.deadline).toISOString().split('T')[0],
        reminderEnabled: existingActivity.reminderEnabled,
      });
      setSelectedPerson(existingActivity.personId);
    }
  }, [existingActivity]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      Alert.alert('Erro', 'Título é obrigatório.');
      return;
    }

    if (!selectedPerson) {
      Alert.alert('Erro', 'Selecione uma pessoa para atribuir a atividade.');
      return;
    }

    const startDate = new Date(formData.startDate);
    const deadline = new Date(formData.deadline);

    if (deadline <= startDate) {
      Alert.alert('Erro', 'O prazo deve ser posterior à data de início.');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && existingActivity) {
        const updatedActivity: Activity = {
          ...existingActivity,
          title: formData.title.trim(),
          description: formData.description.trim(),
          personId: selectedPerson,
          startDate,
          deadline,
          reminderEnabled: formData.reminderEnabled,
          history: [
            ...existingActivity.history,
            createActivityHistoryEntry('Atividade editada'),
          ],
          updatedAt: new Date(),
        };
        await updateActivity(updatedActivity);
      } else {
        const activity: Activity = {
          id: generateId(),
          title: formData.title.trim(),
          description: formData.description.trim(),
          personId: selectedPerson,
          startDate,
          deadline,
          status: 'pending' as ActivityStatus,
          reminderEnabled: formData.reminderEnabled,
          history: [createActivityHistoryEntry('Atividade criada')],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await addActivity(activity);
      }

      router.back();
    } catch (error) {
      console.error('Error saving activity:', error);
      Alert.alert('Erro', 'Não foi possível salvar a atividade.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Voltar"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
        />
        <Text style={styles.title}>
          {isEditing ? 'Editar Atividade' : 'Nova Atividade'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Título *</Text>
            <TextInput
              style={styles.input}
              value={formData.title}
              onChangeText={(text) => setFormData(prev => ({ ...prev, title: text }))}
              placeholder="Digite o título da atividade"
              autoCapitalize="sentences"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Descrição</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Descreva a atividade..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Atribuir para *</Text>
            <View style={styles.peopleGrid}>
              {people.map((person) => (
                <Button
                  key={person.id}
                  title={person.name}
                  onPress={() => setSelectedPerson(person.id)}
                  variant={selectedPerson === person.id ? 'primary' : 'secondary'}
                  size="small"
                  style={styles.personButton}
                />
              ))}
            </View>
            {people.length === 0 && (
              <Text style={styles.noPeopleText}>
                Nenhuma pessoa cadastrada. Adicione pessoas primeiro.
              </Text>
            )}
          </View>

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Data de Início</Text>
              <TextInput
                style={styles.input}
                value={formData.startDate}
                onChangeText={(text) => setFormData(prev => ({ ...prev, startDate: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.dateField}>
              <Text style={styles.fieldLabel}>Prazo Final *</Text>
              <TextInput
                style={styles.input}
                value={formData.deadline}
                onChangeText={(text) => setFormData(prev => ({ ...prev, deadline: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>

          <View style={styles.reminderSection}>
            <View style={styles.reminderRow}>
              <View style={styles.reminderInfo}>
                <Bell size={20} color="#6B7280" />
                <Text style={styles.reminderLabel}>Ativar Lembretes</Text>
              </View>
              <Switch
                value={formData.reminderEnabled}
                onValueChange={(value) => setFormData(prev => ({ ...prev, reminderEnabled: value }))}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={formData.reminderEnabled ? '#2563EB' : '#9CA3AF'}
              />
            </View>
            <Text style={styles.reminderDescription}>
              Receba notificações sobre prazos desta atividade
            </Text>
          </View>

          <Button
            title={loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Atividade'}
            onPress={handleSave}
            disabled={loading || !formData.title.trim() || !selectedPerson || people.length === 0}
            style={styles.saveButton}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  field: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
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
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  peopleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  personButton: {
    marginBottom: 8,
  },
  noPeopleText: {
    fontSize: 14,
    color: '#DC2626',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateField: {
    flex: 1,
  },
  reminderSection: {
    marginBottom: 20,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 8,
  },
});