import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Bell, Trash2, User } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const { company, settings, updateSettings } = useApp();
  const router = useRouter();
  const [localSettings, setLocalSettings] = useState(settings);

  const updateNotificationSetting = async (key: string, value: any) => {
    const updatedSettings = {
      ...localSettings,
      notifications: {
        ...localSettings.notifications,
        [key]: value,
      },
    };
    setLocalSettings(updatedSettings);
    await updateSettings(updatedSettings);
  };

  const confirmClearData = () => {
    Alert.alert(
      'Limpar Todos os Dados',
      'Esta ação não pode ser desfeita. Todos os dados serão removidos permanentemente.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive', 
          onPress: () => {
            // For now, just show message - actual implementation would clear storage
            Alert.alert('Funcionalidade em desenvolvimento', 'Em breve você poderá limpar todos os dados.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configurações</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Company Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Empresa</Text>
          <Card style={styles.card}>
            <View style={styles.companyHeader}>
              <View style={styles.companyInfo}>
                <Building2 size={24} color="#2563EB" />
                <View style={styles.companyDetails}>
                  <Text style={styles.companyName}>
                    {company?.name || 'Empresa não configurada'}
                  </Text>
                  {company?.cnpj && (
                    <Text style={styles.companySubtitle}>
                      CNPJ: {company.cnpj}
                    </Text>
                  )}
                </View>
              </View>
              <Button
                title="Editar"
                onPress={() => router.push('/forms/company')}
                variant="secondary"
                size="small"
              />
            </View>
          </Card>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          
          <Card style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Bell size={20} color="#6B7280" />
                <Text style={styles.settingLabel}>Notificações Ativas</Text>
              </View>
              <Switch
                value={localSettings.notifications.enabled}
                onValueChange={(value) => updateNotificationSetting('enabled', value)}
                trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                thumbColor={localSettings.notifications.enabled ? '#2563EB' : '#9CA3AF'}
              />
            </View>
          </Card>

          {localSettings.notifications.enabled && (
            <>
              <Card style={styles.card}>
                <View style={styles.settingRow}>
                  <View style={styles.settingInfo}>
                    <Text style={styles.settingLabel}>Som das Notificações</Text>
                  </View>
                  <Switch
                    value={localSettings.notifications.soundEnabled}
                    onValueChange={(value) => updateNotificationSetting('soundEnabled', value)}
                    trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
                    thumbColor={localSettings.notifications.soundEnabled ? '#2563EB' : '#9CA3AF'}
                  />
                </View>
              </Card>

              <Card style={styles.card}>
                <View style={styles.settingColumn}>
                  <Text style={styles.settingLabel}>Horário do Resumo Diário</Text>
                  <Text style={styles.settingValue}>
                    {localSettings.notifications.dailySummaryTime}
                  </Text>
                  <Text style={styles.settingDescription}>
                    Receba um resumo das atividades do dia
                  </Text>
                </View>
              </Card>

              <Card style={styles.card}>
                <View style={styles.settingColumn}>
                  <Text style={styles.settingLabel}>Lembrete Antecipado</Text>
                  <Text style={styles.settingValue}>
                    {localSettings.notifications.reminderBeforeDays} dia(s) antes
                  </Text>
                  <Text style={styles.settingDescription}>
                    Receba lembretes antes do prazo das atividades
                  </Text>
                </View>
              </Card>
            </>
          )}
        </View>>
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
    padding: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 4,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyDetails: {
    marginLeft: 12,
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  companySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingColumn: {
    gap: 4,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginLeft: 8,
  },
  settingValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563EB',
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  dangerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dangerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginLeft: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: '#991B1B',
    marginLeft: 8,
    marginTop: 2,
  },
});