import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ApplicationForm } from './ApplicationForm';

const meta = {
  title: 'App/ApplicationForm',
  component: ApplicationForm,
  args: {
    onSubmit: fn(),
    loading: false,
    hasGenerated: false,
  },
  argTypes: {
    loading: { control: 'boolean' },
    hasGenerated: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <ApplicationForm {...args} />
    </div>
  ),
} satisfies Meta<typeof ApplicationForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Prefilled: Story = {
  args: {
    defaultValues: {
      jobTitle: 'Product manager',
      company: 'Apple',
      strengths: 'HTML, CSS and doing things in time',
      details:
        'I want to help you build awesome solutions to accomplish your goals and vision.',
    },
  },
};

export const HasGenerated: Story = {
  args: {
    hasGenerated: true,
    defaultValues: {
      jobTitle: 'Product manager',
      company: 'Apple',
      strengths: '',
      details: '',
    },
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    defaultValues: {
      jobTitle: 'Product manager',
      company: 'Apple',
      strengths: '',
      details: '',
    },
  },
};
