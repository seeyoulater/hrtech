import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';
import { Icon } from '@/shared/components/Icon';

const meta = {
  title: 'UI/IconButton',
  component: IconButton,
  args: {
    label: 'Home',
    children: <Icon name="home" />,
    variant: 'outline',
  },
  argTypes: {
    variant: { control: 'radio', options: ['outline', 'ghost'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
