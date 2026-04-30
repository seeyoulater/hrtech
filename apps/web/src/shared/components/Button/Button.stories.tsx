import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';
import { Icon } from '@/shared/components/Icon';

const meta = {
  title: 'UI/Button',
  component: Button,
  args: {
    children: 'Continue',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'destructive'],
    },
    size: { control: 'select', options: ['md', 'lg'] },
    fullWidth: { control: 'boolean' },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Destructive: Story = {
  args: { variant: 'destructive', children: 'Delete' },
};

export const Large: Story = { args: { size: 'lg' } };
export const FullWidth: Story = { args: { fullWidth: true, size: 'lg' } };

export const WithLeftIcon: Story = {
  args: { iconLeft: <Icon name="plus" size={16} />, children: 'Create New' },
};

export const Loading: Story = { args: { loading: true, size: 'lg' } };
export const DisabledPrimary: Story = {
  args: { disabled: true, children: 'Generate Now', size: 'lg', fullWidth: true },
};
export const DisabledSecondary: Story = {
  args: { disabled: true, variant: 'secondary' },
};
