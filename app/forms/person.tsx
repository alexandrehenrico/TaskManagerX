import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { PhotoPicker } from '@/components/PhotoPicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Person } from '@/types/app';
import { generateId } from '@/utils/generators';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function PersonFormScreen() {
  const { people, addPerson, updatePerson } = useApp();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  
  const isEditing = !!id;
  const existingPerson = isEditing ? people.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: '',
    position: '',
    contact: '',
    profilePhoto: '',
  });

  useEffect(() => {
    if (existingPerson) {
      setFormData({
        name: existingPerson.name,
        position: existingPerson.position,
        contact: existingPerson.contact,
        profilePhoto: existingPerson.profilePhoto || '',
      });
    }
  }, [existingPerson]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      
      if (isEditing && existingPerson) {
        const updatedPerson: Person = {
          ...existingPerson,
          name: formData.name.trim(),
          position: formData.position.trim(),
          contact: formData.contact.trim(),
          profilePhoto: formData.profilePhoto,
          updatedAt: new Date(),
        };
        await updatePerson(updatedPerson);
      } else {
        const person: Person = {
          id: generateId(),
          name: formData.name.trim(),
          position: formData.position.trim(),
          contact: formData.contact.trim(),
          profilePhoto: formData.profilePhoto,
          activityHistory: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await addPerson(person);
      }

      router.back();
    } catch (error) {
      console.error('Error saving person:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados da pessoa.');
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
          {isEditing ? 'Editar Pessoa' : 'Nova Pessoa'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <View style={styles.photoSection}>
            <Text style={styles.fieldLabel}>Foto de Perfil</Text>
            <PhotoPicker
              currentPhoto={formData.profilePhoto}
              onPhotoSelected={(uri) => setFormData(prev => ({ ...prev, profilePhoto: uri }))}
              placeholder="person"
              size={120}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nome Completo *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Digite o nome completo"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Cargo</Text>
            <TextInput
              style={styles.input}
              value={formData.position}
              onChangeText={(text) => setFormData(prev => ({ ...prev, position: text }))}
              placeholder="Ex: Gerente, Desenvolvedor, Analista"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Contato</Text>
            <TextInput
              style={styles.input}
              value={formData.contact}
              onChangeText={(text) => setFormData(prev => ({ ...prev, contact: text }))}
              placeholder="Telefone ou e-mail"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Button
            title={loading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Adicionar Pessoa'}
            onPress={handleSave}
            disabled={loading || !formData.name.trim()}
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
    width: 60, // Same width as back button for centering
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
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
  saveButton: {
    marginTop: 8,
  },
});