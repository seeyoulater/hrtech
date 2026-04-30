import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
  title: 'UI/Spinner',
  component: Spinner,
  args: { size: 24 },
  argTypes: {
    size: { control: { type: 'range', min: 12, max: 64, step: 2 } },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const OnDarkSurface: Story = {
  parameters: { backgrounds: { default: 'muted' } },
  render: (args) => (
    <div
      style={{
        background: '#1f7a4a',
        color: '#fff',
        padding: 24,
        borderRadius: 8,
      }}
    >
      <Spinner {...args} />
    </div>
  ),
};
