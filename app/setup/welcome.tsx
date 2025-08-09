import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building2, Users, SquareCheck as CheckSquare, ArrowRight } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';

export default function WelcomeScreen() {
  const router = useRouter();
  const { updateSettings, settings } = useApp();

  const handleSkipSetup = async () => {
    try {
      const updatedSettings = {
        ...settings,
        initialized: true,
      };
      await updateSettings(updatedSettings);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error skipping setup:', error);
    }
  };

  const handleStartSetup = () => {
    router.push('/setup/company');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>
              TaskManager<Text style={styles.logoX}>X</Text>
            </Text>
          </View>
          
          <Text style={styles.title}>Bem-vindo!</Text>
          <Text style={styles.subtitle}>
            Configure sua empresa e comece a gerenciar atividades de forma eficiente
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <Card style={styles.featureCard}>
            <View style={styles.featureContent}>
              <Building2 size={32} color="#2563EB" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Configure sua Empresa</Text>
                <Text style={styles.featureDescription}>
                  Adicione informações da sua empresa para personalizar o app
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <View style={styles.featureContent}>
              <Users size={32} color="#059669" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Gerencie Pessoas</Text>
                <Text style={styles.featureDescription}>
                  Cadastre sua equipe e atribua atividades facilmente
                </Text>
              </View>
            </View>
          </Card>

          <Card style={styles.featureCard}>
            <View style={styles.featureContent}>
              <CheckSquare size={32} color="#D97706" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Controle Atividades</Text>
                <Text style={styles.featureDescription}>
                  Acompanhe prazos, status e histórico de todas as tarefas
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            title="Configurar Empresa"
            onPress={handleStartSetup}
            style={styles.primaryButton}
          />
          
          <Button
            title="Pular Configuração"
            onPress={handleSkipSetup}
            variant="secondary"
            style={styles.secondaryButton}
          />
          
          <Text style={styles.skipNote}>
            Você pode configurar sua empresa a qualquer momento nas configurações
          </Text>
        </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -1,
  },
  logoX: {
    color: '#2563EB',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    padding: 16,
    gap: 16,
  },
  featureCard: {
    padding: 20,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    marginLeft: 16,
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  primaryButton: {
    marginBottom: 12,
  },
  secondaryButton: {
    marginBottom: 16,
  },
  skipNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});