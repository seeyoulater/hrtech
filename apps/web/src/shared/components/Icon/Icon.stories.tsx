import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';

const NAMES = [
  'plus',
  'trash',
  'copy',
  'check',
  'home',
  'refresh',
  'logo',
  'arrow-out',
] as const;

const meta = {
  title: 'UI/Icon',
  component: Icon,
  args: { name: 'plus', size: 24 },
  argTypes: {
    name: { control: 'select', options: NAMES },
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Gallery: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        padding: 16,
      }}
    >
      {NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: '#1f7a4a',
          }}
        >
          <Icon name={name} size={28} />
          <code style={{ fontSize: 12, color: '#6b6b73' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};
