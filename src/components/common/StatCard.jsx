import React from 'react';
import { Card, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const StatCard = ({ title, value, prefix, suffix, trend, trendType = 'up', icon, color = '#1e3a8a', loading = false }) => {
  const isPositive = trendType === 'up' || (trend && trend.startsWith('+'));
  
  return (
    <Card 
      loading={loading}
      hoverable 
      style={{ borderRadius: 10, border: '1px solid var(--ir-border)' }}
      bodyStyle={{ padding: '16px 20px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Text type="secondary" style={{ fontSize: 13, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {title}
          </Text>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4, fontFamily: 'Outfit, sans-serif' }}>
            {prefix} {value} {suffix}
          </div>
        </div>
        {icon && (
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${color}15`,
            color: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22
          }}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
          <span style={{ 
            color: isPositive ? '#059669' : '#dc2626',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2
          }}>
            {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            {trend}
          </span>
        </div>
      )}
    </Card>
  );
};
