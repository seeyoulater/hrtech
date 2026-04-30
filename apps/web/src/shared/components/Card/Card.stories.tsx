import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';

const meta = {
  title: 'UI/Card',
  component: Card,
  args: {
    tone: 'subtle',
    children: 'Cards are surface containers. Pick `tone` to match the surrounding context.',
  },
  argTypes: {
    tone: { control: 'radio', options: ['subtle', 'plain'] },
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <Card {...args} />
    </div>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Subtle: Story = { args: { tone: 'subtle' } };
export const Plain: Story = { args: { tone: 'plain' } };
