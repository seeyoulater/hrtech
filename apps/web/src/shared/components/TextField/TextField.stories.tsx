import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextField } from './TextField';

const meta = {
  title: 'UI/TextField',
  component: TextField,
  args: {
    label: 'Job title',
    placeholder: 'Product manager',
    error: false,
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <TextField {...args} />
    </div>
  ),
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = { args: { defaultValue: 'Senior Engineer' } };
export const Error: Story = {
  args: { error: true, defaultValue: 'Invalid value' },
};
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Locked' } };
