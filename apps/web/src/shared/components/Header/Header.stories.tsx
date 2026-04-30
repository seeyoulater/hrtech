import type { Meta, StoryObj } from '@storybook/react-vite';
import { Header } from './Header';

const meta = {
  title: 'App/Header',
  component: Header,
  args: { count: 3 },
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 8 } },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { count: 0 } };
export const InProgress: Story = { args: { count: 3 } };
export const GoalAchieved: Story = { args: { count: 5 } };
export const Overshoot: Story = { args: { count: 7 } };
