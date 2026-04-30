import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';

/** A small sample of the icons used across the app. */
const SAMPLE = [
  'carbon:add',
  'carbon:trash-can',
  'carbon:copy',
  'carbon:checkmark',
  'carbon:home',
  'carbon:renew',
  'carbon:arrow-up-right',
  'carbon:warning',
  'carbon:information',
  'carbon:settings',
  'streamline:waving-hand',
  'streamline:rocket',
] as const;

const meta = {
  title: 'UI/Icon',
  component: Icon,
  args: { name: 'carbon:add', size: 24 },
  argTypes: {
    name: { control: 'text', description: 'Any `carbon:*` or `streamline:*` icon name.' },
    size: { control: 'select', options: [12, 14, 16, 18, 24] },
    color: { control: 'color' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center', color: '#1f7a4a' }}>
      {([12, 14, 16, 18, 24] as const).map((s) => (
        <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <Icon name="carbon:add" size={s} />
          <code style={{ fontSize: 11, color: '#6b6b73' }}>{s}px</code>
        </div>
      ))}
    </div>
  ),
};

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
      {SAMPLE.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            color: '#1f7a4a',
          }}
        >
          <Icon name={name} size={24} />
          <code style={{ fontSize: 11, color: '#6b6b73' }}>{name}</code>
        </div>
      ))}
    </div>
  ),
};

export const TintedColor: Story = {
  args: { name: 'carbon:warning', size: 24, color: '#e85d5d' },
};
