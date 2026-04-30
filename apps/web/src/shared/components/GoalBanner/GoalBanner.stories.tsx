import type { Meta, StoryObj } from '@storybook/react-vite';
import { GoalBanner } from './GoalBanner';

const meta = {
  title: 'App/GoalBanner',
  component: GoalBanner,
  args: { count: 3 },
  argTypes: {
    count: { control: { type: 'number', min: 0, max: 5 } },
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <GoalBanner {...args} />
    </div>
  ),
} satisfies Meta<typeof GoalBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Zero: Story = { args: { count: 0 } };
export const Midway: Story = { args: { count: 3 } };
export const NearGoal: Story = { args: { count: 4 } };
export const HiddenAtGoal: Story = {
  args: { count: 5 },
  parameters: {
    docs: { description: { story: 'Renders nothing once the goal is met.' } },
  },
};
