import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { PhotoPicker } from '@/components/PhotoPicker';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Company } from '@/types/app';
import { generateId } from '@/utils/generators';
import { useRouter } from 'expo-router';

export default function CompanySetupScreen() {
  const { saveCompany, updateSettings, settings } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    address: '',
    email: '',
    phone: '',
    logo: '',
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da empresa é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      
      const company: Company = {
        id: generateId(),
        name: formData.name.trim(),
        cnpj: formData.cnpj.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        logo: formData.logo,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await saveCompany(company);
      
      // Mark as initialized
      const updatedSettings = {
        ...settings,
        initialized: true,
      };
      await updateSettings(updatedSettings);
      
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving company:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados da empresa.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Pular"
          onPress={async () => {
            const updatedSettings = {
              ...settings,
              initialized: true,
            };
            await updateSettings(updatedSettings);
            router.replace('/(tabs)');
          }}
          variant="secondary"
          size="small"
        />
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.welcomeHeader}>
          <Building2 size={32} color="#2563EB" />
          <Text style={styles.title}>Configuração Inicial</Text>
          <Text style={styles.subtitle}>
            Configure os dados da sua empresa para começar
          </Text>
        </View>

        <Card style={styles.card}>
          <View style={styles.photoSection}>
            <Text style={styles.fieldLabel}>Logo da Empresa</Text>
            <PhotoPicker
              currentPhoto={formData.logo}
              onPhotoSelected={(uri) => setFormData(prev => ({ ...prev, logo: uri }))}
              placeholder="company"
              size={100}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Nome da Empresa *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="Digite o nome da empresa"
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>CNPJ</Text>
            <TextInput
              style={styles.input}
              value={formData.cnpj}
              onChangeText={(text) => setFormData(prev => ({ ...prev, cnpj: text }))}
              placeholder="00.000.000/0000-00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Endereço</Text>
            <TextInput
              style={styles.input}
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              placeholder="Endereço completo"
              multiline
              numberOfLines={2}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="contato@empresa.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Telefone</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="(11) 99999-9999"
              keyboardType="phone-pad"
            />
          </View>

          <Button
            title={loading ? 'Salvando...' : 'Concluir Configuração'}
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  placeholder: {
    width: 60,
  },
  welcomeHeader: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
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