import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressDots } from './ProgressDots';

const meta = {
  title: 'UI/ProgressDots',
  component: ProgressDots,
  args: { total: 5, filled: 3, size: 'sm' },
  argTypes: {
    total: { control: { type: 'number', min: 1, max: 12 } },
    filled: { control: { type: 'number', min: 0, max: 12 } },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof ProgressDots>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = { args: { size: 'sm' } };
export const Medium: Story = { args: { size: 'md' } };
export const AllFilled: Story = { args: { filled: 5 } };
export const Empty: Story = { args: { filled: 0 } };
