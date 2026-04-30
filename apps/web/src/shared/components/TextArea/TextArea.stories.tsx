import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextArea } from './TextArea';

const meta = {
  title: 'UI/TextArea',
  component: TextArea,
  args: {
    label: 'Additional details',
    placeholder: "What should we mention? Projects, results, what you're looking for…",
    showCounter: true,
    countMax: 1200,
  },
  render: (args) => (
    <div style={{ width: 420 }}>
      <TextArea {...args} />
    </div>
  ),
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Filled: Story = {
  args: {
    defaultValue:
      'I want to help you build awesome solutions to accomplish your goals and vision.',
    count: 88,
  },
};

export const OverLimit: Story = {
  args: {
    defaultValue: 'a'.repeat(1290),
    count: 1290,
    error: true,
  },
};
