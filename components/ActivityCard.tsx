import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, User, Bell, BellOff } from 'lucide-react-native';
import { Activity, Person } from '@/types/app';
import { formatDate, getDaysUntilDeadline, isOverdue } from '@/utils/dateUtils';
import { Card } from './ui/Card';
import { StatusBadge } from './ui/StatusBadge';

interface ActivityCardProps {
  activity: Activity;
  person?: Person;
  onPress: () => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  person,
  onPress,
}) => {
  const deadline = new Date(activity.deadline);
  const daysUntil = getDaysUntilDeadline(deadline);
  const overdue = isOverdue(deadline);

  const getDeadlineText = () => {
    if (activity.status === 'completed') {
      return 'Concluída';
    }
    if (overdue) {
      return `Atrasada ${Math.abs(daysUntil)} dia(s)`;
    }
    if (daysUntil === 0) {
      return 'Vence hoje';
    }
    if (daysUntil === 1) {
      return 'Vence amanhã';
    }
    return `${daysUntil} dias restantes`;
  };

  const getDeadlineColor = () => {
    if (activity.status === 'completed') {
      return '#059669';
    }
    if (overdue) {
      return '#DC2626';
    }
    if (daysUntil <= 1) {
      return '#D97706';
    }
    return '#6B7280';
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={[
        styles.card,
        overdue && activity.status !== 'completed' && styles.overdueCard
      ]}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={2}>
              {activity.title}
            </Text>
            <StatusBadge status={activity.status} size="small" />
          </View>
          {activity.reminderEnabled && (
            <Bell size={16} color="#2563EB" />
          )}
          {!activity.reminderEnabled && (
            <BellOff size={16} color="#9CA3AF" />
          )}
        </View>

        {activity.description && (
          <Text style={styles.description} numberOfLines={2}>
            {activity.description}
          </Text>
        )}

        <View style={styles.footer}>
          <View style={styles.personSection}>
            <User size={14} color="#6B7280" />
            <Text style={styles.personName}>
              {person?.name || 'Pessoa não encontrada'}
            </Text>
          </View>

          <View style={styles.deadlineSection}>
            <Clock size={14} color={getDeadlineColor()} />
            <Text style={[styles.deadlineText, { color: getDeadlineColor() }]}>
              {getDeadlineText()}
            </Text>
          </View>
        </View>

        <Text style={styles.deadlineDate}>
          Prazo: {formatDate(deadline)}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleSection: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  personName: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  deadlineSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  deadlineDate: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'right',
  },
});