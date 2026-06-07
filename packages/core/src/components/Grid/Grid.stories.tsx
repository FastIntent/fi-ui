import React from 'react';
import type { Meta } from '@storybook/react';
import { Row, Col } from './Grid';

const meta: Meta = {
  title: 'Components/Grid',
  tags: ['autodocs'],
};

export default meta;

const DemoBox: React.FC<{ children: React.ReactNode; value?: number }> = ({ children }) => (
  <div
    style={{
      background: '#0092ff',
      padding: '32px 0',
      color: '#fff',
      textAlign: 'center',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 500,
    }}
  >
    {children}
  </div>
);

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      margin: '0 0 32px',
      paddingBottom: 12,
      borderBottom: '1px solid #f0f0f0',
      fontWeight: 600,
      fontSize: 20,
      color: '#1d1d1d',
    }}
  >
    {title}
  </div>
);

const StoryContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ padding: '24px', background: '#fff', width: '100%' }}>{children}</div>
);

export const Horizontal = () => (
  <StoryContainer>
    <SectionTitle title="Horizontal" />
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
    </Row>
  </StoryContainer>
);

export const Responsive = () => (
  <StoryContainer>
    <SectionTitle title="Responsive" />
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
    </Row>
  </StoryContainer>
);

export const Vertical = () => (
  <StoryContainer>
    <SectionTitle title="Vertical" />
    <Row gutter={[16, 16]}>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
    </Row>
  </StoryContainer>
);

export const Gutter = () => (
  <StoryContainer>
    <SectionTitle title="Gutter(string)" />
    <Row gutter={[32, 16]}>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
      <Col span={6}>
        <DemoBox>col-6</DemoBox>
      </Col>
    </Row>
  </StoryContainer>
);

export const Offset = () => (
  <StoryContainer>
    <SectionTitle title="Column offset" />
    <Row>
      <Col span={8}>
        <DemoBox>col-8</DemoBox>
      </Col>
      <Col span={8} offset={8}>
        <div
          style={{
            background: '#0092ff',
            padding: '32px 0',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          col-8
        </div>
      </Col>
    </Row>
    <div style={{ height: 24 }} />
    <Row>
      <Col span={6} offset={6}>
        <div
          style={{
            background: '#5ca9ff',
            padding: '32px 0',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          col-6 col-offset-6
        </div>
      </Col>
      <Col span={6} offset={6}>
        <div
          style={{
            background: '#0092ff',
            padding: '32px 0',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          col-6 col-offset-6
        </div>
      </Col>
    </Row>
    <div style={{ height: 24 }} />
    <Row>
      <Col span={12} offset={6}>
        <div
          style={{
            background: '#5ca9ff',
            padding: '32px 0',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          col-12 col-offset-6
        </div>
      </Col>
    </Row>
  </StoryContainer>
);
