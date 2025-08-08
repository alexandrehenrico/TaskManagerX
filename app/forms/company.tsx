import React, { useState, useEffect } from 'react';
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

export default function CompanyFormScreen() {
  const { company, saveCompany } = useApp();
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

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        cnpj: company.cnpj,
        address: company.address,
        email: company.email,
        phone: company.phone,
        logo: company.logo || '',
      });
    }
  }, [company]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Erro', 'Nome da empresa é obrigatório.');
      return;
    }

    try {
      setLoading(true);
      
      const companyData: Company = {
        id: company?.id || generateId(),
        name: formData.name.trim(),
        cnpj: formData.cnpj.trim(),
        address: formData.address.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        logo: formData.logo,
        createdAt: company?.createdAt || new Date(),
        updatedAt: new Date(),
      };

      await saveCompany(companyData);
      router.back();
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
          title="Voltar"
          onPress={() => router.back()}
          variant="secondary"
          size="small"
        />
        <Text style={styles.title}>
          {company ? 'Editar Empresa' : 'Configurar Empresa'}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <View style={styles.photoSection}>
            <Text style={styles.fieldLabel}>Logo da Empresa</Text>
            <PhotoPicker
              currentPhoto={formData.logo}
              onPhotoSelected={(uri) => setFormData(prev => ({ ...prev, logo: uri }))}
              placeholder="company"
              size={120}
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
              style={[styles.input, styles.textArea]}
              value={formData.address}
              onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              placeholder="Endereço completo"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
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
            title={loading ? 'Salvando...' : company ? 'Atualizar' : 'Salvar'}
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
    width: 60,
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
  textArea: {
    height: 80,
    paddingTop: 12,
  },
  saveButton: {
    marginTop: 8,
  },
});